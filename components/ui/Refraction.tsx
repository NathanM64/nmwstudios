'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// The map is computed at each slab's own size. Stretched from a single map, the bevel would be
// wide on one side and narrow on the other, and the grain would double instead of compressing.
// 360px a side is enough: the map is stretched afterwards without the fold moving.
const MAX_RESOLUTION = 360

type Brands = { brands?: { brand: string }[] }

// Chromium is the only engine that accepts an SVG filter inside backdrop-filter. Elsewhere the
// class keeps its frosted glass rather than a transparent rectangle with no material.
function supportsFilter() {
  const agent = (navigator as Navigator & { userAgentData?: Brands }).userAgentData
  return Boolean(agent?.brands?.some((entry) => entry.brand === 'Chromium'))
}

// Signed distance to the edge of a rounded rectangle: negative inside, zero on the edge.
function distanceField(width: number, height: number, radius: number) {
  const field = new Float32Array(width * height)
  const halfWidth = width / 2
  const halfHeight = height / 2
  for (let y = 0; y < height; y++) {
    const py = Math.abs(y + 0.5 - halfHeight) - (halfHeight - radius)
    for (let x = 0; x < width; x++) {
      const px = Math.abs(x + 0.5 - halfWidth) - (halfWidth - radius)
      field[y * width + x] =
        Math.min(Math.max(px, py), 0) + Math.hypot(Math.max(px, 0), Math.max(py, 0)) - radius
    }
  }
  return field
}

// Red encodes the horizontal offset, green the vertical one, 128 means "do not move".
function displacementMap(cssWidth: number, cssHeight: number, cssRadius: number, cssBevel: number) {
  const scale = Math.min(1, MAX_RESOLUTION / Math.max(cssWidth, cssHeight))
  const width = Math.max(8, Math.round(cssWidth * scale))
  const height = Math.max(8, Math.round(cssHeight * scale))
  const radius = Math.min(cssRadius * scale, Math.min(width, height) / 2)
  const bevel = Math.max(1, cssBevel * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return null

  const field = distanceField(width, height, radius)
  const image = context.createImageData(width, height)
  const bytes = image.data

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      const distance = field[i]
      let red = 128
      let green = 128
      const edge = (distance + bevel) / bevel
      if (distance < 0 && edge > 0) {
        // The outward normal is read from the field itself: this way round the edge pulls the
        // outside in and compresses it against the border, the other way it hollows out a void.
        const gx = field[y * width + Math.min(width - 1, x + 1)] - field[y * width + Math.max(0, x - 1)]
        const gy =
          field[Math.min(height - 1, y + 1) * width + x] - field[Math.max(0, y - 1) * width + x]
        const norm = Math.hypot(gx, gy)
        if (norm > 1e-6) {
          const strength = Math.pow(Math.min(1, edge), 1.7)
          red = 128 + 127 * (gx / norm) * strength
          green = 128 + 127 * (gy / norm) * strength
        }
      }
      const j = i * 4
      bytes[j] = Math.round(red)
      bytes[j + 1] = Math.round(green)
      bytes[j + 2] = 255
      bytes[j + 3] = 255
    }
  }

  context.putImageData(image, 0, 0)
  return canvas.toDataURL('image/png')
}

// One client component for the whole site: the slabs stay server components and mark
// themselves with data-glass.
export function Refraction() {
  // The layout survives a page change, the slabs do not: without this dependency the filters
  // stay attached to the previous page's DOM and the glass loses its fold.
  const path = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return
    if (!supportsFilter()) return

    const NS = 'http://www.w3.org/2000/svg'
    const host = document.createElementNS(NS, 'svg')
    host.setAttribute('aria-hidden', 'true')
    host.setAttribute('width', '0')
    host.setAttribute('height', '0')
    host.style.position = 'fixed'
    host.style.pointerEvents = 'none'
    document.body.appendChild(host)

    const slabs = Array.from(document.querySelectorAll<HTMLElement>('[data-glass]'))
    const observers: ResizeObserver[] = []

    slabs.forEach((slab, rank) => {
      const id = `fold-${rank}`
      const filter = document.createElementNS(NS, 'filter')
      filter.setAttribute('id', id)
      filter.setAttribute('filterUnits', 'userSpaceOnUse')
      filter.setAttribute('primitiveUnits', 'userSpaceOnUse')
      filter.setAttribute('color-interpolation-filters', 'sRGB')

      const map = document.createElementNS(NS, 'feImage')
      map.setAttribute('result', 'map')
      map.setAttribute('preserveAspectRatio', 'none')

      // A surface passing over text has to blur it before folding it, otherwise the two
      // readings overlap. The blur goes into the chain, not into the declaration.
      const blur = Number(slab.dataset.glassBlur ?? 0)
      const blurNode = document.createElementNS(NS, 'feGaussianBlur')
      blurNode.setAttribute('in', 'SourceGraphic')
      blurNode.setAttribute('stdDeviation', String(blur))
      blurNode.setAttribute('result', 'blurred')

      const displacement = document.createElementNS(NS, 'feDisplacementMap')
      displacement.setAttribute('in', blur > 0 ? 'blurred' : 'SourceGraphic')
      displacement.setAttribute('in2', 'map')
      displacement.setAttribute('xChannelSelector', 'R')
      displacement.setAttribute('yChannelSelector', 'G')

      filter.append(map)
      if (blur > 0) filter.appendChild(blurNode)
      filter.appendChild(displacement)
      host.appendChild(filter)

      let lastSize = ''
      const measure = () => {
        const rect = slab.getBoundingClientRect()
        const width = Math.round(rect.width)
        const height = Math.round(rect.height)
        if (width < 32 || height < 32) return
        const size = `${width}x${height}`
        if (size === lastSize) return
        lastSize = size

        const radius = parseFloat(getComputedStyle(slab).borderTopLeftRadius) || 0
        // The bevel is 16% of the short side, capped at 34px. The displacement only takes 18%
        // of that bevel: beyond it, it exceeds the width of a hairline running behind the slab,
        // and the line breaks off instead of folding. Measured at 34px of displacement, the
        // plate's monogram tore; at 6px it folds.
        const bevel = Math.min(34, Math.min(width, height) * 0.16)
        const maximum = bevel * 0.18
        const data = displacementMap(width, height, radius, bevel)
        if (!data) return

        // The region overflows the slab: without this margin the edge pulls in emptiness and
        // leaves a grey band along the border.
        const margin = Math.ceil(maximum * 2 + 8)
        filter.setAttribute('x', String(-margin))
        filter.setAttribute('y', String(-margin))
        filter.setAttribute('width', String(width + margin * 2))
        filter.setAttribute('height', String(height + margin * 2))
        map.setAttribute('x', '0')
        map.setAttribute('y', '0')
        map.setAttribute('width', String(width))
        map.setAttribute('height', String(height))
        map.setAttribute('href', data)
        // 128 out of 255 is not exactly half: the scale takes the real step back.
        displacement.setAttribute('scale', String((maximum * 255) / 127))
        slab.style.backdropFilter = `url(#${id})`
      }

      measure()
      const observer = new ResizeObserver(measure)
      observer.observe(slab)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
      slabs.forEach((slab) => {
        slab.style.backdropFilter = ''
      })
      host.remove()
    }
  }, [path])

  return null
}
