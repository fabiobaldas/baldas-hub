const servicos = [
  { num: '01', titulo: 'Gestão Financeira', desc: 'Prestação de contas mensal, controle de inadimplência e fundo de reserva.' },
  { num: '02', titulo: 'Assembleias e Atas', desc: 'Convocação, condução de reuniões e elaboração de atas com validade legal.' },
  { num: '03', titulo: 'Manutenção Predial', desc: 'Contratos com fornecedores, orçamentos comparativos e acompanhamento de obras.' },
  { num: '04', titulo: 'Gestão de Pessoal', desc: 'Folha de pagamento, férias, encargos sociais e gestão de porteiros e zeladores.' },
  { num: '05', titulo: 'Compliance Legal', desc: 'CNPJ do condomínio, AVCB, regulamento interno e atendimento a fiscalizações.' },
  { num: '06', titulo: 'Comunicação Transparente', desc: 'Canal direto com moradores, portal de documentos e respostas em até 24h úteis.' },
]

export default function Servicos() {
  return (
    <section id="servicos" className="py-24" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#0d6e8a' }}>
            O que fazemos
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold max-w-xl" style={{ color: '#0A3244', letterSpacing: '-0.02em' }}>
            Serviços completos para o seu condomínio
          </h2>
        </div>

        <div style={{ borderTop: '1px solid #F0F5F7' }}>
          {servicos.map((s) => (
            <div
              key={s.num}
              className="flex gap-6 lg:gap-10 py-8 group cursor-default"
              style={{ borderBottom: '1px solid #F0F5F7' }}
            >
              <span
                className="font-bold leading-none shrink-0 select-none transition-colors duration-300"
                style={{
                  fontSize: '64px',
                  color: '#D6E8EF',
                  width: '80px',
                  lineHeight: 1,
                }}
              >
                {s.num}
              </span>
              <div style={{ paddingTop: '8px' }}>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#0A3244' }}>{s.titulo}</h3>
                <p className="leading-relaxed max-w-2xl" style={{ color: '#4A6572' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
