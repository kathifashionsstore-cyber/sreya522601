import { useState, useMemo, useRef } from 'react'
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  CheckCircle, 
  FileText, 
  Eye, 
  EyeOff, 
  Settings as SettingsIcon, 
  TrendingUp, 
  Grid, 
  Search,
  Upload,
  Loader2
} from 'lucide-react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../lib/firebase'
import { compressImage } from '../lib/imgCompress'
import { useFirestoreCollection, saveDocument, updateDocument } from '../hooks/useFirestoreCollection'
import { gallery as fallbackGallery } from '../data/seed'
import { useToast } from '../components/shared/Toast'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/shared/Button'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { ImageUploadField } from '../components/admin/ImageUploadField'

export default function AdminGallery() {
  const { data: dbGallery } = useFirestoreCollection('gallery', fallbackGallery, 'order', true)
  const items = dbGallery || fallbackGallery
  const { push } = useToast()
  const { user } = useAuth()

  // Tabs navigation: default to manage
  const [activeTab, setActiveTab] = useState('manage')

  // Bulk Upload State
  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, text: '' })
  const bulkInputRef = useRef(null)

  // Form State for single edit or add
  const emptyForm = {
    title: '',
    imageUrl: '',
    shortDescription: '',
    category: 'hospital',
    album: 'hospital',
    featured: false,
    homepage: true,
    status: 'published',
    order: items.length + 1,
    active: true
  }

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('')

  // Bulk selections
  const [selectedIds, setSelectedIds] = useState([])
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)

  // Computed dashboard stats
  const stats = useMemo(() => {
    const activeItems = items.filter(item => !item.deletedAt)
    const published = activeItems.filter(item => item.status === 'published').length
    const drafts = activeItems.filter(item => item.status === 'draft').length
    
    return {
      total: activeItems.length,
      published,
      drafts,
    }
  }, [items])

  // Filtered items list
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (item.deletedAt) return false
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      const titleStr = (item.title || '').toLowerCase()
      const idStr = (item.id || '').toLowerCase()
      return titleStr.includes(search) || idStr.includes(search)
    })
  }, [items, searchTerm])

  // Bulk Image Upload Handler
  const handleBulkFilesSelected = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setBulkUploading(true)
    setBulkProgress({ current: 0, total: files.length, text: `Starting upload for ${files.length} images...` })

    let uploadedCount = 0
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        setBulkProgress({ 
          current: i + 1, 
          total: files.length, 
          text: `Uploading (${i + 1}/${files.length}): ${file.name}` 
        })
        
        let fileToUpload = file
        let fileName = file.name

        if (file.type.startsWith('image/')) {
          try {
            const compressed = await compressImage(file, 200, 1600)
            fileToUpload = compressed.blob
            fileName = compressed.fileName
          } catch (compErr) {
            console.warn('Compression fallback:', compErr)
          }
        }

        const storageRef = ref(storage, `uploads/${Date.now()}_${fileName}`)
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload)

        const downloadUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            async (err) => {
              try {
                const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '29ac7361c1d45b204ccd1955079102d7'
                const clientForm = new FormData()
                clientForm.append('image', fileToUpload)
                const clientRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                  method: 'POST',
                  body: clientForm,
                })
                const clientData = await clientRes.json()
                if (clientRes.ok && clientData.success) {
                  resolve(clientData.data.url)
                } else {
                  reject(err)
                }
              } catch (fallbackErr) {
                reject(err)
              }
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref)
              resolve(url)
            }
          )
        })

        await saveDocument('gallery', {
          imageUrl: downloadUrl,
          title: file.name.replace(/\.[^/.]+$/, ''),
          active: true,
          status: 'published',
          homepage: true,
          order: items.length + i + 1,
          createdAt: new Date().toISOString(),
          updatedBy: user?.email || 'admin'
        })
        uploadedCount++
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err)
      }
    }

    setBulkUploading(false)
    push(`Bulk upload complete! Successfully added ${uploadedCount} images.`, 'success')
    setActiveTab('manage')
  }

  // Toggle selection
  const handleSelectToggle = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map(item => item.id))
    } else {
      setSelectedIds([])
    }
  }

  // Save/Update single item handler
  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.imageUrl) {
      push('Please provide an Image URL.', 'error')
      return
    }

    try {
      const payload = {
        ...form,
        updatedBy: user?.email || 'admin',
        updatedAt: new Date().toISOString()
      }

      if (editingId) {
        await updateDocument('gallery', editingId, payload)
        push('Gallery image updated successfully.', 'success')
      } else {
        await saveDocument('gallery', payload)
        push('Gallery image added successfully.', 'success')
      }

      setForm(emptyForm)
      setEditingId(null)
      setActiveTab('manage')
    } catch (error) {
      push(error.message || 'Error saving image.', 'error')
    }
  }

  // Delete single item
  const handleDeleteSingle = async () => {
    if (!deleteConfirmId) return
    try {
      await updateDocument('gallery', deleteConfirmId, {
        deletedAt: new Date().toISOString(),
        updatedBy: user?.email || 'admin'
      })
      push('Image moved to Recently Deleted.', 'success')
      setDeleteConfirmId(null)
    } catch (error) {
      push(error.message || 'Could not delete.', 'error')
    }
  }

  // Bulk Actions
  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => 
        updateDocument('gallery', id, {
          deletedAt: new Date().toISOString(),
          updatedBy: user?.email || 'admin'
        })
      ))
      push(`Successfully deleted ${selectedIds.length} items.`, 'success')
      setSelectedIds([])
      setBulkDeleteConfirm(false)
    } catch (error) {
      push(error.message || 'Error during bulk deletion.', 'error')
    }
  }

  // Edit action
  const handleEditClick = (item) => {
    setForm(item)
    setEditingId(item.id)
    setActiveTab('add')
  }

  return (
    <div className="space-y-6 text-left">
      {/* Main Header Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-navy flex items-center gap-2">
            <ImageIcon className="size-8 text-[#3F8F84]" /> Gallery Manager
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 font-bold">
            Upload images in bulk or individually to display on the hospital gallery.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 rounded-lg p-1 text-xs font-black">
          {[
            { id: 'manage', label: 'All Images', icon: Grid },
            { id: 'bulk', label: 'Bulk Upload', icon: Upload },
            { id: 'add', label: editingId ? 'Edit Image' : 'Single Add', icon: Plus },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                if (tab.id !== 'add') {
                  setEditingId(null)
                  setForm(emptyForm)
                }
              }}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#3F8F84] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* TAB CONTENT: BULK UPLOAD */}
      {activeTab === 'bulk' && (
        <div className="bg-white rounded-xl p-8 shadow-soft border border-slate-100 space-y-6 text-center">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-xl font-black text-brand-navy">Bulk Image Uploader</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Select multiple photos from your device at once. They will automatically be optimized, uploaded to storage, and published directly to the gallery with no text required.
            </p>
          </div>

          <div
            onClick={() => !bulkUploading && bulkInputRef.current?.click()}
            className={`max-w-xl mx-auto border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${
              bulkUploading 
                ? 'border-[#3F8F84] bg-teal-50/50 cursor-wait' 
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-[#3F8F84]'
            }`}
          >
            <input
              ref={bulkInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleBulkFilesSelected}
              disabled={bulkUploading}
            />

            {bulkUploading ? (
              <div className="space-y-4 flex flex-col items-center">
                <Loader2 className="size-12 animate-spin text-[#3F8F84]" />
                <div>
                  <h3 className="text-sm font-black text-brand-navy">{bulkProgress.text}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    {bulkProgress.current} of {bulkProgress.total} completed
                  </p>
                </div>
                <div className="h-2 w-64 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-[#3F8F84] transition-all duration-200"
                    style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="size-16 rounded-full bg-teal-100 flex items-center justify-center text-[#3F8F84]">
                  <Upload className="size-8" />
                </div>
                <div>
                  <h3 className="text-base font-black text-brand-navy">Click or Drag & Drop Multiple Images Here</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Select 5, 10, 20 or more images at once</p>
                </div>
                <Button type="button" size="sm">
                  Choose Files
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ADD / EDIT SINGLE IMAGE FORM */}
      {activeTab === 'add' && (
        <form onSubmit={handleSave} className="bg-white rounded-xl p-6 shadow-soft border border-slate-100 space-y-6">
          <h2 className="text-lg font-black text-brand-navy">
            {editingId ? 'Modify Gallery Item' : 'Add Single Gallery Image'}
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Image Upload</label>
              <ImageUploadField
                value={form.imageUrl}
                onChange={url => setForm({ ...form, imageUrl: url })}
                label="Gallery Image"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase text-slate-700">Optional Title / Label</label>
              <input
                type="text"
                placeholder="e.g. Clinical Room Photo"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#3F8F84] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setForm(emptyForm)
                setEditingId(null)
                setActiveTab('manage')
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? 'Save Changes' : 'Upload Image'}
            </Button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: MANAGE IMAGES TABLE */}
      {activeTab === 'manage' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-3 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs focus:border-[#3F8F84] focus:outline-none"
              />
            </div>

            {selectedIds.length > 0 && (
              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  className="!px-3 !py-1 text-xs bg-red-600 hover:bg-red-700"
                  onClick={() => setBulkDeleteConfirm(true)}
                >
                  <Trash2 className="size-3.5" /> Delete Selected ({selectedIds.length})
                </Button>
              </div>
            )}
          </div>

          {/* Table List */}
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-soft">
            {filteredItems.length > 0 ? (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={selectedIds.length === filteredItems.length && filteredItems.length > 0} 
                      />
                    </th>
                    <th className="p-4">Thumbnail</th>
                    <th className="p-4">Title / ID</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelectToggle(item.id)}
                        />
                      </td>
                      <td className="p-4">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title || 'Gallery thumbnail'} 
                          className="size-16 object-cover rounded-lg border border-slate-200" 
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-extrabold text-slate-800">{item.title || item.id}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="rounded bg-slate-100 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="rounded bg-red-50 px-3 py-1.5 font-bold text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-400 font-bold">
                No gallery images found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIRM DIALOGS */}
      <ConfirmDialog
        open={deleteConfirmId !== null}
        title="Delete Image"
        message="Are you sure you want to move this image to recently deleted?"
        confirmLabel="Move to Deleted"
        onConfirm={handleDeleteSingle}
        onCancel={() => setDeleteConfirmId(null)}
      />

      <ConfirmDialog
        open={bulkDeleteConfirm}
        title="Bulk Delete Images"
        message={`Are you sure you want to delete all ${selectedIds.length} selected images?`}
        confirmLabel="Bulk Delete"
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />
    </div>
  )
}
