export default function Hero() {
  return (
    <section className="pt-28 pb-20 lg:pt-36 lg:pb-28" style={{ backgroundColor: '#F8FAFB' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Coluna esquerda */}
          <div>
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6"
              style={{ backgroundColor: '#F0F5F7', color: '#0d6e8a', border: '1px solid #A8CDD9' }}
            >
              Administração Condominial em Niterói/RJ
            </span>

            <h1
              className="text-4xl lg:text-5xl font-bold leading-tight mb-6"
              style={{ color: '#0A3244', letterSpacing: '-0.025em' }}
            >
              O condomínio bem administrado começa com quem conhece Niterói.
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: '#4A6572' }}>
              Gestão financeira, jurídica e operacional com transparência total para síndicos e moradores.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href="https://wa.me/5521971788414?text=Quero%20solicitar%20uma%20proposta%20para%20meu%20condomínio"
                target="_blank"
                rel="noreferrer"
                className="text-white font-semibold px-6 py-3 rounded-xl text-center transition-colors duration-150"
                style={{ backgroundColor: '#0d6e8a' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0A3244')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0d6e8a')}
              >
                Solicitar Proposta
              </a>
              <a
                href="#planos"
                className="font-semibold px-6 py-3 rounded-xl text-center transition-colors duration-150"
                style={{ border: '1px solid #A8CDD9', color: '#0d475c' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0F5F7')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Ver Planos
              </a>
            </div>

            {/* Métricas */}
            <div className="flex gap-6" style={{ borderTop: '1px solid #D6E8EF', paddingTop: '1.5rem' }}>
              {[
                { valor: '1+', label: 'Condomínios' },
                { valor: 'Niterói', label: 'Região de atuação' },
                { valor: '2026', label: 'Desde' },
              ].map((m, i) => (
                <div key={i} className={i > 0 ? 'pl-6' : ''} style={i > 0 ? { borderLeft: '1px solid #D6E8EF' } : {}}>
                  <p className="font-bold text-2xl" style={{ color: '#0A3244' }}>{m.valor}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#4A6572' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna direita — card de diferenciais */}
          <div className="rounded-3xl p-8 text-white relative overflow-hidden" style={{ backgroundColor: '#0A3244' }}>
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-30"
              style={{ backgroundColor: '#0d475c', transform: 'translate(30%, -30%)' }}
            />
            <div className="relative">
              <p className="text-sm font-medium mb-6" style={{ color: '#A8CDD9' }}>Por que escolher a Baldas Hub?</p>
              <ul className="space-y-5">
                {[
                  { titulo: 'Transparência Total', desc: 'Prestação de contas mensal com acesso a todos os documentos' },
                  { titulo: 'Atendimento Ágil', desc: 'Respostas em até 24h úteis para síndicos e moradores' },
                  { titulo: 'Experiência Local', desc: 'Equipe especializada no mercado condominial de Niterói' },
                  { titulo: 'Conformidade Legal', desc: 'CNPJ, AVCB e todas as obrigações regulatórias em dia' },
                ].map((item) => (
                  <li key={item.titulo} className="flex gap-3 items-start">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: '#1B8FAD' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-semibold text-sm">{item.titulo}</p>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: '#A8CDD9' }}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
