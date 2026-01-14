import { api } from "./apiClient"
import type { EstatisticasGeral, FaturamentoMensal, EstatisticasDividas } from "@/types"

export interface FaturamentoFilters {
  ano: number
  mes?: number
}

export interface DividasFilters {
  incluirEmpresa?: boolean
  setorSlug?: string
  diasAtrasoMin?: number
}

export const estatisticasApi = {
  getGeral: () => api.get<EstatisticasGeral>("/estatisticas/geral"),

  getFaturamento: (filters: FaturamentoFilters) => {
    const params = new URLSearchParams()
    params.set("ano", String(filters.ano))
    if (filters.mes) params.set("mes", String(filters.mes))

    return api.get<FaturamentoMensal[]>(`/estatisticas/faturamento?${params.toString()}`)
  },

  getDividas: (filters?: DividasFilters) => {
    const params = new URLSearchParams()
    if (filters?.incluirEmpresa) params.set("incluirEmpresa", "true")
    if (filters?.setorSlug) params.set("setorSlug", filters.setorSlug)
    if (filters?.diasAtrasoMin) params.set("diasAtrasoMin", String(filters.diasAtrasoMin))

    const query = params.toString()
    return api.get<EstatisticasDividas>(`/estatisticas/dividas${query ? `?${query}` : ""}`)
  },
}
