import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const NITEROI_CENTER: [number, number] = [-22.8838, -43.1044]
const AUTH_KEY = 'baldas-auth'

const MapaLeaflet = dynamic(() => import('../../components/MapaLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-80 rounded-2xl animate-pulse" style={{ backgroundColor: '#F0F5F7' }} />
  ),
})

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
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      endereco + ', Niterói, RJ, Brasil'
    )}&limit=1`
    const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } })
    const data = await res.json()
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

async function buscarCondominios(): Promise<Condominio[]> {
  const res = await fetch('/api/condominios')
  if (!res.ok) return []
  return res.json()
}

async function salvarCondominios(lista: Condominio[]): Promise<void> {
  await fetch('/api/condominios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lista),
  })
}

export default function AdminCondominios() {
  const [autenticado, setAutenticado] = useState(false)
  const [condominios, setCondominios] = useState<Condominio[]>([])
  const [form, setForm] = useState({ nome: '', endereco: '', unidades: '', lat: '', lng: '' })
  const [geocoding, setGeocoding] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [sucesso, setSucesso] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) !== 'ok') {
      window.location.href = '/admin'
      return
    }
    setAutenticado(true)
    buscarCondominios()
      .then(lista => setCondominios(lista))
      .finally(() => setCarregando(false))
  }, [])

  const sair = () => {
    sessionStorage.removeItem(AUTH_KEY)
    window.location.href = '/admin'
  }

  const salvar = async (lista: Condominio[]) => {
    setCondominios(lista)
    await salvarCondominios(lista)
  }

  const mostrarSucesso = (msg: string) => {
    setSucesso(msg)
    setTimeout(() => setSucesso(''), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim() || !form.endereco.trim()) return
    setErro('')

    // Se lat/lng já preenchidos manualmente, usa direto
    const latManual = parseFloat(form.lat.replace(',', '.'))
    const lngManual = parseFloat(form.lng.replace(',', '.'))
    const coordsManuais = !isNaN(latManual) && !isNaN(lngManual)
      ? { lat: latManual, lng: lngManual }
      : null

    let coords = coordsManuais
    if (!coords) {
      setGeocoding(true)
      coords = await geocodificar(form.endereco)
      if (!coords) {
        setErro('Endereço não encontrado. Preencha latitude e longitude manualmente.')
        setGeocoding(false)
        return
      }
      // Preenche os campos com as coords encontradas
      setForm(f => ({ ...f, lat: coords!.lat.toFixed(6), lng: coords!.lng.toFixed(6) }))
    }

    const dados = { nome: form.nome, endereco: form.endereco, unidades: form.unidades, ...coords }
    if (editId !== null) {
      await salvar(condominios.map(c => (c.id === editId ? { ...c, ...dados } : c)))
      setEditId(null)
      mostrarSucesso('Condomínio atualizado com sucesso!')
    } else {
      await salvar([...condominios, { id: Date.now(), ...dados }])
      mostrarSucesso('Condomínio adicionado ao mapa!')
    }
    setForm({ nome: '', endereco: '', unidades: '', lat: '', lng: '' })
    setGeocoding(false)
  }

  const remover = async (id: number) => {
    if (confirm('Remover este condomínio do mapa?')) {
      await salvar(condominios.filter(c => c.id !== id))
      mostrarSucesso('Condomínio removido.')
    }
  }

  const editar = (c: Condominio) => {
    setForm({ nome: c.nome, endereco: c.endereco, unidades: c.unidades, lat: c.lat.toFixed(6), lng: c.lng.toFixed(6) })
    setEditId(c.id)
    setErro('')
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const cancelarEdicao = () => {
    setEditId(null)
    setForm({ nome: '', endereco: '', unidades: '', lat: '', lng: '' })
    setErro('')
  }

  if (!autenticado) return null

  return (
    <>
      <Head>
        <title>Condomínios — Admin Baldas Hub</title>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Topbar */}
      <div style={{ backgroundColor: '#0A3244' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src="/logo.jpeg" alt="Logo" width={32} height={32} className="rounded-lg" />
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Baldas Hub</p>
                <p className="text-xs leading-tight" style={{ color: '#6AAFC4' }}>Nossos Condomínios</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{ color: '#A8CDD9', backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                ← Painel
              </Link>
              <Link
                href="/#mapa"
                target="_blank"
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{ color: '#A8CDD9', backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                Ver mapa ↗
              </Link>
              <button
                onClick={sair}
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{ color: '#A8CDD9', backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen" style={{ backgroundColor: '#F8FAFB' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#0A3244' }}>🏢 Nossos Condomínios</h1>
              <p className="text-sm mt-1" style={{ color: '#4A6572' }}>
                {carregando
                  ? 'Carregando...'
                  : condominios.length === 0
                  ? 'Nenhum condomínio cadastrado ainda.'
                  : `${condominios.length} condomínio${condominios.length > 1 ? 's' : ''} cadastrado${condominios.length > 1 ? 's' : ''}.`}
              </p>
            </div>
            {sucesso && (
              <div
                className="text-sm px-4 py-2 rounded-xl font-medium"
                style={{ backgroundColor: '#E8F8F0', color: '#1a7a4a', border: '1px solid #b2dfcc' }}
              >
                ✓ {sucesso}
              </div>
            )}
          </div>

          {/* Mapa */}
          <div className="mb-8 rounded-2xl overflow-hidden" style={{ border: '1px solid #D6E8EF' }}>
            <MapaLeaflet condominios={condominios} center={NITEROI_CENTER} />
          </div>

          {/* Formulário */}
          <div
            ref={formRef}
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: '#fff', border: '1px solid #D6E8EF' }}
          >
            <h2 className="font-bold text-base mb-5" style={{ color: '#0A3244' }}>
              {editId !== null ? '✏️ Editar condomínio' : '+ Adicionar condomínio'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#4A6572' }}>
                  Nome do condomínio *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Edifício Mar Azul"
                  value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })}
                  required
                  className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
                  style={{ border: '1px solid #D6E8EF', color: '#0F1923', backgroundColor: '#F8FAFB' }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#4A6572' }}>
                  Endereço *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Rua das Flores, 100, Icaraí"
                  value={form.endereco}
                  onChange={e => setForm({ ...form, endereco: e.target.value })}
                  required
                  className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
                  style={{ border: '1px solid #D6E8EF', color: '#0F1923', backgroundColor: '#F8FAFB' }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#4A6572' }}>
                  Unidades
                </label>
                <input
                  type="number"
                  placeholder="Ex: 48"
                  value={form.unidades}
                  onChange={e => setForm({ ...form, unidades: e.target.value })}
                  min="1"
                  className="w-full text-sm px-3 py-2.5 rounded-xl outline-none"
                  style={{ border: '1px solid #D6E8EF', color: '#0F1923', backgroundColor: '#F8FAFB' }}
                />
              </div>

              {/* Lat / Lng — preenchidos após geocodificação ou manualmente */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#4A6572' }}>
                  Latitude <span style={{ color: '#A8CDD9', fontWeight: 400 }}>(opcional — ajuste fino)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: -22.923456"
                  value={form.lat}
                  onChange={e => setForm({ ...form, lat: e.target.value })}
                  className="w-full text-sm px-3 py-2.5 rounded-xl outline-none font-mono"
                  style={{ border: '1px solid #D6E8EF', color: '#0F1923', backgroundColor: '#F8FAFB' }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#4A6572' }}>
                  Longitude <span style={{ color: '#A8CDD9', fontWeight: 400 }}>(opcional — ajuste fino)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: -43.178901"
                  value={form.lng}
                  onChange={e => setForm({ ...form, lng: e.target.value })}
                  className="w-full text-sm px-3 py-2.5 rounded-xl outline-none font-mono"
                  style={{ border: '1px solid #D6E8EF', color: '#0F1923', backgroundColor: '#F8FAFB' }}
                />
              </div>
              <div className="sm:col-span-3" style={{ fontSize: '0.75rem', color: '#8FA3AE' }}>
                💡 Deixe lat/lng em branco para busca automática pelo endereço. Ou preencha manualmente com as coordenadas do Google Maps (clique direito no local → "O que há aqui?").
              </div>

              <div className="sm:col-span-3 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={geocoding}
                  className="text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                  style={{
                    backgroundColor: geocoding ? '#A8CDD9' : '#0d6e8a',
                    cursor: geocoding ? 'not-allowed' : 'pointer',
                  }}
                >
                  {geocoding
                    ? '⏳ Localizando endereço…'
                    : editId !== null
                    ? 'Salvar alterações'
                    : 'Adicionar ao mapa'}
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
                {erro && (
                  <p className="text-sm" style={{ color: '#c53030' }}>
                    ⚠️ {erro}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Lista */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: '#fff', border: '1px solid #D6E8EF' }}
          >
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #F0F5F7' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#4A6572' }}>
                Condomínios cadastrados
              </p>
            </div>

            {carregando ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3 animate-pulse">⏳</div>
                <p className="text-sm" style={{ color: '#8FA3AE' }}>Carregando condomínios...</p>
              </div>
            ) : condominios.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🏢</div>
                <p className="font-semibold text-sm mb-1" style={{ color: '#0A3244' }}>Nenhum condomínio ainda</p>
                <p className="text-sm" style={{ color: '#8FA3AE' }}>
                  Adicione o primeiro condomínio usando o formulário acima.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #F0F5F7' }}>
                    <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: '#8FA3AE' }}>Nome</th>
                    <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell" style={{ color: '#8FA3AE' }}>Endereço</th>
                    <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: '#8FA3AE' }}>Unidades</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {condominios.map((c, i) => (
                    <tr
                      key={c.id}
                      style={{ borderBottom: i < condominios.length - 1 ? '1px solid #F0F5F7' : 'none' }}
                    >
                      <td className="px-6 py-4 font-semibold" style={{ color: '#0A3244' }}>{c.nome}</td>
                      <td className="px-6 py-4 hidden sm:table-cell" style={{ color: '#4A6572' }}>{c.endereco}</td>
                      <td className="px-6 py-4 hidden md:table-cell" style={{ color: '#0d6e8a' }}>
                        {c.unidades ? `${c.unidades} un.` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => editar(c)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            style={{ backgroundColor: '#F0F5F7', color: '#0d475c' }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => remover(c.id)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            style={{ backgroundColor: '#FFF0F0', color: '#c53030' }}
                          >
                            Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <p className="text-xs text-center mt-6" style={{ color: '#8FA3AE' }}>
            Os dados são salvos no banco de dados e aparecem em todos os dispositivos.
          </p>
        </div>
      </div>
    </>
  )
}
