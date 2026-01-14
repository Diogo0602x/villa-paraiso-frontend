import { api } from "./apiClient"
import type { DividaEmpresa, CreateDividaEmpresaInput, UpdateDividaEmpresaInput, PagamentoDividaInput } from "@/types"

export const dividasEmpresaApi = {
  getAll: () => api.get<DividaEmpresa[]>("/dividas-empresa"),

  getAtivas: () => api.get<DividaEmpresa[]>("/dividas-empresa/ativas"),

  getTotal: () => api.get<{ total: number }>("/dividas-empresa/total"),

  getById: (id: number) => api.get<DividaEmpresa>(`/dividas-empresa/${id}`),

  create: (data: CreateDividaEmpresaInput) => api.post<DividaEmpresa>("/dividas-empresa", data),

  update: (id: number, data: UpdateDividaEmpresaInput) => api.patch<DividaEmpresa>(`/dividas-empresa/${id}`, data),

  registrarPagamento: (id: number, data: PagamentoDividaInput) =>
    api.put<DividaEmpresa>(`/dividas-empresa/${id}/pagamento`, data),

  delete: (id: number) => api.delete<void>(`/dividas-empresa/${id}`),
}
