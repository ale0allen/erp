import '../styles/pages.css'

export function ConfiguracoesPage() {
  return (
    <div className="page-placeholder">
      <h2 className="page-placeholder__title">Configurações</h2>
      <p className="page-placeholder__lead">
        Preferências da empresa, usuários e integrações serão configuradas aqui.
      </p>
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
    </div>
  )
}
