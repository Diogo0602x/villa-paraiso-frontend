import { api } from "./apiClient"
import type { Lote, LoteCreate, LoteUpdate, LoteVenda, ResumoLotesStatus, StatusLote } from "@/types"

// Filtros baseados em API_FRONTEND.md
export interface LotesFilters {
  setor_id?: string // UUID do setor
  setor_slug?: string // Slug do setor
  numero?: string // Busca parcial por número
  status?: StatusLote // Filtrar por status
  tem_acesso_agua?: boolean // Filtrar por acesso à água
  frente_br060?: boolean // Filtrar por frente BR-060
}

export interface LotesVendidosFilters {
  setor_id?: string
  setor_slug?: string
}

export interface LotesDisponiveisFilters {
  setor_id?: string
  setor_slug?: string
  tem_acesso_agua?: boolean
  frente_br060?: boolean
}

// Serviço completo baseado em API_FRONTEND.md
export const lotesApi = {
  // GET endpoints
  getAll: (filters?: LotesFilters) => {
    const params = new URLSearchParams()
    if (filters?.setor_id) params.set("setor_id", filters.setor_id)
    if (filters?.setor_slug) params.set("setor_slug", filters.setor_slug)
    if (filters?.numero) params.set("numero", filters.numero)
    if (filters?.status) params.set("status", filters.status)
    if (filters?.tem_acesso_agua !== undefined) {
      params.set("tem_acesso_agua", String(filters.tem_acesso_agua))
    }
    if (filters?.frente_br060 !== undefined) {
      params.set("frente_br060", String(filters.frente_br060))
    }

    const query = params.toString()
    return api.get<Lote[]>(`/api/lotes${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => api.get<Lote>(`/api/lotes/${id}`), // Aceita UUID ou número

  getResumoStatus: () => api.get<ResumoLotesStatus>("/api/lotes/resumo/status"),

  getVendidos: (filters?: LotesVendidosFilters) => {
    const params = new URLSearchParams()
    if (filters?.setor_id) params.set("setor_id", filters.setor_id)
    if (filters?.setor_slug) params.set("setor_slug", filters.setor_slug)
    const query = params.toString()
    return api.get<Lote[]>(`/api/lotes/filtros/vendidos${query ? `?${query}` : ""}`)
  },

  getDisponiveis: (filters?: LotesDisponiveisFilters) => {
    const params = new URLSearchParams()
    if (filters?.setor_id) params.set("setor_id", filters.setor_id)
    if (filters?.setor_slug) params.set("setor_slug", filters.setor_slug)
    if (filters?.tem_acesso_agua !== undefined) {
      params.set("tem_acesso_agua", String(filters.tem_acesso_agua))
    }
    if (filters?.frente_br060 !== undefined) {
      params.set("frente_br060", String(filters.frente_br060))
    }
    const query = params.toString()
    return api.get<Lote[]>(`/api/lotes/filtros/disponiveis${query ? `?${query}` : ""}`)
  },

  // POST endpoints
  create: (data: LoteCreate) => api.post<Lote>("/api/lotes", data),

  registrarVenda: (id: string, data: LoteVenda) => api.post<Lote>(`/api/lotes/${id}/venda`, data),

  // PUT endpoints
  update: (id: string, data: LoteUpdate) => api.put<Lote>(`/api/lotes/${id}`, data),

  // DELETE endpoints
  delete: (id: string) => api.delete<void>(`/api/lotes/${id}`),
}
