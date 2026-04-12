import { Link } from 'react-router-dom'

export function AccessDeniedPage() {
  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <section className="card" style={{ maxWidth: '32rem' }}>
          <h2 className="erp-page__title" style={{ fontSize: '1.25rem' }}>
            Acesso não autorizado
          </h2>
          <p className="status-message status-message--error" role="alert">
            Seu perfil não tem permissão para esta área. Se precisar de acesso, fale com um administrador.
          </p>
          <p style={{ margin: '1rem 0 0', color: '#64748b', fontSize: '0.9375rem' }}>
            <Link to="/">Voltar ao início</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
