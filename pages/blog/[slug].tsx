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
  conteudo: string
  imagem: string
  data: string
}

interface Props { post: Post }

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  const meses = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
  ]
  return `${dia} de ${meses[parseInt(mes) - 1]} de ${ano}`
}

export default function PostPage({ post }: Props) {
  return (
    <>
      <Head>
        <title>{post.titulo} — Baldas Hub</title>
        <meta name="description" content={post.resumo} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

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
          <article>
            <div className="mb-4">
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: '#F0F5F7', color: '#0d6e8a', border: '1px solid #A8CDD9' }}
              >
                Administração Condominial
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-3" style={{ color: '#0A3244' }}>
              {post.titulo}
            </h1>
            <p className="text-sm mb-8" style={{ color: '#4A6572' }}>{formatarData(post.data)}</p>

            {post.imagem && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.imagem} alt={post.titulo} className="w-full h-auto max-h-96 object-cover" />
              </div>
            )}

            {post.resumo && (
              <p
                className="text-lg leading-relaxed mb-8 p-6 rounded-2xl font-medium"
                style={{ backgroundColor: '#F0F5F7', color: '#0d475c', borderLeft: '4px solid #0d6e8a' }}
              >
                {post.resumo}
              </p>
            )}

            <div className="text-base leading-relaxed">
              {post.conteudo.split('\n').map((paragrafo, i) =>
                paragrafo.trim() === '' ? (
                  <div key={i} className="my-4" />
                ) : (
                  <p key={i} className="mb-4" style={{ color: '#4A6572' }}>{paragrafo}</p>
                )
              )}
            </div>

            <div className="my-10" style={{ borderTop: '1px solid #D6E8EF' }} />

            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#0A3244' }}>
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

            <div className="mt-8">
              <Link href="/blog" className="text-sm font-medium flex items-center gap-2" style={{ color: '#0d6e8a' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Todos os artigos
              </Link>
            </div>
          </article>
        </div>
      </main>

      <footer className="py-6 text-center text-sm" style={{ backgroundColor: '#0A3244', color: '#A8CDD9' }}>
        © {new Date().getFullYear()} Baldas Hub Condominial · Niterói/RJ
      </footer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const client = await getClient()
    const post = await client
      .db('baldashub')
      .collection('posts')
      .findOne({ slug: params?.slug as string, publicado: true })

    if (!post) return { notFound: true }

    return {
      props: { post: { ...post, _id: post._id.toString() } },
    }
  } catch {
    return { notFound: true }
  }
}
