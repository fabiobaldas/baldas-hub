'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const NITEROI_CENTER: [number, number] = [-22.8838, -43.1044]
const STORAGE_KEY = 'baldas-condominios'
const SENHA_HASH = 'a09abc9220bf7b0d3df6eab6173efb8c93c709ba4d11d1dd49c73e7e76295fc7'
const AUTH_KEY = 'baldas-auth'

async function hashSenha(senha: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(senha))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

interface Condominio {
  id: number
  nome: string
  endereco: string
  unidades: string
  lat: number
  lng: number
}

async function geocodificar(endereco: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco + ', Niterói, RJ, Brasil')}&limit=1`
    const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } })
    const data = await res.json()
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

// Carrega o mapa Leaflet apenas no cliente (sem SSR)
const MapaLeaflet = dynamic(() => import('./MapaLeaflet'), { ssr: false, loading: () => (
  <div className="h-96 rounded-2xl animate-pulse" style={{ backgroundColor: '#F0F5F7' }} />
)})

export default function Mapa() {
  const [condominios, setCondominios] = useState<Condominio[]>([])
  const [autenticado, setAutenticado] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [senhaInput, setSenhaInput] = useState('')
  const [erroLogin, setErroLogin] = useState('')
  const [form, setForm] = useState({ nome: '', endereco: '', unidades: '' })
  const [geocoding, setGeocoding] = useState(false)
  const [erro, setErro] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setCondominios(JSON.parse(saved))
    // Verificar se já está autenticado na sessão
    if (sessionStorage.getItem(AUTH_KEY) === '1') setAutenticado(true)
  }, [])

  const handleAbrirAdmin = () => {
    if (autenticado) {
      setShowAdmin(!showAdmin)
    } else {
      setShowLoginModal(true)
      setSenhaInput('')
      setErroLogin('')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const hash = await hashSenha(senhaInput)
    if (hash === SENHA_HASH) {
      sessionStorage.setItem(AUTH_KEY, '1')
      setAutenticado(true)
      setShowLoginModal(false)
      setShowAdmin(true)
      setSenhaInput('')
      setErroLogin('')
    } else {
      setErroLogin('Senha incorreta.')
      setSenhaInput('')
    }
  }

  const handleFecharAdmin = () => {
    setShowAdmin(false)
  }

  const salvar = (lista: Condominio[]) => {
    setCondominios(lista)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim() || !form.endereco.trim()) return
    setGeocoding(true)
    setErro('')
    const coords = await geocodificar(form.endereco)
    if (!coords) {
      setErro('Endereço não encontrado. Tente ser mais específico.')
      setGeocoding(false)
      return
    }
    if (editId !== null) {
      salvar(condominios.map(c => c.id === editId ? { ...c, ...form, ...coords } : c))
      setEditId(null)
    } else {
      salvar([...condominios, { id: Date.now(), ...form, ...coords }])
    }
    setForm({ nome: '', endereco: '', unidades: '' })
    setGeocoding(false)
  }

  const remover = (id: number) => {
    if (confirm('Remover este condomínio?')) salvar(condominios.filter(c => c.id !== id))
  }

  const editar = (c: Condominio) => {
    setForm({ nome: c.nome, endereco: c.endereco, unidades: c.unidades })
    setEditId(c.id)
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const cancelarEdicao = () => {
    setEditId(null)
    setForm({ nome: '', endereco: '', unidades: '' })
    setErro('')
  }

  return (
    <section id="mapa" className="py-24" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#0d6e8a' }}>Localização</p>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#0A3244', letterSpacing: '-0.02em' }}>
              Nossos condomínios
            </h2>
            <p style={{ color: '#4A6572' }}>
              {condominios.length > 0
                ? `${condominios.length} condomínio${condominios.length > 1 ? 's' : ''} em Niterói e região.`
                : 'Adicione os condomínios que você administra.'}
            </p>
          </div>
          <button
            onClick={handleAbrirAdmin}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
            style={{
              backgroundColor: showAdmin ? '#0A3244' : '#F0F5F7',
              color: showAdmin ? 'white' : '#0d475c',
              border: '1px solid #D6E8EF',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {showAdmin ? 'Fechar Gerenciamento' : 'Gerenciar Condomínios'}
          </button>
        </div>

        {/* Modal de senha */}
        {showLoginModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(10,50,68,0.5)' }}
            onClick={e => { if (e.target === e.currentTarget) { setShowLoginModal(false); setSenhaInput('') } }}
          >
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl mx-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0F5F7' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A3244" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#0A3244' }}>Área restrita</p>
                  <p className="text-xs" style={{ color: '#8FA3AE' }}>Digite a senha para continuar</p>
                </div>
              </div>
              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="Senha"
                  value={senhaInput}
                  onChange={e => setSenhaInput(e.target.value)}
                  autoFocus
                  className="w-full text-sm px-4 py-3 rounded-xl outline-none"
                  style={{ border: erroLogin ? '1px solid #e53e3e' : '1px solid #D6E8EF', color: '#0F1923' }}
                />
                {erroLogin && <p className="text-xs" style={{ color: '#e53e3e' }}>{erroLogin}</p>}
                <button
                  type="submit"
                  className="w-full text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                  style={{ backgroundColor: '#0d6e8a' }}
                >
                  Entrar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mapa Leaflet (gratuito, sem API key) */}
        <div className="mb-6">
          <MapaLeaflet condominios={condominios} center={NITEROI_CENTER} />
        </div>

        {/* Cards quando painel fechado */}
        {condominios.length > 0 && !showAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {condominios.map(c => (
              <div
                key={c.id}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ backgroundColor: '#F8FAFB', border: '1px solid #D6E8EF' }}
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#D6E8EF' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d6e8a" strokeWidth="2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#0A3244' }}>{c.nome}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#4A6572' }}>{c.endereco}</p>
                  {c.unidades && <p className="text-xs mt-0.5" style={{ color: '#0d6e8a' }}>{c.unidades} unidades</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Painel de gerenciamento */}
        {showAdmin && (
          <div className="mt-6 rounded-2xl overflow-hidden" style={{ border: '1px solid #D6E8EF' }}>

            <div ref={formRef} className="p-6" style={{ backgroundColor: '#F8FAFB', borderBottom: '1px solid #D6E8EF' }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#0A3244' }}>
                {editId !== null ? '✏️ Editar condomínio' : '+ Adicionar condomínio'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: '#4A6572' }}>Nome do condomínio *</label>
                  <input
                    type="text"
                    placeholder="Ex: Edifício Mar Azul"
                    value={form.nome}
                    onChange={e => setForm({ ...form, nome: e.target.value })}
                    required
                    className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
                    style={{ backgroundColor: 'white', border: '1px solid #D6E8EF', color: '#0F1923' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: '#4A6572' }}>Endereço *</label>
                  <input
                    type="text"
                    placeholder="Ex: Rua das Flores, 100, Icaraí"
                    value={form.endereco}
                    onChange={e => setForm({ ...form, endereco: e.target.value })}
                    required
                    className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
                    style={{ backgroundColor: 'white', border: '1px solid #D6E8EF', color: '#0F1923' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: '#4A6572' }}>Unidades</label>
                  <input
                    type="number"
                    placeholder="Ex: 48"
                    value={form.unidades}
                    onChange={e => setForm({ ...form, unidades: e.target.value })}
                    min="1"
                    className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
                    style={{ backgroundColor: 'white', border: '1px solid #D6E8EF', color: '#0F1923' }}
                  />
                </div>
                <div className="sm:col-span-3 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={geocoding}
                    className="text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                    style={{ backgroundColor: geocoding ? '#A8CDD9' : '#0d6e8a', cursor: geocoding ? 'not-allowed' : 'pointer' }}
                  >
                    {geocoding ? 'Localizando endereço…' : editId !== null ? 'Salvar alterações' : 'Adicionar ao mapa'}
                  </button>
                  {editId !== null && (
                    <button
                      type="button"
                      onClick={cancelarEdicao}
                      className="text-sm font-medium px-4 py-2.5 rounded-xl"
                      style={{ backgroundColor: '#F0F5F7', color: '#4A6572' }}
                    >
                      Cancelar
                    </button>
                  )}
                  {erro && <p className="text-sm" style={{ color: '#e53e3e' }}>{erro}</p>}
                </div>
              </form>
            </div>

            <div style={{ backgroundColor: 'white' }}>
              {condominios.length === 0 ? (
                <p className="text-sm text-center py-10" style={{ color: '#8FA3AE' }}>
                  Nenhum condomínio adicionado ainda.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #F0F5F7' }}>
                      <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: '#8FA3AE' }}>Condomínio</th>
                      <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell" style={{ color: '#8FA3AE' }}>Endereço</th>
                      <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: '#8FA3AE' }}>Unidades</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {condominios.map((c, i) => (
                      <tr key={c.id} style={{ borderBottom: i < condominios.length - 1 ? '1px solid #F0F5F7' : 'none' }}>
                        <td className="px-6 py-4 font-semibold" style={{ color: '#0A3244' }}>{c.nome}</td>
                        <td className="px-6 py-4 hidden sm:table-cell" style={{ color: '#4A6572' }}>{c.endereco}</td>
                        <td className="px-6 py-4 hidden md:table-cell" style={{ color: '#0d6e8a' }}>{c.unidades ? `${c.unidades} un.` : '—'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => editar(c)} className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#F0F5F7', color: '#0d475c' }}>Editar</button>
                            <button onClick={() => remover(c.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#FFF0F0', color: '#c53030' }}>Remover</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
