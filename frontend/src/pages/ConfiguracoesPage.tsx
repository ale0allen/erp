import { useCallback, useEffect, useState } from 'react'

import { AuditoriaMeta } from '../components/AuditoriaMeta'
import {
  atualizarConfiguracaoSistema,
  fetchConfiguracaoSistema
} from '../modules/configuracao/configuracaoSistemaService'
import type {
  ConfiguracaoSistema,
  ConfiguracaoSistemaPayload
} from '../modules/configuracao/configuracaoSistema.types'
import { getStatusMessageClass } from '../utils/statusMessage'

const TIMEZONE_SUGESTOES = [
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Fortaleza',
  'America/Belem',
  'America/Cuiaba',
  'America/Rio_Branco',
  'UTC'
]

function aplicarNaTela(data: ConfiguracaoSistema) {
  return {
    companyName: data.companyName ?? '',
    tradeName: data.tradeName ?? '',
    companyEmail: data.companyEmail ?? '',
    companyPhone: data.companyPhone ?? '',
    currencyCode: data.currencyCode ?? 'BRL',
    timezone: data.timezone ?? 'America/Sao_Paulo',
    defaultPageSize: String(data.defaultPageSize ?? 20),
    lowStockDefaultThreshold: String(data.lowStockDefaultThreshold ?? 0),
    additionalInfo: data.additionalInfo ?? ''
  }
}

export function ConfiguracoesPage() {
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const [companyName, setCompanyName] = useState('')
  const [tradeName, setTradeName] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [currencyCode, setCurrencyCode] = useState('BRL')
  const [timezone, setTimezone] = useState('America/Sao_Paulo')
  const [defaultPageSize, setDefaultPageSize] = useState('20')
  const [lowStockDefaultThreshold, setLowStockDefaultThreshold] = useState('0')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [auditoria, setAuditoria] = useState<ConfiguracaoSistema['auditoria']>(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    setMensagem('')
    try {
      const data = await fetchConfiguracaoSistema()
      const f = aplicarNaTela(data)
      setCompanyName(f.companyName)
      setTradeName(f.tradeName)
      setCompanyEmail(f.companyEmail)
      setCompanyPhone(f.companyPhone)
      setCurrencyCode(f.currencyCode)
      setTimezone(f.timezone)
      setDefaultPageSize(f.defaultPageSize)
      setLowStockDefaultThreshold(f.lowStockDefaultThreshold)
      setAdditionalInfo(f.additionalInfo)
      setAuditoria(data.auditoria ?? null)
    } catch (e) {
      console.error(e)
      setMensagem(`Erro ao carregar configurações: ${String(e)}`)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    void carregar()
  }, [carregar])

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')

    if (!companyName.trim()) {
      setMensagem('Informe a razão social (nome da empresa).')
      return
    }
    if (!currencyCode.trim()) {
      setMensagem('Informe o código da moeda.')
      return
    }
    if (!timezone.trim()) {
      setMensagem('Informe o fuso horário.')
      return
    }

    const ps = Number.parseInt(defaultPageSize, 10)
    const ls = Number.parseInt(lowStockDefaultThreshold, 10)
    if (!Number.isFinite(ps) || ps < 1) {
      setMensagem('Tamanho padrão de página deve ser um número maior que zero.')
      return
    }
    if (!Number.isFinite(ls) || ls < 0) {
      setMensagem('Limite de estoque baixo deve ser um número maior ou igual a zero.')
      return
    }
    const emailTrim = companyEmail.trim()
    if (emailTrim !== '') {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)
      if (!ok) {
        setMensagem('E-mail da empresa inválido.')
        return
      }
    }

    const payload: ConfiguracaoSistemaPayload = {
      companyName: companyName.trim(),
      tradeName: tradeName.trim() === '' ? null : tradeName.trim(),
      companyEmail: emailTrim === '' ? null : emailTrim,
      companyPhone: companyPhone.trim() === '' ? null : companyPhone.trim(),
      currencyCode: currencyCode.trim(),
      timezone: timezone.trim(),
      defaultPageSize: ps,
      lowStockDefaultThreshold: ls,
      additionalInfo: additionalInfo.trim() === '' ? null : additionalInfo.trim()
    }

    setSalvando(true)
    try {
      const data = await atualizarConfiguracaoSistema(payload)
      const f = aplicarNaTela(data)
      setCompanyName(f.companyName)
      setTradeName(f.tradeName)
      setCompanyEmail(f.companyEmail)
      setCompanyPhone(f.companyPhone)
      setCurrencyCode(f.currencyCode)
      setTimezone(f.timezone)
      setDefaultPageSize(f.defaultPageSize)
      setLowStockDefaultThreshold(f.lowStockDefaultThreshold)
      setAdditionalInfo(f.additionalInfo)
      setAuditoria(data.auditoria ?? null)
      setMensagem('Configurações salvas com sucesso.')
    } catch (err) {
      console.error(err)
      setMensagem(`Erro ao salvar: ${String(err)}`)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="erp-page">
      <div className="erp-page__container">
        <h2 className="erp-page__title">Configurações do sistema</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.5 }}>
          Parâmetros globais da empresa e do aplicativo. Somente administradores podem alterar.
        </p>

        {mensagem ? (
          <p className={getStatusMessageClass(mensagem)} role="status">
            {mensagem}
          </p>
        ) : null}

        {carregando ? (
          <p className="status-message status-message--loading" role="status">
            Carregando configurações…
          </p>
        ) : (
          <section className="card" aria-labelledby="config-form-heading">
            <h3 id="config-form-heading" className="card__title">
              Dados e parâmetros
            </h3>

            {auditoria != null ? (
              <AuditoriaMeta auditoria={auditoria} titulo="Auditoria das configurações" />
            ) : null}

            <form className="produto-form" onSubmit={salvar}>
              <div className="form-field">
                <label className="form-label" htmlFor="cfg-razao">
                  Razão social (nome da empresa) <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cfg-razao"
                  className="form-input"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  autoComplete="organization"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cfg-fantasia">
                  Nome fantasia
                </label>
                <input
                  id="cfg-fantasia"
                  className="form-input"
                  value={tradeName}
                  onChange={e => setTradeName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cfg-email">
                  E-mail da empresa
                </label>
                <input
                  id="cfg-email"
                  className="form-input"
                  type="email"
                  value={companyEmail}
                  onChange={e => setCompanyEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cfg-fone">
                  Telefone
                </label>
                <input
                  id="cfg-fone"
                  className="form-input"
                  value={companyPhone}
                  onChange={e => setCompanyPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cfg-moeda">
                  Código da moeda <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cfg-moeda"
                  className="form-input"
                  value={currencyCode}
                  onChange={e => setCurrencyCode(e.target.value)}
                  maxLength={10}
                  placeholder="BRL"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cfg-tz">
                  Fuso horário (IANA) <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cfg-tz"
                  className="form-input"
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  list="cfg-tz-sugestoes"
                  placeholder="America/Sao_Paulo"
                  required
                />
                <datalist id="cfg-tz-sugestoes">
                  {TIMEZONE_SUGESTOES.map(z => (
                    <option key={z} value={z} />
                  ))}
                </datalist>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cfg-page-size">
                  Tamanho padrão de listas (paginação) <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cfg-page-size"
                  className="form-input"
                  type="number"
                  min={1}
                  max={500}
                  value={defaultPageSize}
                  onChange={e => setDefaultPageSize(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cfg-estoque">
                  Limite padrão de estoque baixo (unidades) <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cfg-estoque"
                  className="form-input"
                  type="number"
                  min={0}
                  value={lowStockDefaultThreshold}
                  onChange={e => setLowStockDefaultThreshold(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="cfg-obs">
                  Observações / informações adicionais
                </label>
                <textarea
                  id="cfg-obs"
                  className="form-input"
                  rows={4}
                  value={additionalInfo}
                  onChange={e => setAdditionalInfo(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn--primary" disabled={salvando}>
                  {salvando ? 'Salvando…' : 'Salvar configurações'}
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  disabled={carregando || salvando}
                  onClick={() => void carregar()}
                >
                  Recarregar
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}
