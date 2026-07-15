import { describe, expect, it } from 'vitest'
import { yearsSince } from '../../src/lib/dateUtils'

describe('yearsSince', () => {
  it('computes elapsed years from a start year', () => {
    expect(yearsSince(2009, 2026)).toBe(17)
  })

  it('does not return negative values', () => {
    expect(yearsSince(2030, 2026)).toBe(0)
  })
})
