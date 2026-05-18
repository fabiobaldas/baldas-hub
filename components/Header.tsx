'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const links = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#planos', label: 'Planos' },
  { href: '#mapa', label: 'Mapa' },
  { href: '/blog', label: 'Blog' },
  { href: '#contato', label: 'Contato' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white/70 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center gap-2">
            <Image src="/logo.jpeg" alt="Baldas Hub Condominial" width={36} height={36} className="rounded-md" />
            <span className="font-bold text-lg" style={{ color: '#0A3244' }}>Baldas Hub Condominial</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              l.href.startsWith('/') ? (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium transition-colors duration-150"
                  style={{ color: '#4A6572' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#0A3244')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#4A6572')}
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium transition-colors duration-150"
                  style={{ color: '#4A6572' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#0A3244')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#4A6572')}
                >
                  {l.label}
                </a>
              )
            ))}
            <a
              href="https://wa.me/5521971788414"
              target="_blank"
              rel="noreferrer"
              className="text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150"
              style={{ backgroundColor: '#0d6e8a' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0A3244')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0d6e8a')}
            >
              Falar com Especialista
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            style={{ color: '#0A3244' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? 'max-h-64 pb-4' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col gap-3 bg-white rounded-xl px-4 py-4 shadow-lg">
            {links.map((l) => (
              l.href.startsWith('/') ? (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium"
                  style={{ color: '#4A6572' }}
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium"
                  style={{ color: '#4A6572' }}
                >
                  {l.label}
                </a>
              )
            ))}
            <a
              href="https://wa.me/5521971788414"
              target="_blank"
              rel="noreferrer"
              className="text-white text-sm font-semibold px-4 py-2 rounded-lg text-center"
              style={{ backgroundColor: '#0d6e8a' }}
            >
              Falar com Especialista
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
