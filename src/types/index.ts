// Core entity types based on API_FRONTEND.md

// Import enums for use in types
import type { StatusLote, StatusParcela, FormaPagamento, StatusDividaEmpresa } from "@/enums"

// Setor baseado em API_FRONTEND.md
export interface Setor {
  id: string // UUID
  nome: string
  slug: string
  total_lotes: number
  lotes_com_agua: number
  cor: string | null
  observacoes: string | null
  caminho_pasta: string | null
}

// Lote baseado em API_FRONTEND.md
export interface Lote {
  id: string // UUID
  numero: string
  setor_id: string // UUID
  status: StatusLote
  tem_acesso_agua: boolean
  frente_br060: boolean
  area: number | null
  observacoes: string | null
  // Campos de venda (estruturados)
  comprador: string | null
  valor_total_venda: number | null
  entrada_venda: number | null
  parcelamento_venda: string | null
  observacoes_venda: string | null
  // Relacionamento (sempre incluído)
  setor: Setor | null
}

export interface LoteCreate {
  numero: string
  setor_id: string
  status?: StatusLote // Padrão: DISPONIVEL
  tem_acesso_agua?: boolean // Padrão: false
  frente_br060?: boolean // Padrão: false
  area?: number | null
  observacoes?: string | null
}

export interface LoteUpdate {
  numero?: string
  setor_id?: string
  status?: StatusLote
  tem_acesso_agua?: boolean
  frente_br060?: boolean
  area?: number | null
  observacoes?: string | null
}

export interface LoteVenda {
  comprador: string
  valor_total: number
  forma_pagamento: string
  entrada?: number
  parcelamento?: string
  observacoes_venda?: string | null
}

// Venda baseada em Lote vendido
// Uma venda é um lote com status VENDIDO que contém informações da venda em campos estruturados
export interface Venda {
  id: string // ID do lote (UUID)
  lote_id: string // ID do lote (UUID) - mesmo que id
  numero: string // Número do lote
  setor_id: string
  setor: Setor | null // Sempre incluído
  status: StatusLote // Sempre VENDIDO
  tem_acesso_agua: boolean
  frente_br060: boolean
  area: number | null
  observacoes: string | null // Observações gerais do lote
  
  // Campos estruturados de venda (sempre presentes, podem ser null)
  comprador: string | null
  valor_total_venda: number | null
  entrada_venda: number | null
  parcelamento_venda: string | null
  observacoes_venda: string | null
  
  // Aliases para compatibilidade (mapeiam para campos estruturados)
  valor_total?: number // Alias para valor_total_venda
  entrada?: number // Alias para entrada_venda
  parcelamento?: string // Alias para parcelamento_venda
  forma_pagamento?: string // Pode ser extraído de parcelamento_venda ou observacoes_venda
}

export interface VendaCreate extends LoteVenda {
  lote_id: string // ID do lote a ser vendido
}

export interface VendaUpdate {
  comprador?: string
  valor_total?: number
  forma_pagamento?: string
  entrada?: number
  parcelamento?: string
  observacoes_venda?: string | null
}

export interface GetVendasParams {
  setor_id?: string
  setor_slug?: string
  numero?: string
}

// DividaEmpresa baseado em API_FRONTEND.md
export interface DividaEmpresa {
  id: string // UUID
  descricao: string
  credor: string
  valor_total: number // Decimal convertido para number
  valor_pago: number // Decimal convertido para number
  data_pagamento: string | null // ISO date string (YYYY-MM-DD)
  status: StatusDividaEmpresa
  observacoes: string | null
}

export interface DividaEmpresaCreate {
  descricao: string
  credor: string
  valor_total: number
  valor_pago?: number // Padrão: 0.00
  data_pagamento?: string | null // YYYY-MM-DD
  status?: StatusDividaEmpresa // Padrão: PENDENTE (determinado automaticamente)
  observacoes?: string | null
}

export interface DividaEmpresaUpdate {
  descricao?: string
  credor?: string
  valor_total?: number
  valor_pago?: number
  data_pagamento?: string | null // YYYY-MM-DD
  status?: StatusDividaEmpresa
  observacoes?: string | null
}

// ResumoLotesStatus baseado em API_FRONTEND.md
export interface ResumoLotesStatus {
  total: number
  disponiveis: number
  reservados: number
  vendidos: number
  indisponiveis: number
}

// ResumoDividas baseado em API_FRONTEND.md
export interface ResumoDividas {
  valor_total: number
  valor_pago: number
  valor_a_pagar: number
  total_dividas: number
  dividas_pendentes: number
  dividas_parciais: number
  dividas_pagas: number
  percentual_pago: number
}

// ResumoGeral baseado em API_FRONTEND.md
export interface ResumoGeral {
  lotes: {
    total: number
    disponiveis: number
    vendidos: number
    com_agua: number
    percentual_vendido: number
  }
  setores: {
    total: number
  }
  dividas: {
    valor_total: number
    valor_pago: number
    valor_a_pagar: number
    total_dividas: number
  }
}

// Health Check baseado em API_FRONTEND.md
export interface HealthCheck {
  message: string
  status: "ok"
}

export interface HealthCheckDetailed {
  status: "healthy"
  app: string
  version: string
}

// API Error
export interface ApiError {
  statusCode: number
  message: string | string[]
  error: string
}

// Pagination (mantido para compatibilidade, mas não usado na API atual)
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Coordenadas para mapas (mantido para compatibilidade com mapas)
export interface Coordenadas {
  type: "Polygon" | "Point" | "LineString" | "GeometryCollection"
  coordinates: number[][] | number[][][] | []
}

// GeoJSON Types (mantido para compatibilidade com mapas)
export interface GeoJsonFeature {
  type: "Feature"
  id?: string
  geometry: Coordenadas
  properties: {
    loteId: string
    numero: string
    setor: {
      id: string
      nome: string
      slug: string
      cor?: string
    }
    status: StatusLote
    temAcessoAgua: boolean
    frenteBR060: boolean
    area?: number | null
    compradorNome?: string
    valorTotal?: number
    cor?: string
  }
}

export interface GeoJsonCollection {
  type: "FeatureCollection"
  features: GeoJsonFeature[]
}
