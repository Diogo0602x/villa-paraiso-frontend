"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  dividasApi,
  type DividasFilters,
  type DividasPagasFilters,
  type DividasNaoPagasFilters,
  type DividasPendentesFilters,
  type DividasPorValorFilters,
} from "@/services/dividasApi"
import type { DividaEmpresaCreate, DividaEmpresaUpdate } from "@/types"

// Hooks de query (GET)
export function useDividas(filters?: DividasFilters) {
  return useQuery({
    queryKey: ["dividas", "list", filters || {}],
    queryFn: () => dividasApi.getAll(filters),
  })
}

export function useDivida(id: string) {
  return useQuery({
    queryKey: ["dividas", id],
    queryFn: () => dividasApi.getById(id),
    enabled: !!id,
  })
}

export function useResumoDividas() {
  return useQuery({
    queryKey: ["dividas", "resumo", "total"],
    queryFn: () => dividasApi.getResumoTotal(),
  })
}

export function useDividasPagas(filters?: DividasPagasFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: ["dividas", "pagas", filters || {}],
    queryFn: () => dividasApi.getPagas(filters),
    enabled,
  })
}

export function useDividasNaoPagas(filters?: DividasNaoPagasFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: ["dividas", "nao-pagas", filters || {}],
    queryFn: () => dividasApi.getNaoPagas(filters),
    enabled,
  })
}

export function useDividasPendentes(filters?: DividasPendentesFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: ["dividas", "pendentes", filters || {}],
    queryFn: () => dividasApi.getPendentes(filters),
    enabled,
  })
}

export function useDividasPorValor(filters?: DividasPorValorFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: ["dividas", "por-valor", filters || {}],
    queryFn: () => dividasApi.getPorValor(filters),
    enabled: enabled && !!filters && (!!filters.valor_minimo || !!filters.valor_maximo),
  })
}

// Hooks de mutação (POST, PUT, DELETE)
export function useCreateDivida() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DividaEmpresaCreate) => dividasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividas"] })
    },
  })
}

export function useUpdateDivida() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DividaEmpresaUpdate }) => dividasApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dividas"] })
      queryClient.invalidateQueries({ queryKey: ["dividas", variables.id] })
    },
  })
}

export function useDeleteDivida() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => dividasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividas"] })
    },
  })
}
