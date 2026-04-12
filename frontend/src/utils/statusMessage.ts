export function getStatusMessageClass(mensagem: string): string {
  if (/Carregando|Salvando|Atualizando|Excluindo|Criando/.test(mensagem)) {
    return 'status-message status-message--loading'
  }
  if (mensagem.includes('sucesso')) {
    return 'status-message status-message--success'
  }
  return 'status-message status-message--error'
}
