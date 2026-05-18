import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

const SENHA_HASH = 'a09abc9220bf7b0d3df6eab6173efb8c93c709ba4d11d1dd49c73e7e76295fc7'

async function sha256(texto: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function gerarSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

interface Post {
  _id: string
  slug: string
  titulo: string
  resumo: string
  conteudo: string
  imagem: string
  data: string
  publicado: boolean
}

const formVazio = {
  titulo: '',
  resumo: '',
  conteudo: '',
  imagem: '',
  data: new Date().toISOString().split('T')[0],
  publicado: false,
}

export default function AdminBlog() {
  const [autenticado, setAutenticado] = useState(false)
  const [senha, setSenha] = useState('')
  const [erroSenha, setErroSenha] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [editando, setEditando] = useState<Post | null>(null)
  const [form, setForm] = useState(formVazio)
  const [salvando, setSalvando] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [aba, setAba] = useState<'lista' | 'editor'>('lista')

  useEffect(() => {
    if (sessionStorage.getItem('baldas-auth') === 'ok') setAutenticado(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const hash = await sha256(senha)
    if (hash === SENHA_HASH) {
      sessionStorage.setItem('baldas-auth', 'ok')
      setAutenticado(true)
      setErroSenha(false)
    } else {
      setErroSenha(true)
      setSenha('')
    }
  }

  const carregarPosts = useCallback(async () => {
    setCarregando(true)
    try {
      const res = await fetch('/api/blog/posts')
      const data = await res.json()
      setPosts(data)
    } catch {
      setPosts([])
    }
    setCarregando(false)
  }, [])

  useEffect(() => {
    if (autenticado) carregarPosts()
  }, [autenticado, carregarPosts])

  const novoPost = () => {
    setEditando(null)
    setForm({ ...formVazio, data: new Date().toISOString().split('T')[0] })
    setAba('editor')
  }

  const editarPost = (post: Post) => {
    setEditando(post)
    setForm({
      titulo: post.titulo,
      resumo: post.resumo,
      conteudo: post.conteudo,
      imagem: post.imagem,
      data: post.data,
      publicado: post.publicado,
    })
    setAba('editor')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim() || !form.conteudo.trim()) return
    setSalvando(true)
    const slug = gerarSlug(form.titulo)
    try {
      if (editando) {
        await fetch(`/api/blog/${editando._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, slug }),
        })
      } else {
        await fetch('/api/blog/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, slug }),
        })
      }
      await carregarPosts()
      setAba('lista')
    } catch {
      alert('Erro ao salvar. Tente novamente.')
    }
    setSalvando(false)
  }

  const togglePublicado = async (post: Post) => {
    await fetch(`/api/blog/${post._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicado: !post.publicado }),
    })
    await carregarPosts()
  }

  const deletarPost = async (id: string) => {
    await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    await carregarPosts()
  }

  // ── LOGIN ──
  if (!autenticado) {
    return (
      <>
        <Head>
          <title>Admin Blog — Baldas Hub</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8FAFB' }}>
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <Image src="/logo.jpeg" alt="Logo" width={56} height={56} className="rounded-xl mx-auto mb-3" />
              <h1 className="text-xl font-bold" style={{ color: '#0A3244' }}>Painel do Blog</h1>
              <p className="text-sm mt-1" style={{ color: '#4A6572' }}>Baldas Hub Condominial</p>
            </div>
            <form onSubmit={handleLogin} className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#fff' }}>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0A3244' }}>Senha de acesso</label>
              <input
                type="password"
                value={senha}
                onChange={e => { setSenha(e.target.value); setErroSenha(false) }}
                placeholder="••••••••"
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none mb-4"
                style={{ borderColor: erroSenha ? '#ef4444' : '#D6E8EF', color: '#0F1923' }}
                autoFocus
              />
              {erroSenha && <p className="text-xs text-red-500 mb-4">Senha incorreta.</p>}
              <button type="submit" className="w-full py-3 rounded-xl text-white text-sm font-semibold" style={{ backgroundColor: '#0d6e8a' }}>
                Entrar
              </button>
            </form>
            <div className="text-center mt-4">
              <Link href="/" className="text-xs" style={{ color: '#4A6572' }}>← Voltar ao site</Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── PAINEL ──
  return (
    <>
      <Head>
        <title>Admin Blog — Baldas Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="fixed top-0 left-0 right-0 z-50 shadow-sm" style={{ backgroundColor: '#0A3244' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Image src="/logo.jpeg" alt="Logo" width={28} height={28} className="rounded-md" />
              <span className="font-semibold text-sm text-white">Admin · Blog</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/blog" target="_blank" className="text-xs" style={{ color: '#A8CDD9' }}>Ver blog ↗</Link>
              <Link href="/" className="text-xs" style={{ color: '#A8CDD9' }}>Sair</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-14 min-h-screen" style={{ backgroundColor: '#F8FAFB' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setAba('lista')}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: aba === 'lista' ? '#0A3244' : '#fff', color: aba === 'lista' ? '#fff' : '#4A6572', border: '1px solid #D6E8EF' }}
              >
                Posts ({posts.length})
              </button>
              <button
                onClick={() => setAba('editor')}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: aba === 'editor' ? '#0A3244' : '#fff', color: aba === 'editor' ? '#fff' : '#4A6572', border: '1px solid #D6E8EF' }}
              >
                {editando ? 'Editar post' : 'Novo post'}
              </button>
            </div>
            {aba === 'lista' && (
              <button onClick={novoPost} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#0d6e8a' }}>
                + Novo post
              </button>
            )}
          </div>

          {/* LISTA */}
          {aba === 'lista' && (
            <div className="space-y-3">
              {carregando && (
                <div className="text-center py-12" style={{ color: '#4A6572' }}>Carregando...</div>
              )}
              {!carregando && posts.length === 0 && (
                <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: '#fff', border: '1px dashed #D6E8EF' }}>
                  <p className="text-4xl mb-3">📝</p>
                  <p className="font-medium mb-1" style={{ color: '#0A3244' }}>Nenhum post criado ainda</p>
                  <p className="text-sm mb-4" style={{ color: '#4A6572' }}>Clique em &quot;Novo post&quot; para começar.</p>
                  <button onClick={novoPost} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#0d6e8a' }}>
                    Criar primeiro post
                  </button>
                </div>
              )}
              {posts.map(post => (
                <div key={post._id} className="rounded-xl p-4 flex items-center gap-4" style={{ backgroundColor: '#fff', border: '1px solid #D6E8EF' }}>
                  {post.imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.imagem} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: '#F0F5F7' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8CDD9" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: '#0A3244' }}>{post.titulo}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#4A6572' }}>{post.data} · /{post.slug}</p>
                  </div>
                  <button
                    onClick={() => togglePublicado(post)}
                    className="shrink-0 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: post.publicado ? '#D1FAE5' : '#FEF3C7', color: post.publicado ? '#065F46' : '#92400E' }}
                  >
                    {post.publicado ? '✓ Publicado' : '⏸ Rascunho'}
                  </button>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => editarPost(post)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#F0F5F7', color: '#0A3244' }}>
                      Editar
                    </button>
                    {confirmDelete === post._id ? (
                      <div className="flex gap-1">
                        <button onClick={() => deletarPost(post._id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#ef4444' }}>Confirmar</button>
                        <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#F0F5F7', color: '#4A6572' }}>Cancelar</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(post._id)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}>Excluir</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EDITOR */}
          {aba === 'editor' && (
            <form onSubmit={handleSubmit} className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#fff', border: '1px solid #D6E8EF' }}>
              <h2 className="font-bold text-lg mb-6" style={{ color: '#0A3244' }}>
                {editando ? 'Editar post' : 'Novo post'}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#0A3244' }}>Título *</label>
                  <input
                    type="text" value={form.titulo} required
                    onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                    placeholder="Título do artigo"
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ borderColor: '#D6E8EF', color: '#0F1923' }}
                  />
                  {form.titulo && (
                    <p className="text-xs mt-1" style={{ color: '#4A6572' }}>URL: /blog/{gerarSlug(form.titulo)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#0A3244' }}>Data</label>
                  <input type="date" value={form.data}
                    onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ borderColor: '#D6E8EF', color: '#0F1923' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#0A3244' }}>URL da imagem de capa (opcional)</label>
                  <input type="url" value={form.imagem}
                    onChange={e => setForm(f => ({ ...f, imagem: e.target.value }))}
                    placeholder="https://..."
                    className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ borderColor: '#D6E8EF', color: '#0F1923' }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#0A3244' }}>Resumo</label>
                <textarea value={form.resumo} rows={2}
                  onChange={e => setForm(f => ({ ...f, resumo: e.target.value }))}
                  placeholder="Breve descrição do artigo..."
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  style={{ borderColor: '#D6E8EF', color: '#0F1923' }}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#0A3244' }}>Conteúdo *</label>
                <textarea value={form.conteudo} rows={16} required
                  onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))}
                  placeholder="Escreva o conteúdo completo aqui. Deixe uma linha em branco entre parágrafos."
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none resize-y"
                  style={{ borderColor: '#D6E8EF', color: '#0F1923', fontFamily: 'inherit', lineHeight: '1.6' }}
                />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, publicado: !f.publicado }))}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{ backgroundColor: form.publicado ? '#0d6e8a' : '#D6E8EF' }}
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    style={{ transform: form.publicado ? 'translateX(22px)' : 'translateX(2px)' }} />
                </button>
                <label className="text-sm font-medium" style={{ color: '#0A3244' }}>
                  {form.publicado ? 'Publicar imediatamente' : 'Salvar como rascunho'}
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={salvando}
                  className="px-6 py-3 rounded-xl text-white text-sm font-semibold"
                  style={{ backgroundColor: '#0d6e8a', opacity: salvando ? 0.7 : 1 }}
                >
                  {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar post'}
                </button>
                <button type="button" onClick={() => setAba('lista')}
                  className="px-6 py-3 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#F0F5F7', color: '#4A6572' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
