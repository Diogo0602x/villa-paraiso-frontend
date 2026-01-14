"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import { pagamentosApi, type PagamentosFilters } from "@/services/pagamentosApi"
import type { CreatePagamentoInput, UpdatePagamentoInput } from "@/types"

export function usePagamentos(filters?: PagamentosFilters) {
  return useQuery({
    queryKey: queryKeys.pagamentos.list(filters),
    queryFn: () => pagamentosApi.getAll(filters),
  })
}

export function usePagamento(id: number) {
  return useQuery({
    queryKey: queryKeys.pagamentos.byId(id),
    queryFn: () => pagamentosApi.getById(id),
    enabled: !!id,
  })
}

export function useCreatePagamento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePagamentoInput) => pagamentosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pagamentos.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.parcelas.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.vendas.all })
    },
  })
}

export function useUpdatePagamento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePagamentoInput }) =>
      pagamentosApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pagamentos.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.pagamentos.byId(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.parcelas.all })
    },
  })
}

export function useDeletePagamento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => pagamentosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pagamentos.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.parcelas.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.vendas.all })
    },
  })
}
