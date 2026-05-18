import { useEffect, useState } from 'react'
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
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${dia} ${meses[parseInt(mes) - 1]} ${ano}`
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('baldas-blog-posts')
      const todos: Post[] = raw ? JSON.parse(raw) : []
      const publicados = todos
        .filter(p => p.publicado)
        .sort((a, b) => b.data.localeCompare(a.data))
      setPosts(publicados)
    } catch {
      setPosts([])
    }
    setCarregando(false)
  }, [])

  return (
    <>
      <Head>
        <title>Blog — Baldas Hub Condominial</title>
        <meta name="description" content="Artigos e novidades sobre administração condominial em Niterói/RJ." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpeg" alt="Baldas Hub" width={36} height={36} className="rounded-md" />
              <span className="font-bold text-lg" style={{ color: '#0A3244' }}>Baldas Hub Condominial</span>
            </Link>
            <Link
              href="/"
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: '#4A6572' }}
            >
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 min-h-screen" style={{ backgroundColor: '#F8FAFB' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Cabeçalho da seção */}
          <div className="mb-12 text-center">
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: '#F0F5F7', color: '#0d6e8a', border: '1px solid #A8CDD9' }}
            >
              Nosso Blog
            </span>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#0A3244' }}>
              Artigos e Novidades
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#4A6572' }}>
              Dicas, notícias e informações sobre administração condominial em Niterói.
            </p>
          </div>

          {/* Estado de carregamento */}
          {carregando && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse bg-white shadow-sm">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-3 w-1/3" />
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-1" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sem posts */}
          {!carregando && posts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#0A3244' }}>Nenhum artigo ainda</h2>
              <p style={{ color: '#4A6572' }}>Em breve publicaremos novidades. Volte em breve!</p>
            </div>
          )}

          {/* Grid de posts */}
          {!carregando && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article
                    className="rounded-2xl overflow-hidden shadow-sm transition-shadow duration-200 group-hover:shadow-md h-full flex flex-col"
                    style={{ backgroundColor: '#fff' }}
                  >
                    {/* Imagem */}
                    {post.imagem ? (
                      <div className="relative h-48 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.imagem}
                          alt={post.titulo}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center" style={{ backgroundColor: '#F0F5F7' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A8CDD9" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18M9 21V9" />
                        </svg>
                      </div>
                    )}

                    {/* Conteúdo */}
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs font-medium mb-2" style={{ color: '#0d6e8a' }}>
                        {formatarData(post.data)}
                      </p>
                      <h2
                        className="font-bold text-lg mb-2 leading-snug group-hover:transition-colors"
                        style={{ color: '#0A3244' }}
                      >
                        {post.titulo}
                      </h2>
                      {post.resumo && (
                        <p className="text-sm leading-relaxed flex-1" style={{ color: '#4A6572' }}>
                          {post.resumo}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: '#0d6e8a' }}>
                        Ler mais
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer simples */}
      <footer className="py-6 text-center text-sm" style={{ backgroundColor: '#0A3244', color: '#A8CDD9' }}>
        © {new Date().getFullYear()} Baldas Hub Condominial · Niterói/RJ
      </footer>
    </>
  )
}
