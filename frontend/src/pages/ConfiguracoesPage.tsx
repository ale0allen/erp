import '../styles/pages.css'

/**
 * Mesmo padrão das outras telas admin (ex.: Usuários): `erp-page` aplica cor de texto
 * explícita. Só `page-placeholder` herdava o `color` de `:root` (claro no tema escuro do SO),
 * o que podia deixar o texto quase invisível sobre o fundo claro do shell.
 */
export function ConfiguracoesPage() {
  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Configurações</h2>
        <p className="page-placeholder__lead" style={{ marginTop: 0 }}>
          Preferências da empresa, usuários e integrações serão configuradas aqui.
        </p>

        <section className="card" aria-labelledby="config-blocos-heading">
          <h3 id="config-blocos-heading" className="card__title">
            Visão geral
          </h3>
          <div className="page-placeholder__grid">
            <div className="page-placeholder__card">
              <span className="page-placeholder__card-label">Empresa</span>
              <p className="page-placeholder__card-text">
                Dados cadastrais e parâmetros gerais.
              </p>
            </div>
            <div className="page-placeholder__card">
              <span className="page-placeholder__card-label">Usuários</span>
              <p className="page-placeholder__card-text">
                Perfis e permissões de acesso.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
