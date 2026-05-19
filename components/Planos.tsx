const inclusoesStart = [
  'Gestão financeira completa',
  'Assembleias (até 2 por ano)',
  'Comunicação com moradores',
  'Suporte via WhatsApp',
]

const inclusoesCustom = [
  'Tudo do plano Start',
  'Gestão de pessoal e folha',
  'Compliance e obrigações legais',
  'Relatórios mensais personalizados',
  'Assembleias ilimitadas',
]

function Check({ light = false }: { light?: boolean }) {
  return (
    <span
      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: light ? '#1B8FAD' : '#D6E8EF' }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2 2 4-4" stroke={light ? 'white' : '#0d6e8a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export default function Planos() {
  return (
    <section id="planos" className="py-24" style={{ backgroundColor: '#F8FAFB' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#0d6e8a' }}>Planos</p>
          <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#0A3244', letterSpacing: '-0.02em' }}>
            Escolha o plano ideal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Card Start */}
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: '#ffffff', border: '1px solid #D6E8EF', boxShadow: '0 4px 16px rgba(10,50,68,0.06)' }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8FA3AE' }}>
              Para pequenos condomínios
            </span>
            <h3 className="text-2xl font-bold mt-2 mb-1" style={{ color: '#0A3244' }}>Start</h3>
            <p className="font-bold text-lg" style={{ color: '#0d6e8a' }}>
              1 salário mínimo<span className="text-sm font-normal" style={{ color: '#8FA3AE' }}>/mês</span>
            </p>
            <p className="text-xs mb-6 mt-0.5" style={{ color: '#8FA3AE' }}>Até 30 unidades</p>

            <ul className="space-y-3 mb-8">
              {inclusoesStart.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#0F1923' }}>
                  <Check />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/5521971788414?text=Quero%20contratar%20o%20plano%20Start"
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center font-semibold py-3 rounded-xl transition-colors duration-150"
              style={{ backgroundColor: '#F0F5F7', color: '#0d475c' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D6E8EF')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F0F5F7')}
            >
              Contratar via WhatsApp
            </a>
          </div>

          {/* Card Sob Medida */}
          <div
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{ backgroundColor: '#0A3244', boxShadow: '0 4px 24px rgba(10,50,68,0.2)' }}
          >
            <span
              className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: '#1B8FAD' }}
            >
              Mais Popular
            </span>

            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#A8CDD9' }}>
              Para qualquer porte
            </span>
            <h3 className="text-2xl font-bold mt-2 mb-1 text-white">Sob Medida</h3>
            <p className="font-bold text-lg" style={{ color: '#1B8FAD' }}>Valor sob consulta</p>
            <p className="text-xs mb-6 mt-0.5" style={{ color: '#A8CDD9' }}>Plano personalizado</p>

            <ul className="space-y-3 mb-8">
              {inclusoesCustom.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#D6E8EF' }}>
                  <Check light />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/5521971788414?text=Quero%20solicitar%20uma%20proposta%20personalizada"
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center text-white font-semibold py-3 rounded-xl transition-colors duration-150"
              style={{ backgroundColor: '#1B8FAD' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0d6e8a')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B8FAD')}
            >
              Solicitar Proposta Personalizada
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
