// Tipos de Usuário e Autenticação
export type UserRole = 'admin' | 'gestor' | 'operador' | 'compliance'

export interface User {
  id: string
  email: string
  nome: string
  role: UserRole
  filial_id?: string
  created_at: string
  updated_at: string
}

// Tipos de Filial
export interface Filial {
  id: string
  nome: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  telefone: string
  email: string
  created_at: string
  updated_at: string
}

// Tipos de Produto
export interface Produto {
  id: string
  nome: string
  tipo: 'credito_consignado' | 'antecipacao_fgts' | 'outros'
  taxa_minima: number
  taxa_maxima: number
  prazo_minimo: number
  prazo_maximo: number
  valor_minimo: number
  valor_maximo: number
  percentual_comissao: number
  ativo: boolean
  created_at: string
  updated_at: string
}

// Tipos de Cliente
export interface Cliente {
  id: string
  cpf: string
  nome: string
  email: string
  telefone: string
  data_nascimento: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  margem_consignavel: number
  consentimento_lgpd: boolean
  created_at: string
  updated_at: string
}

// Tipos de Simulação
export interface Simulacao {
  id: string
  cliente_id: string
  produto_id: string
  valor_solicitado: number
  prazo: number
  taxa: number
  valor_parcela: number
  cet: number
  operador_id: string
  created_at: string
}

// Tipos de Proposta
export interface Proposta {
  id: string
  cliente_id: string
  produto_id: string
  simulacao_id: string
  valor_solicitado: number
  prazo: number
  taxa: number
  valor_parcela: number
  cet: number
  status: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada'
  operador_id: string
  gestor_id?: string
  compliance_id?: string
  data_aprovacao?: string
  data_rejeicao?: string
  motivo_rejeicao?: string
  comissao_calculada: number
  created_at: string
  updated_at: string
}

// Tipos de Documento
export interface Documento {
  id: string
  proposta_id: string
  tipo: 'cpf' | 'rg' | 'comprovante_residencia' | 'holerite' | 'extrato_banco' | 'outros'
  nome_arquivo: string
  url_arquivo: string
  tamanho: number
  mime_type: string
  uploaded_by: string
  created_at: string
}

// Tipos de Meta
export interface Meta {
  id: string
  filial_id: string
  produto_id: string
  mes: number
  ano: number
  meta_valor: number
  meta_quantidade: number
  valor_atingido: number
  quantidade_atingida: number
  created_at: string
  updated_at: string
}

// Tipos de Auditoria
export interface Auditoria {
  id: string
  usuario_id: string
  acao: string
  tabela: string
  registro_id: string
  dados_anteriores?: Record<string, unknown>
  dados_novos?: Record<string, unknown>
  ip_address: string
  user_agent: string
  created_at: string
}

// Tipos de Comissão
export interface Comissao {
  id: string
  proposta_id: string
  operador_id: string
  valor: number
  percentual: number
  status: 'pendente' | 'paga' | 'cancelada'
  data_pagamento?: string
  created_at: string
  updated_at: string
}

// Tipos de Dashboard
export interface DashboardData {
  total_propostas: number
  propostas_pendentes: number
  propostas_aprovadas: number
  propostas_rejeitadas: number
  valor_total: number
  ticket_medio: number
  tempo_medio_analise: number
  percentual_aprovacao: number
  metas_atingidas: Meta[]
  evolucao_mensal: {
    mes: string
    valor: number
    quantidade: number
  }[]
}
