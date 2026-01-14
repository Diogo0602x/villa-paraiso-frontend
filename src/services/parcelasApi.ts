import { api } from "./apiClient"
import type { Parcela, UpdateParcelaInput, PaginatedResponse } from "@/types"

export interface ParcelasFilters {
  vendaId?: number
  status?: string
  dataVencimentoInicio?: string
  dataVencimentoFim?: string
  page?: number
  limit?: number
}

export const parcelasApi = {
  getAll: (filters?: ParcelasFilters) => {
    const params = new URLSearchParams()
    if (filters?.vendaId) params.set("vendaId", String(filters.vendaId))
    if (filters?.status) params.set("status", filters.status)
    if (filters?.dataVencimentoInicio) params.set("dataVencimentoInicio", filters.dataVencimentoInicio)
    if (filters?.dataVencimentoFim) params.set("dataVencimentoFim", filters.dataVencimentoFim)
    if (filters?.page) params.set("page", String(filters.page))
    if (filters?.limit) params.set("limit", String(filters.limit))

    const query = params.toString()
    return api.get<PaginatedResponse<Parcela>>(`/parcelas${query ? `?${query}` : ""}`)
  },

  getById: (id: number) => api.get<Parcela>(`/parcelas/${id}`),

  update: (id: number, data: UpdateParcelaInput) => api.patch<Parcela>(`/parcelas/${id}`, data),
}
