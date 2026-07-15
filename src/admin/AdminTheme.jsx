import { useEffect, useMemo, useState } from 'react'
import { RotateCcw, Save, Wand2 } from 'lucide-react'
import { Button } from '../components/shared/Button'
import { Input, Select } from '../components/shared/Input'
import { useToast } from '../components/shared/Toast'
import { saveDocument, useFirestoreDoc } from '../hooks/useFirestoreCollection'
import {
  applyThemeToDocument,
  contrastRatio,
  defaultTheme,
  normalizeTheme,
  quickThemePresets,
  themeGroups,
  themePresets,
  typographyOptions,
} from '../lib/theme'

function isColorInput(value) {
  return /^#[0-9a-f]{6}$/i.test(value || '')
}

function ContrastBadge({ label, foreground, background }) {
  const ratio = contrastRatio(foreground, background)
  if (!ratio) return null
  const pass = ratio >= 4.5
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${pass ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
      {label}: {ratio}:1 {pass ? 'AA' : 'Check'}
    </span>
  )
}

export default function AdminTheme() {
  const themeDoc = useFirestoreDoc('settings/theme', defaultTheme)
  const [draft, setDraft] = useState(defaultTheme)
  const [tab, setTab] = useState('quick')
  const { push } = useToast()
  const normalized = useMemo(() => normalizeTheme(draft), [draft])

  useEffect(() => {
    setDraft(normalizeTheme(themeDoc.data || defaultTheme))
  }, [themeDoc.data])

  useEffect(() => {
    applyThemeToDocument(normalized)
  }, [normalized])

  function setToken(token, value) {
    setDraft((current) => ({
      ...normalizeTheme(current),
      colors: {
        ...normalizeTheme(current).colors,
        [token]: value,
      },
    }))
  }

  function setTypography(field, value) {
    setDraft((current) => ({
      ...normalizeTheme(current),
      typography: {
        ...normalizeTheme(current).typography,
        [field]: value,
      },
    }))
  }

  function applyPreset(preset) {
    setDraft((current) => ({
      ...normalizeTheme(current),
      colors: {
        ...defaultTheme.colors,
        ...preset.colors,
      },
    }))
  }

  function repairReadability() {
    setDraft((current) => ({
      ...normalizeTheme(current),
      colors: {
        ...normalizeTheme(current).colors,
        '--color-bg-base': '#F8FAFC',
        '--color-bg-alt': '#F1F5F9',
        '--color-surface': 'rgba(255, 255, 255, 0.94)',
        '--color-text-primary': '#0F172A',
        '--color-text-secondary': '#475569',
        '--color-text-muted': '#64748B',
        '--color-navbar-bg': '#FFFFFF',
        '--color-navbar-text': '#0F172A',
        '--color-btn-primary-text': '#FFFFFF',
      },
    }))
    push('Readable text and background colors restored.', 'success')
  }

  async function save() {
    try {
      await saveDocument('settings', normalized, 'theme')
      push('Theme saved and applied.', 'success')
    } catch (error) {
      push(error.message || 'Could not save theme.', 'error')
    }
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Theme Customizer</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Edit Firestore-backed design tokens. Changes preview immediately here and apply site-wide after saving.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={repairReadability} className="!border-teal-200 !text-teal-700 hover:!text-teal-800">
            <Wand2 className="size-4" /> Fix Readability
          </Button>
          <Button type="button" variant="secondary" onClick={() => setDraft(defaultTheme)} className="!border-slate-200 !text-slate-700 hover:!text-teal-700">
            <RotateCcw className="size-4" /> Reset All
          </Button>
          <Button type="button" onClick={save} className="![background:#0f766e] !text-white hover:![background:#0d9488]">
            <Save className="size-4" /> Save Theme
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-5">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-white p-2 text-sm font-black shadow-soft">
            <button type="button" onClick={() => setTab('quick')} className={`rounded-lg px-4 py-3 ${tab === 'quick' ? 'bg-teal-50 text-teal-700' : 'text-slate-600'}`}>
              Quick Themes
            </button>
            <button type="button" onClick={() => setTab('advanced')} className={`rounded-lg px-4 py-3 ${tab === 'advanced' ? 'bg-teal-50 text-teal-700' : 'text-slate-600'}`}>
              Advanced Custom
            </button>
          </div>

          {tab === 'quick' ? (
            <div className="rounded-lg bg-white p-5 shadow-soft">
              <h2 className="text-xl font-black text-slate-950">Quick Themes</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">One click applies a complete palette across all public theme tokens.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quickThemePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="rounded-lg border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                  >
                    <div className="flex -space-x-2">
                      {preset.swatches.map((swatch) => (
                        <span key={swatch} className="size-8 rounded-full border-2 border-white" style={{ backgroundColor: swatch }} />
                      ))}
                    </div>
                    <h3 className="mt-4 font-black text-slate-950">{preset.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{preset.mood}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-teal-700">
                      <Wand2 className="size-4" /> Apply
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-lg bg-white p-5 shadow-soft">
                <h2 className="text-xl font-black text-slate-950">Preset Themes</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {themePresets.map((preset) => (
                    <Button key={preset.id} type="button" variant="secondary" onClick={() => applyPreset(preset)}>
                      <Wand2 className="size-4" /> {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-white p-5 shadow-soft">
                <h2 className="text-xl font-black text-slate-950">Typography</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-slate-950">
                    Font pairing
                    <Select value={normalized.typography.fontPairing} onChange={(event) => setTypography('fontPairing', event.target.value)}>
                      {typographyOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-950">
                    Base size
                    <Select value={normalized.typography.fontScale} onChange={(event) => setTypography('fontScale', event.target.value)}>
                      <option value="compact">Compact</option>
                      <option value="normal">Normal</option>
                      <option value="large">Large</option>
                    </Select>
                  </label>
                </div>
              </div>

              {themeGroups.map((group) => (
                <details key={group.title} open className="rounded-lg bg-white p-5 shadow-soft">
                  <summary className="cursor-pointer text-xl font-black text-slate-950">{group.title}</summary>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {group.tokens.map(([token, defaultValue, use]) => {
                      const value = normalized.colors[token] ?? defaultValue
                      return (
                        <label key={token} className="grid gap-2 rounded-lg border border-slate-100 p-4 text-sm font-bold text-slate-950">
                          <span>{token}</span>
                          <span className="text-xs font-medium leading-5 text-slate-500">{use}</span>
                          <div className="flex items-center gap-2">
                            {isColorInput(value) ? (
                              <input
                                type="color"
                                value={value}
                                onChange={(event) => setToken(token, event.target.value)}
                                className="h-11 w-14 rounded-lg border border-slate-200 bg-white p-1"
                              />
                            ) : null}
                            <Input value={value} onChange={(event) => setToken(token, event.target.value)} className="font-mono text-xs" />
                            <button
                              type="button"
                              onClick={() => setToken(token, defaultValue)}
                              className="grid size-11 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-teal-700"
                              aria-label={`Reset ${token}`}
                            >
                              <RotateCcw className="size-4" />
                            </button>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </details>
              ))}
            </>
          )}
        </div>

        <aside className="h-fit rounded-lg bg-white p-5 shadow-soft xl:sticky xl:top-24">
          <h2 className="text-xl font-black text-slate-950">Live Preview</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-[var(--color-border)]">
            <div className="flex items-center justify-between bg-[var(--color-navbar-bg)] px-4 py-3 text-[var(--color-navbar-text)]">
              <span className="font-black">Sreya Hospitals</span>
              <span className="rounded-full bg-[var(--color-btn-primary-bg)] px-3 py-1 text-xs font-black text-[var(--color-btn-primary-text)]">
                Book
              </span>
            </div>
            <div
              className="p-5 text-white"
              style={{
                background:
                  'linear-gradient(90deg, var(--color-hero-overlay-start), var(--color-hero-overlay-end)), var(--color-primary)',
              }}
            >
              <p className="text-xs font-black uppercase text-white/75">Preview hero</p>
              <h3 className="mt-2 text-2xl font-black">Fertility and women&apos;s care</h3>
              <p className="mt-2 text-sm leading-6 text-white/80">Color changes preview before saving.</p>
            </div>
            <div className="bg-[var(--color-bg-alt)] p-5">
              <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <p className="text-xs font-black uppercase text-[var(--color-secondary)]">Service card</p>
                <h4 className="mt-1 font-black text-[var(--color-text-primary)]">IVF Consultation</h4>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">Sample text using your selected text tokens.</p>
              </article>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <ContrastBadge
              label="Body"
              foreground={normalized.colors['--color-text-primary']}
              background={normalized.colors['--color-bg-base']}
            />
            <ContrastBadge
              label="Button"
              foreground={normalized.colors['--color-btn-primary-text']}
              background={normalized.colors['--color-btn-primary-bg']}
            />
            <ContrastBadge
              label="Footer"
              foreground={normalized.colors['--color-footer-text']}
              background={normalized.colors['--color-footer-bg']}
            />
          </div>
        </aside>
      </div>
    </section>
  )
}
