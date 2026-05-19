import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

const SENHA_HASH = 'a09abc9220bf7b0d3df6eab6173efb8c93c709ba4d11d1dd49c73e7e76295fc7'

async function sha256(texto: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const ferramentas = [
  {
    icon: '📝',
    titulo: 'Blog',
    descricao: 'Criar, editar e publicar artigos no blog do site.',
    href: '/admin/blog',
    externo: false,
    cor: '#0d6e8a',
    bgCor: '#F0F5F7',
  },
  {
    icon: '🏢',
    titulo: 'Nossos Condomínios',
    descricao: 'Gerenciar os condomínios exibidos no mapa interativo.',
    href: '/admin/condominios',
    externo: false,
    cor: '#0d475c',
    bgCor: '#EEF4F7',
  },
  {
    icon: '📊',
    titulo: 'Sistema de Conciliação',
    descricao: 'Conciliação bancária: associar lançamentos OFX a comprovantes PDF.',
    href: 'https://conciliacao-baldashub.onrender.com',
    externo: true,
    cor: '#1B8FAD',
    bgCor: '#E8F4F8',
  },
]

export default function AdminPortal() {
  const [autenticado, setAutenticado] = useState(false)
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(false)
  const [hora, setHora] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('baldas-auth') === 'ok') setAutenticado(true)
    const atualizar = () => setHora(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    atualizar()
    const id = setInterval(atualizar, 60000)
    return () => clearInterval(id)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const hash = await sha256(senha)
    if (hash === SENHA_HASH) {
      sessionStorage.setItem('baldas-auth', 'ok')
      setAutenticado(true)
      setErro(false)
    } else {
      setErro(true)
      setSenha('')
    }
  }

  const sair = () => {
    sessionStorage.removeItem('baldas-auth')
    setAutenticado(false)
  }

  // ── TELA DE LOGIN ────────────────────────────────────────────────────────────
  if (!autenticado) {
    return (
      <>
        <Head>
          <title>Área Administrativa — Baldas Hub</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="noindex" />
        </Head>
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{ background: 'linear-gradient(135deg, #0A3244 0%, #0d6e8a 100%)' }}
        >
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <Image src="/logo.jpeg" alt="Baldas Hub" width={64} height={64} className="rounded-2xl shadow-lg" />
              </div>
              <h1 className="text-2xl font-bold text-white">Área Administrativa</h1>
              <p className="text-sm mt-1" style={{ color: '#A8CDD9' }}>Baldas Hub Condominial</p>
            </div>

            {/* Card de login */}
            <div className="rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: '#fff' }}>
              <form onSubmit={handleLogin}>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0A3244' }}>
                  Senha de acesso
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErro(false) }}
                  placeholder="••••••••"
                  autoFocus
                  required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none mb-4 transition-colors"
                  style={{
                    borderColor: erro ? '#ef4444' : '#D6E8EF',
                    color: '#0F1923',
                  }}
                />
                {erro && (
                  <p className="text-xs text-red-500 mb-4 flex items-center gap-1">
                    <span>⚠️</span> Senha incorreta. Tente novamente.
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity"
                  style={{ backgroundColor: '#0d475c' }}
                >
                  Entrar
                </button>
              </form>
            </div>

            <p className="text-center text-xs mt-4" style={{ color: 'rgba(168,205,217,0.6)' }}>
              Acesso restrito — Baldas Hub © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </>
    )
  }

  // ── PAINEL PRINCIPAL ─────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>Painel Admin — Baldas Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </Head>

      {/* Topbar */}
      <div style={{ backgroundColor: '#0A3244' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src="/logo.jpeg" alt="Logo" width={32} height={32} className="rounded-lg" />
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Baldas Hub</p>
                <p className="text-xs leading-tight" style={{ color: '#6AAFC4' }}>Área Administrativa</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {hora && (
                <span className="text-xs hidden sm:block" style={{ color: '#6AAFC4' }}>{hora}</span>
              )}
              <Link
                href="/"
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{ color: '#A8CDD9', backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                Ver site ↗
              </Link>
              <button
                onClick={sair}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{ color: '#A8CDD9', backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="min-h-screen" style={{ backgroundColor: '#F8FAFB' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Saudação */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold" style={{ color: '#0A3244' }}>Bem-vindo, Fábio 👋</h2>
            <p className="text-sm mt-1" style={{ color: '#4A6572' }}>
              Selecione o sistema que deseja acessar.
            </p>
          </div>

          {/* Cards das ferramentas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {ferramentas.map((f) => (
              <a
                key={f.titulo}
                href={f.href}
                target={f.externo ? '_blank' : undefined}
                rel={f.externo ? 'noreferrer' : undefined}
                className="group block rounded-2xl p-6 transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: '#fff', border: '1px solid #D6E8EF' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: f.bgCor }}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-base mb-1" style={{ color: '#0A3244' }}>{f.titulo}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4A6572' }}>{f.descricao}</p>
                <div
                  className="mt-4 flex items-center gap-1 text-xs font-semibold"
                  style={{ color: f.cor }}
                >
                  {f.externo ? 'Abrir sistema ↗' : 'Acessar →'}
                </div>
              </a>
            ))}
          </div>

          {/* Atalhos rápidos */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#fff', border: '1px solid #D6E8EF' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#4A6572' }}>
              Atalhos rápidos
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/blog"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: '#F0F5F7', color: '#0d475c' }}
              >
                ✏️ Novo post
              </Link>
              <Link
                href="/blog"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: '#F0F5F7', color: '#0d475c' }}
              >
                📖 Ver blog público
              </Link>
              <Link
                href="/admin/condominios"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: '#F0F5F7', color: '#0d475c' }}
              >
                🗺️ Gerenciar mapa
              </Link>
              <a
                href="https://conciliacao-baldashub.onrender.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: '#F0F5F7', color: '#0d475c' }}
              >
                📊 Abrir conciliação ↗
              </a>
              <a
                href="https://wa.me/5521971788414"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: '#F0F5F7', color: '#0d475c' }}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
