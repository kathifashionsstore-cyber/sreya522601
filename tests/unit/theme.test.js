import { describe, expect, it } from 'vitest'
import { generateShades, quickThemePresets } from '../../src/lib/theme'

describe('theme utilities', () => {
  it('generates base, dark, and light shades', () => {
    const shades = generateShades('#0B4F6C')
    expect(shades.base).toBe('#0B4F6C')
    expect(shades.dark).toMatch(/^#[0-9a-f]{6}$/i)
    expect(shades.light).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('provides more than 30 complete quick themes', () => {
    expect(quickThemePresets.length).toBeGreaterThanOrEqual(31)
    expect(quickThemePresets[0].colors['--color-primary']).toBeTruthy()
    expect(quickThemePresets[0].colors['--color-footer-bg']).toBeTruthy()
  })
})
