"use client"

import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import { estatisticasApi } from "@/services/estatisticasApi"
import type { DividasFilters } from "@/services/estatisticasApi"

export function useEstatisticasGeral() {
  return useQuery({
    queryKey: queryKeys.estatisticas.geral,
    queryFn: () => estatisticasApi.getGeral(),
  })
}

export function useFaturamentoAnual(ano: number) {
  return useQuery({
    queryKey: queryKeys.estatisticas.faturamento(ano),
    queryFn: () => estatisticasApi.getFaturamento({ ano }),
  })
}

export function useFaturamentoMensal(ano: number, mes: number) {
  return useQuery({
    queryKey: queryKeys.estatisticas.faturamento(ano, mes),
    queryFn: () => estatisticasApi.getFaturamento({ ano, mes }),
    enabled: !!mes,
  })
}

export function useEstatisticasDividas(filters?: DividasFilters) {
  return useQuery({
    queryKey: queryKeys.estatisticas.dividas(filters || {}),
    queryFn: () => estatisticasApi.getDividas(filters),
  })
}
