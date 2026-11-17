import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Scene, { scroll } from './Scene'
import HeroVideo from './HeroVideo'
import SplitText from './components/SplitText'
import Aurora from './components/Aurora'
import CountUp from './components/CountUp'

gsap.registerPlugin(ScrollTrigger)

const PHONE = '905-360-0309'
const EMAIL = 'Northendconstruction@hotmail.com'

const services = [
  {
    tag: '01 / Interior',
    title: 'Kitchens, baths & basements',
    img: '/img/gen/kitchen.jpg',
    items: ['Custom cabinetry and backsplashes', 'Walk-in showers, vanities, tile', 'Basement suites and home offices', 'Open concept wall removals'],
  },
  {
    tag: '02 / Flooring & Tile',
    title: 'Floors that last',
    img: '/img/gen/floor.jpg',
    items: ['Luxury vinyl plank (LVP)', 'Laminate flooring', 'Bathroom and kitchen tile'],
  },
  {
    tag: '03 / Exterior',
    title: 'Decks & fences',
    img: '/img/gen/deck.jpg',
    items: ['Wood and composite decks', 'Custom stairs', 'Wood, vinyl and privacy fences', 'Custom gates'],
  },
  {
    tag: '04 / Small tasks',
    title: 'The little jobs, done right',
    img: '/img/gen/trim.jpg',
    items: ['Trim repairs', 'Faucets, lights, door handles', 'TV mounting and pictures', 'Appliance removal and install'],
  },
]

const why = [
  ['Workmanship you can see', 'Precision on every cut, joint and line.'],
  ['Honest pricing', 'Mostly in-house work keeps costs fair.'],
  ['A clean, safe site', 'Floor mats and dust control, every day.'],
  ['We stay on your job', 'No jumping between projects. Ever.'],
]

const gallery = ['gen/bathroom.jpg', 'hero.jpg', 'gen/basement.jpg', 'kitchen-reno2.jpg', 'gen/kitchen.jpg', 'hero2.jpg', 'gen/floor.jpg', 'falls-bathroom.jpg']

function Mark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0686c7" />
          <stop offset="1" stopColor="#2572b8" />
        </linearGradient>
      </defs>
      <path d="M22 78 V40 H8 L44 4 L50 10 L56 4 L62 10 V4 H70 V18 L92 40 H78 V74" stroke="url(#lg)" strokeWidth="5" strokeLinejoin="round" />
      <path d="M26 44 L50 18 L74 44 H62 V68 Q50 66 38 68 V44 Z" fill="url(#lg)" />
    </svg>
  )
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-wrap py-4 bg-gradient-to-b from-ink/90 to-transparent">
      <a href="#top" className="flex items-center gap-4">
        <Mark className="h-14 w-[4.4rem]" />
        <span className="font-display font-extrabold tracking-tight leading-none text-2xl">
          NORTH END
          <span className="block font-mono text-[11px] tracking-[0.35em] text-white/60 font-normal mt-1.5">CONSTRUCTION</span>
        </span>
      </a>
      <nav className="hidden md:flex gap-8 font-mono text-xs uppercase tracking-widest text-white/70">
        <a href="#top" className="hover:text-white">Home</a>
        <a href="#services" className="hover:text-white">Services</a>
        <a href="#why" className="hover:text-white">Why us</a>
        <a href="#work" className="hover:text-white">Work</a>
        <a href="#contact" className="hover:text-white">Contact</a>
      </nav>
      <a href={`tel:${PHONE}`} className="rounded-full border border-brand/60 bg-brand/15 px-5 py-2 text-sm font-semibold hover:bg-brand transition-colors">
        {PHONE}
      </a>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center px-wrap">
      <div className="absolute inset-0 pointer-events-none opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <Aurora colorStops={['#0686c7', '#2572b8', '#07111c']} amplitude={0.9} blend={0.6} speed={0.6} />
      </div>
      <div className="relative z-10 max-w-5xl pt-24">
        <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-brand mb-6 uppercase">Niagara · Est. 2018 · Dave Sennuck</p>
        <SplitText tag="h1" text="We build the space" splitType="words" effect="rise" trigger="load" delay={60} className="font-display font-extrabold text-5xl sm:text-7xl lg:text-[8.5rem] leading-[0.95] tracking-tight" />
        <SplitText tag="h1" text="you dream about." splitType="words" effect="rise" trigger="load" delay={60} color="#2aa6ea" className="font-display font-extrabold text-5xl sm:text-7xl lg:text-[8.5rem] leading-[0.95] tracking-tight" />
        <p className="mt-8 max-w-xl text-lg text-white/75" data-reveal>
          Interior renovations, flooring, decks and fences. From the first sketch to the final coat of paint, one crew sees it through.
        </p>
        <div className="mt-10 flex flex-wrap gap-4" data-reveal>
          <a href="#contact" className="rounded-full bg-brand px-8 py-4 font-semibold shadow-[0_0_40px_-5px_#0686c7] hover:scale-105 transition-transform">Get a free quote</a>
          <a href="#services" className="rounded-full border border-white/25 px-8 py-4 font-semibold hover:bg-white/10 transition-colors">See what we build</a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-white/50">
        SCROLL
        <span className="block h-10 w-px bg-gradient-to-b from-brand to-transparent animate-pulse" />
      </div>
    </section>
  )
}

function Story() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.story-line')
      gsap.set(lines, { autoAlpha: 0, y: 60 })
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=240%', pin: true, scrub: 0.6, onRefresh: (self) => { scroll.end = self.end } } })
      lines.forEach((l, i) => {
        tl.to(l, { autoAlpha: 1, y: 0, duration: 1 })
        if (i < lines.length - 1) tl.to(l, { autoAlpha: 0, y: -60, duration: 1 }, '+=0.6')
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  const L = [
    ['01', 'Frame it right.', 'Solid structure first. Everything else rests on it.'],
    ['02', 'Close it in.', 'Walls, windows and light, built tight and built to last.'],
    ['03', 'Finish every detail.', 'Tile, trim, paint. The last 5% is the part you will notice.'],
  ]
  return (
    <section ref={ref} className="relative h-screen">
      {L.map(([n, h, p]) => (
        <div key={n} className="story-line absolute inset-0 flex flex-col justify-center px-5 md:px-10 max-w-3xl md:ml-[max(6vw,calc((100vw_-_1440px)/2_+_2.5rem))] [text-shadow:0_0_40px_#07111c,0_0_12px_#07111c]">
          <span className="font-mono text-brand text-sm tracking-widest mb-4">{n} / 03</span>
          <h2 className="font-display font-extrabold text-5xl md:text-8xl leading-none">{h}</h2>
          <p className="mt-6 text-xl text-white/70 max-w-md">{p}</p>
        </div>
      ))}
    </section>
  )
}

function Services() {
  const wrap = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const dist = () => track.current!.scrollWidth - wrap.current!.clientWidth + 80
      gsap.to(track.current, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: wrap.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true } })
    })
    return () => mm.revert()
  }, [])
  return (
    <section id="services" ref={wrap} className="relative bg-ink/80 backdrop-blur-sm md:h-screen flex flex-col justify-center py-24 md:py-0 overflow-hidden">
      <div className="px-wrap mb-8">
        <p className="font-mono text-xs tracking-[0.3em] text-brand uppercase">What we build</p>
        <h2 className="font-display font-extrabold text-4xl md:text-6xl mt-3">Four ways we change your home.</h2>
      </div>
      <div ref={track} className="flex flex-col md:flex-row gap-6 px-wrap w-max max-md:w-full">
        {services.map((s) => (
          <article key={s.tag} className="group relative shrink-0 w-full md:w-[34vw] h-[60vh] md:h-[58vh] rounded-3xl overflow-hidden border border-white/10">
            <img src={s.img} alt={s.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <span className="font-mono text-xs tracking-widest text-brand">{s.tag}</span>
              <h3 className="font-display font-bold text-3xl mt-2">{s.title}</h3>
              <ul className="mt-4 grid grid-cols-1 gap-1 text-white/75 text-sm">
                {s.items.map((i) => (
                  <li key={i} className="flex gap-2"><span className="text-brand">+</span>{i}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Stats() {
  const s: [number, string, string][] = [
    [2018, '', 'Founded in St. Catharines'],
    [19, '+', 'Years in the trade'],
    [5, '', 'Niagara communities served'],
    [100, '%', 'Focus on your project'],
  ]
  return (
    <section className="bg-ink/80 backdrop-blur-sm py-24 px-5 md:px-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-[1440px] mx-auto">
        {s.map(([n, suf, label]) => (
          <div key={label} data-reveal>
            <div className="font-display font-extrabold text-5xl md:text-7xl grad-text">
              <CountUp to={n} suffix={suf} separator="" duration={2} />
            </div>
            <p className="mt-2 text-white/60 text-sm">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Why() {
  return (
    <section id="why" className="bg-deep/85 backdrop-blur-sm py-28 px-5 md:px-10">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-[1fr_1.4fr] gap-16">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-brand uppercase">Why North End</p>
          <h2 className="font-display font-extrabold text-4xl md:text-6xl mt-3 leading-tight">Built on experience, passion and integrity.</h2>
          <p className="mt-6 text-white/70">Dave Sennuck grew up in St. Catharines and has worked in construction since 2007. He started North End to do the job the way he would want it done at home.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {why.map(([h, p], i) => (
            <div key={h} data-reveal className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-brand/60 hover:bg-brand/10 transition-colors">
              <span className="font-mono text-brand text-xs">0{i + 1}</span>
              <h3 className="font-display font-bold text-2xl mt-3">{h}</h3>
              <p className="mt-2 text-white/65 text-sm">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Work() {
  const row = [...gallery, ...gallery]
  return (
    <section id="work" className="bg-ink/85 backdrop-blur-sm py-24 overflow-hidden">
      <h2 className="font-display font-extrabold text-4xl md:text-6xl px-wrap mb-10">Recent work.</h2>
      <div className="flex gap-5 w-max animate-[marq_50s_linear_infinite] hover:[animation-play-state:paused]">
        {row.map((g, i) => (
          <img key={i} src={`/img/${g}`} alt="North End Construction project" className="h-72 md:h-96 w-auto rounded-2xl object-cover border border-white/10" loading="lazy" />
        ))}
      </div>
      <style>{`@keyframes marq{to{transform:translateX(-50%)}}`}</style>
    </section>
  )
}

function Finale() {
  return (
    <section className="relative h-[85vh] overflow-hidden">
      <img src="/img/gen/house.jpg" alt="Renovated home at dusk" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-ink/30 to-ink/50" />
      <div className="relative h-full flex flex-col items-center justify-end pb-20 text-center px-5">
        <h2 className="font-display font-extrabold text-5xl md:text-8xl leading-none" data-reveal>Your home, finished.</h2>
      </div>
    </section>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <section id="contact" className="relative bg-deep/90 backdrop-blur-sm py-28 px-5 md:px-10">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-brand uppercase">Free quote</p>
          <h2 className="font-display font-extrabold text-5xl md:text-7xl mt-3 leading-[0.95]">Let us build it.</h2>
          <p className="mt-6 text-white/70 max-w-md">Tell us about the room. Hourly rates for small jobs, custom quotes for projects, package pricing for multi-room work.</p>
          <div className="mt-8 space-y-2 font-mono text-sm">
            <a className="block text-xl text-brand hover:underline" href={`tel:${PHONE}`}>{PHONE}</a>
            <a className="block text-white/70 hover:text-white" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <p className="text-white/50 pt-2">St. Catharines · Niagara-on-the-Lake · Niagara Falls · Thorold · Beamsville</p>
          </div>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            const body = `Name: ${f.get('name')}\nPhone: ${f.get('phone')}\nProject: ${f.get('type')}\n\n${f.get('msg')}`
            window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Quote request: ' + f.get('type'))}&body=${encodeURIComponent(body)}`
            setSent(true)
          }}
        >
          {[['name', 'Your name', 'text'], ['phone', 'Phone', 'tel']].map(([n, p, t]) => (
            <input key={n} name={n} type={t} placeholder={p} required className="w-full rounded-xl bg-white/5 border border-white/15 px-5 py-4 outline-none focus:border-brand" />
          ))}
          <select name="type" className="w-full rounded-xl bg-ink border border-white/15 px-5 py-4 outline-none focus:border-brand">
            {['Kitchen', 'Bathroom', 'Basement', 'Flooring & tile', 'Deck or fence', 'Small task'].map((o) => <option key={o}>{o}</option>)}
          </select>
          <textarea name="msg" rows={4} placeholder="Tell us about the project" className="w-full rounded-xl bg-white/5 border border-white/15 px-5 py-4 outline-none focus:border-brand" />
          <button className="w-full rounded-full bg-brand py-4 font-semibold shadow-[0_0_40px_-5px_#0686c7] hover:scale-[1.02] transition-transform">Send request</button>
          {sent && <p className="text-sm text-white/60">Your email app should open with the message ready. Press send there to reach us.</p>}
        </form>
      </div>
      <footer className="max-w-[1440px] mx-auto mt-24 pt-8 border-t border-white/10 flex flex-wrap justify-between gap-4 text-sm text-white/50">
        <span className="flex items-center gap-2"><Mark className="h-6 w-8" /> North End Construction</span>
        <span>Dedicated to creating your dream space from start to finish.</span>
      </footer>
    </section>
  )
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { scroll.p = self.progress },
    })
    ScrollTrigger.batch('[data-reveal]', {
      onEnter: (els) => gsap.fromTo(els, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 1, ease: 'power3.out' }),
      start: 'top 88%',
      once: true,
    })
    gsap.set('[data-reveal]', { autoAlpha: 0 })
    return () => { st.kill(); gsap.ticker.remove(tick); lenis.destroy() }
  }, [])

  return (
    <div className="grain">
      <HeroVideo />
      <Scene />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Story />
        <Services />
        <Stats />
        <Why />
        <Work />
        <Finale />
        <Contact />
      </main>
    </div>
  )
}
