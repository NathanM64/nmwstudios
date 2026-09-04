'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import {
  FRAGMENT_SOURCE,
  MAX_SLABS,
  SETTINGS,
  UNIFORM_NAMES,
  VERTEX_SOURCE,
  type UniformName,
} from './glass-shader'

// Durée du cycle d'arrivée. Passé ce point, le mur ne fait plus que dériver.
const ARRIVAL_END = 3.5

type Uniforms = Partial<Record<UniformName, WebGLUniformLocation | null>>

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null
  return shader
}

// La valeur sort en `url("/x.avif")` : le composant veut le chemin nu.
function readUrl(name: string) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return raw.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '')
}

export function GlassWall() {
  // Le layout survit au changement de route, les dalles non : sans cette dépendance, le
  // canvas garderait les positions de la page précédente.
  const path = usePathname()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return

    const probing = new URLSearchParams(window.location.search).has('probe')
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: true,
      // Coûte un peu, et n'est utile qu'à readPixels dans les tests.
      preserveDrawingBuffer: probing,
    })
    if (!gl) return

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SOURCE)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SOURCE)
    const program = gl.createProgram()
    if (!vertex || !fragment || !program) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const attribute = gl.getAttribLocation(program, 'a')
    gl.enableVertexAttribArray(attribute)
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0)

    const U: Uniforms = {}
    for (const name of UNIFORM_NAMES) U[name] = gl.getUniformLocation(program, name)

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([200, 200, 205, 255]),
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    let textureSize: [number, number] = [16, 9]
    const image = new Image()
    image.onload = () => {
      textureSize = [image.width, image.height]
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      // La classe n'arrive qu'ici : tant que la texture manque, le mur CSS tient le site.
      document.documentElement.classList.add('glass-live')
    }
    // L'AVIF d'abord, le WebP si le navigateur ne sait pas le décoder.
    image.onerror = () => {
      image.onerror = null
      image.src = readUrl('--wall-webp')
    }
    image.src = readUrl('--wall-avif')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let dpr = 1
    let signature = ''

    const onMove = (event: PointerEvent) => {
      if (reduced) return
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * -0.02
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * -0.02
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let frame = 0
    const draw = () => {
      frame = requestAnimationFrame(draw)

      const width = Math.round(window.innerWidth)
      const height = Math.round(window.innerHeight)
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      const slabs = [...document.querySelectorAll<HTMLElement>('[data-glass]')]
        .map((slab) => ({ slab, rect: slab.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > 0 && rect.top < height && rect.width > 32)
        .sort((a, b) => b.rect.width * b.rect.height - a.rect.width * a.rect.height)
        .slice(0, MAX_SLABS)

      const elapsed = (performance.now() - start) / 1000
      const moving = !reduced && (elapsed < ARRIVAL_END || Math.abs(pointer.tx - pointer.x) > 1e-4)

      // On ne redessine que si quelque chose a bougé. Une image identique coûte alors zéro.
      const next = [
        width, height, dpr, slabs.length,
        slabs.map(({ rect }) => `${rect.x | 0},${rect.y | 0},${rect.width | 0},${rect.height | 0}`).join(';'),
      ].join('|')
      if (next === signature && !moving) return
      signature = next

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr
        canvas.height = height * dpr
        gl.viewport(0, 0, canvas.width, canvas.height)
      }

      pointer.x += (pointer.tx - pointer.x) * 0.07
      pointer.y += (pointer.ty - pointer.y) * 0.07

      const boxes = new Float32Array(MAX_SLABS * 4)
      const radii = new Float32Array(MAX_SLABS)
      slabs.forEach(({ slab, rect }, i) => {
        boxes.set([rect.x * dpr, rect.y * dpr, rect.width * dpr, rect.height * dpr], i * 4)
        radii[i] = (parseFloat(getComputedStyle(slab).borderTopLeftRadius) || 0) * dpr
      })

      // Le balayage part hors cadre à gauche et sort à droite, puis reste garé à 1.4.
      const sweep = reduced ? 1.4 : Math.min(1.4, -0.2 + Math.max(0, elapsed - 0.2) * 0.9)
      const gain = reduced ? 0 : Math.max(0, 1 - Math.max(0, elapsed - 1.6) / 1.9)
      const angle = -0.58 + (reduced ? 0 : Math.sin(elapsed / 6.4) * 0.12)

      let ax = 1
      let ay = 1
      const stageAspect = width / height
      const texAspect = textureSize[0] / textureSize[1]
      if (texAspect > stageAspect) ax = stageAspect / texAspect
      else ay = texAspect / stageAspect

      gl.uniform2f(U.uRes!, canvas.width, canvas.height)
      gl.uniform2f(U.uTexAspect!, ax, ay)
      gl.uniform2f(U.uShift!, pointer.x, pointer.y)
      gl.uniform4fv(U.uSlabs!, boxes)
      gl.uniform1fv(U.uRadii!, radii)
      gl.uniform1i(U.uCount!, slabs.length)
      gl.uniform1f(U.uAmp!, SETTINGS.amplitude * dpr)
      gl.uniform1f(U.uBevel!, SETTINGS.bevel * dpr)
      gl.uniform1f(U.uSpec!, SETTINGS.specular * 0.65)
      gl.uniform1f(U.uBlur!, SETTINGS.blur * 7 * dpr)
      gl.uniform1f(U.uVeil!, SETTINGS.veil)
      gl.uniform1f(U.uThick!, SETTINGS.thickness)
      gl.uniform1f(U.uShadow!, SETTINGS.shadow * dpr)
      gl.uniform2f(U.uLight!, Math.sin(angle), Math.cos(angle))
      gl.uniform1f(U.uSweep!, sweep)
      gl.uniform1f(U.uSweepGain!, gain)
      gl.uniform1i(U.uTex!, 0)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    draw()

    if (probing) {
      // Luminance réellement rendue sous la première dalle, seule mesure fiable du contraste.
      Object.assign(window, {
        __glassProbe: () => {
          const slab = document.querySelector<HTMLElement>('[data-glass]')
          if (!slab) return null
          const rect = slab.getBoundingClientRect()
          const w = Math.max(1, Math.round(rect.width * dpr))
          const h = Math.max(1, Math.round(rect.height * dpr))
          const x = Math.round(rect.x * dpr)
          const y = Math.round(canvas.height - (rect.y + rect.height) * dpr)
          const pixels = new Uint8Array(w * h * 4)
          gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
          let min = 255
          let max = 0
          for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i] < min) min = pixels[i]
            if (pixels[i] > max) max = pixels[i]
          }
          return { min, max }
        },
      })
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.classList.remove('glass-live')
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [path])

  return <canvas ref={ref} className="glass-wall" aria-hidden="true" />
}
