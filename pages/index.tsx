import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Servicos from '../components/Servicos'
import Planos from '../components/Planos'
import Mapa from '../components/Mapa'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Baldas Hub Condominial — Administração em Niterói/RJ</title>
        <meta name="description" content="Gestão profissional de condomínios em Niterói e região. Administração financeira, jurídica e operacional com transparência total." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <Hero />
        <Servicos />
        <Planos />
        <Mapa />
      </main>
      <Footer />
    </>
  )
}
