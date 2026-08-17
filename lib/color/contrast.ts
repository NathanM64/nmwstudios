export type Rgb = { r: number; g: number; b: number }

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
const FUNC = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?\s*\)$/i

export function parseColor(value: string): { rgb: Rgb; alpha: number } {
  const input = value.trim()

  const hex = HEX.exec(input)
  if (hex) {
    const digits = hex[1].length === 3 ? hex[1].replace(/./g, (c) => c + c) : hex[1]
    return {
      rgb: {
        r: parseInt(digits.slice(0, 2), 16),
        g: parseInt(digits.slice(2, 4), 16),
        b: parseInt(digits.slice(4, 6), 16),
      },
      alpha: 1,
    }
  }

  const fn = FUNC.exec(input)
  if (fn) {
    return {
      rgb: { r: Number(fn[1]), g: Number(fn[2]), b: Number(fn[3]) },
      alpha: fn[4] === undefined ? 1 : Number(fn[4]),
    }
  }

  throw new Error(`Couleur non reconnue : ${value}`)
}

export function composite(top: Rgb, alpha: number, bottom: Rgb): Rgb {
  const mix = (t: number, b: number) => Math.round(t * alpha + b * (1 - alpha))
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b) }
}

export function relativeLuminance(c: Rgb): number {
  const channel = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b)
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}
