import { useState, useRef } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../lib/firebase'
import { compressImage } from '../../lib/imgCompress'
import { Upload, X, Loader2, Play, Image as ImageIcon, Video, FileText } from 'lucide-react'
import { Button } from '../shared/Button'
import { Input } from '../shared/Input'

export function ImageUploadField({ value, onChange, label }) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const isVideoUrl = (url) => {
    if (!url) return false
    const cleanUrl = String(url).toLowerCase().trim()
    return (
      cleanUrl.endsWith('.mp4') ||
      cleanUrl.endsWith('.webm') ||
      cleanUrl.endsWith('.ogg') ||
      cleanUrl.includes('youtube.com') ||
      cleanUrl.includes('youtu.be')
    )
  }

  const uploadFile = async (file) => {
    if (!file) return
    setUploading(true)
    setProgress(0)
    setError('')
    setCaption('')

    try {
      let fileToUpload = file
      let fileName = file.name
      const isImg = file.type.startsWith('image/')
      const isVid = file.type.startsWith('video/')

      if (!isImg && !isVid) {
        throw new Error('Unsupported file type. Please upload an image or video.')
      }

      if (isImg) {
        try {
          setCaption('Compressing...')
          const compressed = await compressImage(file, 300, 1600)
          fileToUpload = compressed.blob
          fileName = compressed.fileName
          setCaption(`${compressed.originalSizeKB}KB to ${compressed.compressedSizeKB}KB`)
        } catch (compressionError) {
          console.warn('Compression failed, uploading original image:', compressionError)
        }
      }

      setCaption(isImg ? 'Uploading image...' : 'Uploading video...')
      console.log('[STORAGE UPLOAD START] file:', fileName, 'size:', fileToUpload.size, 'type:', file.type)
      const storageRef = ref(storage, `uploads/${Date.now()}_${fileName}`)
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload)

      let hasProgress = false
      const timeoutId = setTimeout(() => {
        if (!hasProgress) {
          console.warn('[STORAGE UPLOAD TIMEOUT] Firebase Storage connection timed out, cancelling upload to fallback...')
          uploadTask.cancel()
        }
      }, 4000)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          setProgress(percent)
          console.log(`[STORAGE UPLOAD PROGRESS] file: "${fileName}", progress: ${percent}%`)
          if (percent > 0) {
            hasProgress = true
          }
        },
        async (uploadError) => {
          clearTimeout(timeoutId)
          console.warn('[STORAGE UPLOAD FAILED] Firebase Storage error, attempting ImgBB fallback...', uploadError)
          if (isImg) {
            try {
              setCaption('Retrying upload (fallback)...')
              const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '29ac7361c1d45b204ccd1955079102d7'
              const clientForm = new FormData()
              clientForm.append('image', fileToUpload)
              
              const clientRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: clientForm,
              })
              const clientData = await clientRes.json()
              if (clientRes.ok && clientData.success) {
                console.log('[STORAGE UPLOAD SUCCESS] ImgBB URL generated:', clientData.data.url)
                onChange(clientData.data.url)
                setUploading(false)
                setProgress(100)
                setCaption('Done (fallback)')
              } else {
                throw new Error(clientData.error?.message || 'Direct upload failed')
              }
            } catch (fallbackError) {
              console.error('[STORAGE UPLOAD ERROR] Fallback failed:', fallbackError)
              setError(fallbackError.message || 'Upload failed')
              setUploading(false)
            }
          } else {
            console.error('[STORAGE UPLOAD ERROR] Firebase Storage failed for video:', uploadError)
            setError(uploadError.message || 'Firebase upload failed')
            setUploading(false)
          }
        },
        async () => {
          clearTimeout(timeoutId)
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
          console.log('[STORAGE UPLOAD SUCCESS] Firebase Storage URL generated:', downloadUrl)
          onChange(downloadUrl)
          setUploading(false)
          setProgress(100)
        }
      )
    } catch (err) {
      setError(err.message || 'An error occurred during upload')
      setUploading(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) {
      await uploadFile(file)
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      await uploadFile(file)
    }
  }

  const handleClear = () => {
    onChange('')
    setCaption('')
    setError('')
    setProgress(0)
  }

  return (
    <div className="grid gap-4 w-full text-left">
      {/* Upload area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          dragOver
            ? 'border-brand-teal bg-[#F5F9F8]/60 scale-[0.99]'
            : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploading}
        />

        {value ? (
          <div className="relative w-full flex flex-col items-center gap-3">
            {/* Preview */}
            <div className="relative h-44 w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-black flex items-center justify-center shadow-soft group">
              {isVideoUrl(value) ? (
                value.includes('youtube.com') || value.includes('youtu.be') ? (
                  <div className="flex flex-col items-center text-slate-400">
                    <Play className="size-10 text-brand-rose mb-2" />
                    <span className="text-xs font-bold px-3 text-center truncate max-w-xs">{value}</span>
                  </div>
                ) : (
                  <video src={value} className="h-full w-full object-contain" muted controls />
                )
              ) : (
                <img src={value} alt="Preview" className="h-full w-full object-contain" />
              )}
              
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition animate-fadeIn"
                aria-label="Remove asset"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 truncate max-w-xs">{value}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {uploading ? (
              <div className="space-y-3 flex flex-col items-center">
                <Loader2 className="size-10 animate-spin text-brand-teal" />
                <p className="text-xs font-black text-brand-navy">Processing file... {progress}%</p>
                <div className="h-1.5 w-44 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-brand-teal transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <Upload className="size-10 text-slate-400 mb-3" />
                <p className="text-sm font-black text-brand-navy">Drag & drop files here</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">Supports images (JPG, PNG, WebP) and videos (MP4)</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {caption && !error && (
        <span className="text-xs font-extrabold text-brand-teal text-left">{caption}</span>
      )}
      {error && (
        <span className="text-xs font-extrabold text-rose-600 text-left">⚠️ {error}</span>
      )}

      {/* Manual URL field */}
      <div className="space-y-1 text-left">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Manual URL Override (Optional)</label>
        <Input
          type="text"
          placeholder="https://example.com/image.jpg"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
          Device upload is primary. Alternatively, you can paste an already-hosted image or YouTube video link.
        </p>
      </div>
    </div>
  )
}
