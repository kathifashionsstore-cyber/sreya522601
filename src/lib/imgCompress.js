function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function scaleToFit(img, maxDimension) {
  const ratio = Math.min(maxDimension / img.width, maxDimension / img.height, 1)
  return {
    width: Math.round(img.width * ratio),
    height: Math.round(img.height * ratio),
  }
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

function supportsWebp() {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').startsWith('data:image/webp')
}

export async function compressImage(file, maxSizeKB = 300, maxDimension = 1600) {
  if (!file) throw new Error('No image selected')
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Please choose a JPEG, PNG, or WebP image.')
  }

  const img = await loadImage(file)
  const canvas = document.createElement('canvas')
  const { width, height } = scaleToFit(img, maxDimension)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  const outputType = supportsWebp() ? 'image/webp' : 'image/jpeg'
  let quality = 0.9
  let blob = await canvasToBlob(canvas, outputType, quality)
  while (blob && blob.size > maxSizeKB * 1024 && quality > 0.3) {
    quality -= 0.1
    blob = await canvasToBlob(canvas, outputType, quality)
  }

  return {
    blob,
    fileName: `${file.name.replace(/\.[^.]+$/, '')}.${outputType === 'image/webp' ? 'webp' : 'jpg'}`,
    mimeType: outputType,
    originalSizeKB: Math.round(file.size / 1024),
    compressedSizeKB: Math.round((blob?.size || 0) / 1024),
    savingsPercent: Math.max(0, Math.round((1 - (blob?.size || file.size) / file.size) * 100)),
  }
}
