import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import getClient from '../../lib/mongodb'

interface Post {
  _id: string
  slug: string
  titulo: string
  resumo: string
  imagem: string
  data: string
}

interface Props { posts: Post[] }

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${dia} ${meses[parseInt(mes) - 1]} ${ano}`
}

export default function BlogIndex({ posts }: Props) {
  return (
    <>
      <Head>
        <title>Blog — Baldas Hub Condominial</title>
        <meta name="description" content="Artigos e novidades sobre administração condominial em Niterói/RJ." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpeg" alt="Baldas Hub" width={36} height={36} className="rounded-md" />
              <span className="font-bold text-lg" style={{ color: '#0A3244' }}>Baldas Hub Condominial</span>
            </Link>
            <Link href="/" className="text-sm font-medium" style={{ color: '#4A6572' }}>
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 min-h-screen" style={{ backgroundColor: '#F8FAFB' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: '#F0F5F7', color: '#0d6e8a', border: '1px solid #A8CDD9' }}
            >
              Nosso Blog
            </span>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#0A3244' }}>Artigos e Novidades</h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#4A6572' }}>
              Dicas, notícias e informações sobre administração condominial em Niterói.
            </p>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#0A3244' }}>Nenhum artigo ainda</h2>
              <p style={{ color: '#4A6572' }}>Em breve publicaremos novidades. Volte em breve!</p>
            </div>
          )}

          {posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="group block">
                  <article
                    className="rounded-2xl overflow-hidden shadow-sm transition-shadow duration-200 group-hover:shadow-md h-full flex flex-col"
                    style={{ backgroundColor: '#fff' }}
                  >
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
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs font-medium mb-2" style={{ color: '#0d6e8a' }}>
                        {formatarData(post.data)}
                      </p>
                      <h2 className="font-bold text-lg mb-2 leading-snug" style={{ color: '#0A3244' }}>
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

      <footer className="py-6 text-center text-sm" style={{ backgroundColor: '#0A3244', color: '#A8CDD9' }}>
        © {new Date().getFullYear()} Baldas Hub Condominial · Niterói/RJ
      </footer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const client = await getClient()
    const posts = await client
      .db('baldashub')
      .collection('posts')
      .find({ publicado: true })
      .sort({ data: -1 })
      .project({ conteudo: 0 })
      .toArray()

    return {
      props: {
        posts: posts.map(p => ({ ...p, _id: p._id.toString() })),
      },
    }
  } catch {
    return { props: { posts: [] } }
  }
}
