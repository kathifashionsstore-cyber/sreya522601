export const themeGroups = [
  {
    title: 'Brand Colors',
    tokens: [
      ['--color-primary', '#0D9488', 'Main brand color (clinical teal)'],
      ['--color-primary-dark', '#0F766E', 'Primary hover states'],
      ['--color-primary-light', '#CCFBF1', 'Subtle brand backgrounds'],
      ['--color-secondary', '#16A34A', 'Success and wellness accents'],
      ['--color-secondary-dark', '#15803D', 'Secondary hover states'],
      ['--color-secondary-light', '#DCFCE7', 'Soft secondary backgrounds'],
      ['--color-accent-gold', '#0D9488', 'Highlights and ratings'],
      ['--color-accent-sage', '#16A34A', 'Wellness and prevention accents'],
      ['--color-accent-blush', '#E0F2FE', 'Soft cool accent'],
    ],
  },
  {
    title: 'Backgrounds & Surfaces',
    tokens: [
      ['--color-bg-base', '#F8FAFC', 'Page background'],
      ['--color-bg-alt', '#F1F5F9', 'Alternate section background'],
      ['--color-bg-dark', '#0F172A', 'Dark section background'],
      ['--color-surface', 'rgba(255, 255, 255, 0.94)', 'Card background'],
      ['--color-surface-hover', 'rgba(13, 148, 136, 0.08)', 'Card hover background'],
      ['--color-border', '#E2E8F0', 'Default borders'],
      ['--color-border-strong', '#CBD5E1', 'Emphasized borders'],
    ],
  },
  {
    title: 'Text',
    tokens: [
      ['--color-text-primary', '#0F172A', 'Headings and primary text'],
      ['--color-text-secondary', '#475569', 'Secondary body text'],
      ['--color-text-muted', '#64748B', 'Captions and timestamps'],
      ['--color-text-inverse', '#FFFFFF', 'Text on dark backgrounds'],
    ],
  },
  {
    title: 'Buttons & Links',
    tokens: [
      ['--color-link', '#0D9488', 'Inline links'],
      ['--color-link-hover', '#0F766E', 'Inline link hover'],
      ['--color-btn-primary-bg', '#0D9488', 'Primary button background'],
      ['--color-btn-primary-text', '#FFFFFF', 'Primary button text'],
      ['--color-btn-secondary-bg', 'transparent', 'Secondary button background'],
      ['--color-btn-secondary-border', '#0D9488', 'Secondary button border'],
    ],
  },
  {
    title: 'Navigation & Footer',
    tokens: [
      ['--color-navbar-bg', '#FFFFFF', 'Navbar background'],
      ['--color-navbar-text', '#0F172A', 'Navbar text'],
      ['--color-footer-bg', '#0F172A', 'Footer background'],
      ['--color-footer-text', '#FFFFFF', 'Footer text'],
      ['--color-announcement-bg', '#0D9488', 'Announcement bar background'],
      ['--color-announcement-text', '#FFFFFF', 'Announcement bar text'],
    ],
  },
  {
    title: 'Status Colors',
    tokens: [
      ['--color-success', '#16A34A', 'Success states'],
      ['--color-warning', '#F59E0B', 'Warning states'],
      ['--color-error', '#DC2626', 'Error states'],
      ['--color-info', '#0EA5E9', 'Informational states'],
      ['--color-hero-overlay-start', 'rgba(15, 23, 42, 0.68)', 'Hero gradient start'],
      ['--color-hero-overlay-end', 'rgba(15, 118, 110, 0.48)', 'Hero gradient end'],
      ['--color-chatbot-bubble-bg', '#0D9488', 'Chatbot floating button'],
      ['--color-scrollbar-thumb', '#CBD5E1', 'Scrollbar thumb'],
    ],
  },
  {
    title: 'Category Accents',
    tokens: [
      ['--color-category-fertility', '#0D9488', 'Fertility category'],
      ['--color-category-testing', '#16A34A', 'Fertility testing category'],
    ],
  },
]

export const typographyOptions = [
  {
    id: 'clinical',
    label: 'Clinical Premium',
    heading: 'Manrope, Inter, system-ui, sans-serif',
    body: 'Inter, Manrope, system-ui, sans-serif',
  },
  {
    id: 'humanist',
    label: 'Humanist Care',
    heading: 'Manrope, Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  {
    id: 'modern',
    label: 'Modern Hospital',
    heading: 'Inter, Manrope, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  {
    id: 'compact',
    label: 'Compact Operations',
    heading: 'Manrope, Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
]

export const fontScales = {
  compact: '0.95',
  normal: '1',
  large: '1.075',
}

export const defaultTheme = {
  colors: Object.fromEntries(themeGroups.flatMap((group) => group.tokens.map(([token, value]) => [token, value]))),
  typography: {
    fontPairing: 'clinical',
    fontScale: 'normal',
  },
}

function isLegacyWarmDefaultTheme(theme = {}) {
  const colors = theme.colors || {}
  return colors['--color-bg-base'] === '#FFF8F2' && colors['--color-text-primary'] === '#4A3A34'
}

export function hexToHsl(hex) {
  const clean = hex.replace('#', '')
  const raw = clean.length === 3 ? clean.split('').map((char) => char + char).join('') : clean
  const r = Number.parseInt(raw.slice(0, 2), 16) / 255
  const g = Number.parseInt(raw.slice(2, 4), 16) / 255
  const b = Number.parseInt(raw.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    if (max === g) h = (b - r) / d + 2
    if (max === b) h = (r - g) / d + 4
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToHex(h, s, l) {
  const hue = h / 360
  const saturation = s / 100
  const lightness = l / 100
  const hueToRgb = (p, q, t) => {
    let next = t
    if (next < 0) next += 1
    if (next > 1) next -= 1
    if (next < 1 / 6) return p + (q - p) * 6 * next
    if (next < 1 / 2) return q
    if (next < 2 / 3) return p + (q - p) * (2 / 3 - next) * 6
    return p
  }
  let r
  let g
  let b
  if (saturation === 0) {
    r = lightness
    g = lightness
    b = lightness
  } else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation
    const p = 2 * lightness - q
    r = hueToRgb(p, q, hue + 1 / 3)
    g = hueToRgb(p, q, hue)
    b = hueToRgb(p, q, hue - 1 / 3)
  }
  const toHex = (channel) => Math.round(channel * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function generateShades(baseHex) {
  const { h, s, l } = hexToHsl(baseHex)
  return {
    base: baseHex,
    dark: hslToHex(h, s, Math.max(l - 15, 5)),
    light: hslToHex(h, Math.max(s - 8, 12), Math.min(l + 30, 95)),
  }
}

const quickThemeBases = [
  ['sreya-clinical-teal', 'Sreya Clinical Teal', '#0D9488', '#16A34A', '#E0F2FE', 'Clean, premium healthcare trust'],
  ['premium-navy', 'Premium Navy', '#0A2E4D', '#0EA5B8', '#22D3EE', 'Premium, clinical authority'],
  ['trust-teal', 'Trust Teal', '#0B4F6C', '#D46A7E', '#E0A84C', 'Calm, clinical trust'],
  ['warm-rose', 'Warm Rose', '#B24E62', '#4A8FA8', '#E0A84C', 'Maternal warmth'],
  ['sage-calm', 'Sage Calm', '#5C8A6E', '#0B4F6C', '#D9A441', 'Wellness, nature'],
  ['classic-navy-gold', 'Classic Navy & Gold', '#0A2E4D', '#C99B3D', '#7FA88A', 'Premium, established'],
  ['lavender-care', 'Lavender Care', '#6B5B95', '#D46A7E', '#88B0A6', 'Gentle, modern'],
  ['coral-hope', 'Coral Hope', '#E36F5E', '#0B4F6C', '#F2C14E', 'Energetic, hopeful'],
  ['ocean-blue', 'Ocean Blue', '#146C94', '#F2C9D1', '#3EB489', 'Fresh, clean'],
  ['mint-fresh', 'Mint Fresh', '#2E9E82', '#0B4F6C', '#F2A65A', 'Clinical fresh'],
  ['sunset-warm', 'Sunset Warm', '#D9713C', '#0B4F6C', '#F2C14E', 'Approachable'],
  ['berry-blossom', 'Berry Blossom', '#9C4F6B', '#4A8FA8', '#E8B4BC', 'Feminine, soft'],
  ['sky-serenity', 'Sky Serenity', '#3D8FB0', '#F2C9D1', '#7FA88A', 'Airy, calm'],
  ['emerald-grace', 'Emerald Grace', '#1E7A5F', '#B24E62', '#E0A84C', 'Confident, natural'],
  ['plum-elegance', 'Plum Elegance', '#5B3758', '#D46A7E', '#C9A66B', 'Sophisticated'],
  ['amber-glow', 'Amber Glow', '#C9821A', '#0B4F6C', '#7FA88A', 'Warm, inviting'],
  ['slate-modern', 'Slate Modern', '#3A4750', '#D46A7E', '#4A8FA8', 'Minimal, tech-forward'],
  ['peach-comfort', 'Peach Comfort', '#E39A73', '#0B4F6C', '#88B0A6', 'Soft, comforting'],
  ['blush-pink', 'Blush Pink', '#D68C9E', '#0B4F6C', '#E0A84C', 'Delicate, caring'],
  ['turquoise-wave', 'Turquoise Wave', '#1B9AAA', '#D46A7E', '#F2C14E', 'Vibrant, coastal'],
  ['indigo-night', 'Indigo Night', '#3B3B98', '#E0A84C', '#7FA88A', 'Bold, premium'],
  ['terracotta-earth', 'Terracotta Earth', '#B5623C', '#0B4F6C', '#8AA88F', 'Grounded, warm'],
  ['lilac-dream', 'Lilac Dream', '#8E7CC3', '#D46A7E', '#F2C9D1', 'Soft, dreamy'],
  ['rosewood', 'Rosewood', '#7D3C4A', '#4A8FA8', '#D9A441', 'Rich, warm trust'],
  ['forest-green', 'Forest Green', '#2F5233', '#B24E62', '#E0A84C', 'Natural, stable'],
  ['powder-blue', 'Powder Blue', '#7EA8C4', '#D46A7E', '#E8B4BC', 'Soft clinical'],
  ['magenta-bloom', 'Magenta Bloom', '#A5386B', '#0B4F6C', '#F2C14E', 'Bold feminine'],
  ['charcoal-minimal', 'Charcoal Minimal', '#2B2B2B', '#D46A7E', '#4A8FA8', 'Sleek, premium'],
  ['gold-standard', 'Gold Standard', '#B8860B', '#0B4F6C', '#7FA88A', 'Prestige, trust'],
  ['aqua-marine', 'Aqua Marine', '#0FA3B1', '#D46A7E', '#F2C14E', 'Fresh, modern'],
  ['periwinkle', 'Periwinkle', '#6C7BC4', '#D46A7E', '#88B0A6', 'Calm, friendly'],
  ['classic-medical-blue', 'Classic Medical Blue', '#005B96', '#B24E62', '#E0A84C', 'Traditional hospital trust'],
  ['warm-terracotta-sage', 'Warm Terracotta & Sage', '#C2673B', '#5C8A6E', '#E0A84C', 'Earthy, balanced'],
]

function buildPresetColors(primaryHex, secondaryHex, accentHex, id) {
  const primary = generateShades(primaryHex)
  const secondary = generateShades(secondaryHex)
  const accent = generateShades(accentHex)

  if (id === 'sreya-clinical-teal') {
    return {
      ...defaultTheme.colors,
      '--color-primary': '#0D9488',
      '--color-primary-dark': '#0F766E',
      '--color-primary-light': '#CCFBF1',
      '--color-secondary': '#16A34A',
      '--color-secondary-dark': '#15803D',
      '--color-secondary-light': '#DCFCE7',
      '--color-accent-gold': '#0D9488',
      '--color-accent-sage': '#16A34A',
      '--color-accent-blush': '#E0F2FE',
      '--color-bg-base': '#F8FAFC',
      '--color-bg-alt': '#F1F5F9',
      '--color-bg-dark': '#0F172A',
      '--color-surface': 'rgba(255, 255, 255, 0.94)',
      '--color-surface-hover': 'rgba(13, 148, 136, 0.08)',
      '--color-border': '#E2E8F0',
      '--color-border-strong': '#CBD5E1',
      '--color-text-primary': '#0F172A',
      '--color-text-secondary': '#475569',
      '--color-text-muted': '#64748B',
      '--color-text-inverse': '#FFFFFF',
      '--color-link': '#0D9488',
      '--color-link-hover': '#0F766E',
      '--color-navbar-bg': '#FFFFFF',
      '--color-navbar-text': '#0F172A',
      '--color-footer-bg': '#0F172A',
      '--color-footer-text': '#FFFFFF',
      '--color-btn-primary-bg': '#0D9488',
      '--color-btn-primary-text': '#FFFFFF',
      '--color-btn-secondary-bg': 'transparent',
      '--color-btn-secondary-border': '#0D9488',
      '--color-announcement-bg': '#0D9488',
      '--color-announcement-text': '#FFFFFF',
      '--color-success': '#16A34A',
      '--color-warning': '#F59E0B',
      '--color-error': '#DC2626',
      '--color-info': '#0EA5E9',
      '--color-hero-overlay-start': 'rgba(15, 23, 42, 0.68)',
      '--color-hero-overlay-end': 'rgba(15, 118, 110, 0.48)',
      '--color-chatbot-bubble-bg': '#0D9488',
      '--color-scrollbar-thumb': '#CBD5E1',
      '--color-category-fertility': '#0D9488',
      '--color-category-testing': '#16A34A',
    }
  }

  return {
    ...defaultTheme.colors,
    '--color-primary': primary.base,
    '--color-primary-dark': primary.dark,
    '--color-primary-light': primary.light,
    '--color-secondary': secondary.base,
    '--color-secondary-dark': secondary.dark,
    '--color-secondary-light': secondary.light,
    '--color-accent-gold': accent.base,
    '--color-accent-sage': hslToHex(hexToHsl(accent.base).h, Math.max(hexToHsl(accent.base).s - 20, 18), Math.min(hexToHsl(accent.base).l + 12, 76)),
    '--color-bg-base': '#F8FAFC',
    '--color-bg-alt': '#F1F5F9',
    '--color-bg-dark': '#0F172A',
    '--color-surface': '#FFFFFF',
    '--color-surface-hover': primary.light,
    '--color-border': '#E2E8EA',
    '--color-border-strong': '#C7D1D4',
    '--color-text-primary': '#0F172A',
    '--color-text-secondary': '#475569',
    '--color-text-muted': '#64748B',
    '--color-text-inverse': '#FFFFFF',
    '--color-link': primary.base,
    '--color-link-hover': primary.dark,
    '--color-navbar-bg': '#FFFFFF',
    '--color-navbar-text': '#0F172A',
    '--color-footer-bg': '#0F172A',
    '--color-footer-text': '#FFFFFF',
    '--color-btn-primary-bg': primary.base,
    '--color-btn-primary-text': '#FFFFFF',
    '--color-btn-secondary-bg': 'transparent',
    '--color-btn-secondary-border': primary.base,
    '--color-announcement-bg': secondary.base,
    '--color-announcement-text': '#FFFFFF',
    '--color-success': '#16A34A',
    '--color-warning': accent.base,
    '--color-error': '#DC2626',
    '--color-info': primary.light,
    '--color-hero-overlay-start': `rgba(${primary.base.match(/\w\w/g).map((value) => Number.parseInt(value, 16)).join(',')},0.68)`,
    '--color-hero-overlay-end': `rgba(${primary.base.match(/\w\w/g).map((value) => Number.parseInt(value, 16)).join(',')},0.08)`,
    '--color-chatbot-bubble-bg': primary.base,
    '--color-scrollbar-thumb': '#C7D1D4',
    '--color-category-fertility': secondary.base,
    '--color-category-testing': primary.light,
  }
}

export const quickThemePresets = quickThemeBases.map(([id, name, primary, secondary, accent, mood]) => ({
  id,
  name,
  mood,
  swatches: [primary, secondary, accent, generateShades(primary).light],
  colors: buildPresetColors(primary, secondary, accent, id),
}))

export const themePresets = [
  {
    id: 'trust-teal',
    name: 'Trust Teal',
    colors: {},
  },
  {
    id: 'warm-rose',
    name: 'Warm Rose',
    colors: {
      '--color-primary': '#6E4565',
      '--color-primary-dark': '#4D2F47',
      '--color-primary-light': '#A8759B',
      '--color-secondary': '#D46A7E',
      '--color-secondary-dark': '#A9445B',
      '--color-secondary-light': '#F7DCE2',
      '--color-bg-alt': '#FFF5F7',
      '--color-announcement-bg': '#D46A7E',
      '--color-category-fertility': '#D46A7E',
      '--color-category-testing': '#2F9E9B',
    },
  },
  {
    id: 'sage-calm',
    name: 'Sage Calm',
    colors: {
      '--color-primary': '#356D6B',
      '--color-primary-dark': '#224A49',
      '--color-primary-light': '#78A6A0',
      '--color-secondary': '#9B6B7D',
      '--color-secondary-dark': '#77495D',
      '--color-secondary-light': '#F0DCE4',
      '--color-accent-sage': '#7FA88A',
      '--color-bg-alt': '#F3F8F4',
      '--color-announcement-bg': '#7FA88A',
      '--color-category-testing': '#6B9A78',
    },
  },
  {
    id: 'classic-navy-gold',
    name: 'Classic Navy & Gold',
    colors: {
      '--color-primary': '#17324D',
      '--color-primary-dark': '#0B1F35',
      '--color-primary-light': '#4A6B8F',
      '--color-secondary': '#B66A73',
      '--color-secondary-dark': '#914B55',
      '--color-secondary-light': '#F1D5D9',
      '--color-accent-gold': '#D79B32',
      '--color-bg-dark': '#10243A',
      '--color-footer-bg': '#10243A',
      '--color-announcement-bg': '#D79B32',
    },
  },
]

function colorToRgbTriplet(value) {
  if (!value || value === 'transparent') return null
  const clean = String(value).trim()
  const hex = clean.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    const raw = hex[1].length === 3 ? hex[1].split('').map((char) => char + char).join('') : hex[1]
    const number = Number.parseInt(raw, 16)
    return `${(number >> 16) & 255} ${(number >> 8) & 255} ${number & 255}`
  }
  const rgb = clean.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (rgb) return `${rgb[1]} ${rgb[2]} ${rgb[3]}`
  return null
}

function ratioForColors(foreground, background) {
  const fg = colorToRgbTriplet(foreground)
  const bg = colorToRgbTriplet(background)
  if (!fg || !bg) return null
  const toLuminance = (triplet) => {
    const [r, g, b] = triplet.split(' ').map((value) => {
      const channel = Number(value) / 255
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const lighter = Math.max(toLuminance(fg), toLuminance(bg))
  const darker = Math.min(toLuminance(fg), toLuminance(bg))
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2))
}

function minimumContrast(foreground, backgrounds) {
  const ratios = backgrounds
    .map((background) => ratioForColors(foreground, background))
    .filter((ratio) => ratio !== null)
  return ratios.length ? Math.min(...ratios) : null
}

function uniqueColors(colors) {
  return colors.filter((color, index) => color && colors.indexOf(color) === index)
}

function readableForeground(currentColor, backgrounds, fallbackColor, minRatio = 4.5) {
  const currentRatio = minimumContrast(currentColor, backgrounds)
  if (currentRatio === null || currentRatio >= minRatio) return currentColor

  const candidates = uniqueColors([
    fallbackColor,
    defaultTheme.colors['--color-text-primary'],
    '#0F172A',
    '#334155',
    '#FFFFFF',
    '#F8FAFC',
  ])
  let bestColor = currentColor
  let bestRatio = currentRatio
  candidates.forEach((candidate) => {
    const candidateRatio = minimumContrast(candidate, backgrounds)
    if (candidateRatio !== null && candidateRatio > bestRatio) {
      bestColor = candidate
      bestRatio = candidateRatio
    }
  })

  return bestColor
}

function ensureReadableThemeColors(colors) {
  const next = { ...colors }
  const pageSurfaces = [next['--color-bg-base'], next['--color-bg-alt'], next['--color-surface']]
  next['--color-text-primary'] = readableForeground(
    next['--color-text-primary'],
    pageSurfaces,
    defaultTheme.colors['--color-text-primary'],
  )
  next['--color-text-secondary'] = readableForeground(
    next['--color-text-secondary'],
    pageSurfaces,
    defaultTheme.colors['--color-text-secondary'],
  )
  next['--color-text-muted'] = readableForeground(
    next['--color-text-muted'],
    pageSurfaces,
    defaultTheme.colors['--color-text-muted'],
    3,
  )
  next['--color-link'] = readableForeground(next['--color-link'], pageSurfaces, defaultTheme.colors['--color-link'])
  next['--color-link-hover'] = readableForeground(
    next['--color-link-hover'],
    pageSurfaces,
    defaultTheme.colors['--color-link-hover'],
  )

  const ensurePair = (foregroundToken, backgroundToken, minRatio = 4.5) => {
    next[foregroundToken] = readableForeground(
      next[foregroundToken],
      [next[backgroundToken]],
      defaultTheme.colors[foregroundToken],
      minRatio,
    )
  }

  ensurePair('--color-navbar-text', '--color-navbar-bg')
  ensurePair('--color-footer-text', '--color-footer-bg')
  ensurePair('--color-announcement-text', '--color-announcement-bg')
  ensurePair('--color-btn-primary-text', '--color-btn-primary-bg')
  ensurePair('--color-text-inverse', '--color-bg-dark')

  return next
}

export function normalizeTheme(theme = {}) {
  const useCurrentDefaults = isLegacyWarmDefaultTheme(theme)
  const colors = {
    ...defaultTheme.colors,
    ...(useCurrentDefaults ? {} : theme.colors || {}),
  }

  return {
    colors: ensureReadableThemeColors(colors),
    typography: {
      ...defaultTheme.typography,
      ...(useCurrentDefaults ? {} : theme.typography || {}),
    },
  }
}

export function buildThemeCss(theme) {
  const normalized = normalizeTheme(theme)
  const pairing =
    typographyOptions.find((option) => option.id === normalized.typography.fontPairing) || typographyOptions[0]
  const declarations = [
    ...Object.entries(normalized.colors).map(([token, value]) => `${token}: ${value};`),
    ...Object.entries(normalized.colors)
      .map(([token, value]) => [token, colorToRgbTriplet(value)])
      .filter(([, rgb]) => rgb)
      .map(([token, rgb]) => `${token}-rgb: ${rgb};`),
    `--font-heading: ${pairing.heading};`,
    `--font-body: ${pairing.body};`,
    `--font-scale: ${fontScales[normalized.typography.fontScale] || fontScales.normal};`,
  ]
  return `:root { ${declarations.join(' ')} }`
}

export function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return
  const normalized = normalizeTheme(theme)
  let style = document.getElementById('srh-theme-overrides')
  if (!style) {
    style = document.createElement('style')
    style.id = 'srh-theme-overrides'
    document.head.appendChild(style)
  }
  style.textContent = buildThemeCss(normalized)
  sessionStorage.setItem('srh_theme_cache', JSON.stringify(normalized))
}

export function getCachedTheme() {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const cached = sessionStorage.getItem('srh_theme_cache')
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

export function contrastRatio(foreground, background) {
  return ratioForColors(foreground, background)
}
