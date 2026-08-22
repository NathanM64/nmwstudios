import { describe, expect, it } from 'vitest'
import { SCENES } from '@/lib/config/scenes'

describe('scènes', () => {
  it('en déclare exactement trois', () => {
    expect(SCENES.map((s) => s.id)).toEqual(['site', 'preuve', 'deroule'])
  })
})
