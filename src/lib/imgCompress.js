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

export async function compressImage(file, maxSizeKB = 200, maxDimension = 1600) {
  if (!file) throw new Error('No image selected')
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Please choose a JPEG, PNG, or WebP image.')
  }

  const img = await loadImage(file)
  const outputType = supportsWebp() ? 'image/webp' : 'image/jpeg'
  
  let currentMaxDim = maxDimension
  let quality = 0.85
  let canvas = document.createElement('canvas')
  let { width, height } = scaleToFit(img, currentMaxDim)
  canvas.width = width
  canvas.height = height
  let ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  let blob = await canvasToBlob(canvas, outputType, quality)

  while (blob && blob.size > maxSizeKB * 1024 && quality > 0.2) {
    quality -= 0.1
    if (quality < 0.5 && currentMaxDim > 800) {
      currentMaxDim -= 200
      const scaled = scaleToFit(img, currentMaxDim)
      canvas.width = scaled.width
      canvas.height = scaled.height
      ctx.drawImage(img, 0, 0, scaled.width, scaled.height)
    }
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
