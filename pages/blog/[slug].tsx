import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  id: string
  slug: string
  titulo: string
  resumo: string
  conteudo: string
  imagem: string
  data: string
  publicado: boolean
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  const meses = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ]
  return `${dia} de ${meses[parseInt(mes) - 1]} de ${ano}`
}

export default function PostPage() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState<Post | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [naoEncontrado, setNaoEncontrado] = useState(false)

  useEffect(() => {
    if (!slug) return
    try {
      const raw = localStorage.getItem('baldas-blog-posts')
      const todos: Post[] = raw ? JSON.parse(raw) : []
      const encontrado = todos.find(p => p.slug === slug && p.publicado)
      if (encontrado) {
        setPost(encontrado)
      } else {
        setNaoEncontrado(true)
      }
    } catch {
      setNaoEncontrado(true)
    }
    setCarregando(false)
  }, [slug])

  return (
    <>
      <Head>
        <title>{post ? `${post.titulo} — Baldas Hub` : 'Artigo — Baldas Hub'}</title>
        <meta name="description" content={post?.resumo || ''} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpeg" alt="Baldas Hub" width={36} height={36} className="rounded-md" />
              <span className="font-bold text-lg hidden sm:block" style={{ color: '#0A3244' }}>Baldas Hub Condominial</span>
            </Link>
            <Link href="/blog" className="text-sm font-medium" style={{ color: '#4A6572' }}>
              ← Voltar ao blog
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 min-h-screen" style={{ backgroundColor: '#F8FAFB' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Carregando */}
          {carregando && (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-3/4" />
              <div className="h-4 bg-gray-200 rounded mb-8 w-1/4" />
              <div className="h-72 bg-gray-200 rounded-2xl mb-8" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          )}

          {/* Não encontrado */}
          {!carregando && naoEncontrado && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#0A3244' }}>Artigo não encontrado</h1>
              <p className="mb-6" style={{ color: '#4A6572' }}>Este artigo não existe ou foi removido.</p>
              <Link
                href="/blog"
                className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm"
                style={{ backgroundColor: '#0d6e8a' }}
              >
                Ver todos os artigos
              </Link>
            </div>
          )}

          {/* Post */}
          {!carregando && post && (
            <article>
              {/* Data e categoria */}
              <div className="mb-4">
                <span
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#F0F5F7', color: '#0d6e8a', border: '1px solid #A8CDD9' }}
                >
                  Administração Condominial
                </span>
              </div>

              {/* Título */}
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-3" style={{ color: '#0A3244' }}>
                {post.titulo}
              </h1>

              {/* Data */}
              <p className="text-sm mb-8" style={{ color: '#4A6572' }}>
                {formatarData(post.data)}
              </p>

              {/* Imagem de capa */}
              {post.imagem && (
                <div className="mb-8 rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imagem}
                    alt={post.titulo}
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>
              )}

              {/* Resumo em destaque */}
              {post.resumo && (
                <p
                  className="text-lg leading-relaxed mb-8 p-6 rounded-2xl font-medium"
                  style={{ backgroundColor: '#F0F5F7', color: '#0d475c', borderLeft: '4px solid #0d6e8a' }}
                >
                  {post.resumo}
                </p>
              )}

              {/* Conteúdo */}
              <div
                className="prose-baldas text-base leading-relaxed"
                style={{ color: '#0F1923' }}
              >
                {post.conteudo.split('\n').map((paragrafo, i) =>
                  paragrafo.trim() === '' ? (
                    <div key={i} className="my-4" />
                  ) : (
                    <p key={i} className="mb-4" style={{ color: '#4A6572' }}>
                      {paragrafo}
                    </p>
                  )
                )}
              </div>

              {/* Divisor */}
              <div className="my-10" style={{ borderTop: '1px solid #D6E8EF' }} />

              {/* CTA */}
              <div
                className="rounded-2xl p-6 text-white"
                style={{ backgroundColor: '#0A3244' }}
              >
                <p className="font-semibold text-lg mb-2">Precisa de ajuda com seu condomínio?</p>
                <p className="text-sm mb-4" style={{ color: '#A8CDD9' }}>
                  A Baldas Hub oferece gestão profissional em Niterói/RJ. Entre em contato e solicite uma proposta.
                </p>
                <a
                  href="https://wa.me/5521971788414?text=Olá%2C%20li%20um%20artigo%20do%20blog%20e%20gostaria%20de%20mais%20informações"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: '#1B8FAD' }}
                >
                  Falar pelo WhatsApp
                </a>
              </div>

              {/* Voltar */}
              <div className="mt-8">
                <Link
                  href="/blog"
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: '#0d6e8a' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Todos os artigos
                </Link>
              </div>
            </article>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-sm" style={{ backgroundColor: '#0A3244', color: '#A8CDD9' }}>
        © {new Date().getFullYear()} Baldas Hub Condominial · Niterói/RJ
      </footer>
    </>
  )
}
