"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import { vendasApi, type VendasFilters } from "@/services/vendasApi"
import type { CreateVendaInput, UpdateVendaInput } from "@/types"

export function useVendas(filters?: VendasFilters) {
  return useQuery({
    queryKey: queryKeys.vendas.list(filters || {}),
    queryFn: () => vendasApi.getAll(filters),
  })
}

export function useVenda(id: number) {
  return useQuery({
    queryKey: queryKeys.vendas.byId(id),
    queryFn: () => vendasApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateVenda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateVendaInput) => vendasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendas.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.lotes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.estatisticas.geral })
    },
  })
}

export function useUpdateVenda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVendaInput }) => vendasApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendas.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.vendas.byId(variables.id) })
    },
  })
}

export function useDeleteVenda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => vendasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendas.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.lotes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.estatisticas.geral })
    },
  })
}
