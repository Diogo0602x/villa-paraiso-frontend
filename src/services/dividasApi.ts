import { api } from "./apiClient"
import type { DividaEmpresa, DividaEmpresaCreate, DividaEmpresaUpdate, ResumoDividas } from "@/types"
import type { StatusDividaEmpresa } from "@/enums"

// Filtros baseados em API_FRONTEND.md
export interface DividasFilters {
  status?: StatusDividaEmpresa // Filtrar por status
  credor?: string // Busca parcial por credor (case-insensitive)
}

export interface DividasPagasFilters {
  credor?: string
}

export interface DividasNaoPagasFilters {
  credor?: string
}

export interface DividasPendentesFilters {
  credor?: string
}

export interface DividasPorValorFilters {
  valor_minimo?: number
  valor_maximo?: number
  credor?: string
  status?: StatusDividaEmpresa
}

// Serviço completo baseado em API_FRONTEND.md
export const dividasApi = {
  // GET endpoints
  getAll: (filters?: DividasFilters) => {
    const params = new URLSearchParams()
    if (filters?.status) params.set("status", filters.status)
    if (filters?.credor) params.set("credor", filters.credor)

    const query = params.toString()
    return api.get<DividaEmpresa[]>(`/api/dividas${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => api.get<DividaEmpresa>(`/api/dividas/${id}`),

  getResumoTotal: () => api.get<ResumoDividas>("/api/dividas/resumo/total"),

  getPagas: (filters?: DividasPagasFilters) => {
    const params = new URLSearchParams()
    if (filters?.credor) params.set("credor", filters.credor)
    const query = params.toString()
    return api.get<DividaEmpresa[]>(`/api/dividas/filtros/pagas${query ? `?${query}` : ""}`)
  },

  getNaoPagas: (filters?: DividasNaoPagasFilters) => {
    const params = new URLSearchParams()
    if (filters?.credor) params.set("credor", filters.credor)
    const query = params.toString()
    return api.get<DividaEmpresa[]>(`/api/dividas/filtros/nao-pagas${query ? `?${query}` : ""}`)
  },

  getPendentes: (filters?: DividasPendentesFilters) => {
    const params = new URLSearchParams()
    if (filters?.credor) params.set("credor", filters.credor)
    const query = params.toString()
    return api.get<DividaEmpresa[]>(`/api/dividas/filtros/pendentes${query ? `?${query}` : ""}`)
  },

  getPorValor: (filters?: DividasPorValorFilters) => {
    const params = new URLSearchParams()
    if (filters?.valor_minimo) params.set("valor_minimo", String(filters.valor_minimo))
    if (filters?.valor_maximo) params.set("valor_maximo", String(filters.valor_maximo))
    if (filters?.credor) params.set("credor", filters.credor)
    if (filters?.status) params.set("status", filters.status)
    const query = params.toString()
    return api.get<DividaEmpresa[]>(`/api/dividas/filtros/por-valor${query ? `?${query}` : ""}`)
  },

  // POST endpoints
  create: (data: DividaEmpresaCreate) => api.post<DividaEmpresa>("/api/dividas", data),

  // PUT endpoints
  update: (id: string, data: DividaEmpresaUpdate) => api.put<DividaEmpresa>(`/api/dividas/${id}`, data),

  // DELETE endpoints
  delete: (id: string) => api.delete<void>(`/api/dividas/${id}`),
}
