import { api } from "./apiClient"
import type { Pagamento, CreatePagamentoInput, UpdatePagamentoInput, PaginatedResponse } from "@/types"

export interface PagamentosFilters {
  parcelaId?: number
  dataInicio?: string
  dataFim?: string
  page?: number
  limit?: number
}

export const pagamentosApi = {
  getAll: (filters?: PagamentosFilters) => {
    const params = new URLSearchParams()
    if (filters?.parcelaId) params.set("parcelaId", String(filters.parcelaId))
    if (filters?.dataInicio) params.set("dataInicio", filters.dataInicio)
    if (filters?.dataFim) params.set("dataFim", filters.dataFim)
    if (filters?.page) params.set("page", String(filters.page))
    if (filters?.limit) params.set("limit", String(filters.limit))

    const query = params.toString()
    return api.get<PaginatedResponse<Pagamento>>(`/pagamentos${query ? `?${query}` : ""}`)
  },

  getById: (id: number) => api.get<Pagamento>(`/pagamentos/${id}`),

  create: (data: CreatePagamentoInput) => api.post<Pagamento>("/pagamentos", data),

  update: (id: number, data: UpdatePagamentoInput) => api.patch<Pagamento>(`/pagamentos/${id}`, data),

  delete: (id: number) => api.delete<void>(`/pagamentos/${id}`),
}
