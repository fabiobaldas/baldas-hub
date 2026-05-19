'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const NITEROI_CENTER: [number, number] = [-22.8838, -43.1044]

interface Condominio {
  id: number
  nome: string
  endereco: string
  unidades: string
  lat: number
  lng: number
}

const MapaLeaflet = dynamic(() => import('./MapaLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-96 rounded-2xl animate-pulse" style={{ backgroundColor: '#F0F5F7' }} />
  ),
})

export default function Mapa() {
  const [condominios, setCondominios] = useState<Condominio[]>([])

  useEffect(() => {
    fetch('/api/condominios')
      .then(r => r.json())
      .then(data => setCondominios(data))
      .catch(() => {})
  }, [])

  return (
    <section id="mapa" className="py-24" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#0d6e8a' }}>Localização</p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#0A3244', letterSpacing: '-0.02em' }}>
            Nossos condomínios
          </h2>
          <p style={{ color: '#4A6572' }}>
            {condominios.length > 0
              ? `${condominios.length} condomínio${condominios.length > 1 ? 's' : ''} em Niterói e região.`
              : 'Condomínios administrados em Niterói e região.'}
          </p>
        </div>

        <div className="mb-6">
          <MapaLeaflet condominios={condominios} center={NITEROI_CENTER} />
        </div>

        {condominios.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {condominios.map(c => (
              <div
                key={c.id}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ backgroundColor: '#F8FAFB', border: '1px solid #D6E8EF' }}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: '#D6E8EF' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d6e8a" strokeWidth="2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#0A3244' }}>{c.nome}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#4A6572' }}>{c.endereco}</p>
                  {c.unidades && (
                    <p className="text-xs mt-0.5" style={{ color: '#0d6e8a' }}>{c.unidades} unidades</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
