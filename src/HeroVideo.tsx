import { useEffect, useRef, useState } from 'react'
import { scroll } from './Scene'

const SRC = '/video/build.mp4'
const clamp = (n: number) => Math.min(1, Math.max(0, n))

/** Fixed full-screen film that plays forward as you scroll down and backward as you scroll up. */
export default function HeroVideo() {
  const vid = useRef<HTMLVideoElement>(null)
  const still = useRef<HTMLImageElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const small = window.matchMedia('(max-width: 767px)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (small || reduce) { setFallback(true) }

    let raf = 0
    let shown = 0
    let target = 0
    let busy = false
    let blobUrl = ''
    const v = vid.current!

    const progress = () => clamp(window.scrollY / Math.max(1, scroll.end || window.innerHeight * 3.4))

    const loop = () => {
      const p = progress()
      target = p
      shown += (target - shown) * 0.12
      if (Math.abs(target - shown) < 0.0004) shown = target
      if (still.current) still.current.style.opacity = String(shown)
      if (!small && !reduce && v.duration && !busy) {
        const t = shown * (v.duration - 0.05)
        if (Math.abs(v.currentTime - t) > 0.012) { busy = true; v.currentTime = t }
      }
      // after the story ends, let the film melt away behind the page
      if (wrap.current) wrap.current.style.opacity = String(window.scrollY > (scroll.end || 1) ? Math.max(0.15, 1 - (window.scrollY - (scroll.end || 1)) / (window.innerHeight * 0.8)) : 1)
      raf = requestAnimationFrame(loop)
    }
    const onSeeked = () => { busy = false }
    v.addEventListener('seeked', onSeeked)

    if (!small && !reduce) {
      fetch(SRC).then((r) => r.blob()).then((b) => { blobUrl = URL.createObjectURL(b); v.src = blobUrl; v.load() }).catch(() => setFallback(true))
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); v.removeEventListener('seeked', onSeeked); if (blobUrl) URL.revokeObjectURL(blobUrl) }
  }, [])

  return (
    <div ref={wrap} className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] z-0 bg-ink">
      <img src="/video/start.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <video ref={vid} muted playsInline preload="auto" className={`absolute inset-0 h-full w-full object-cover ${fallback ? 'hidden' : ''}`} />
      {fallback && <img ref={still} src="/video/end.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-0" />}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/40" />
    </div>
  )
}
