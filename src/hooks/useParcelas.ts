"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import { parcelasApi, type ParcelasFilters } from "@/services/parcelasApi"
import type { UpdateParcelaInput } from "@/types"

export function useParcelas(filters?: ParcelasFilters) {
  return useQuery({
    queryKey: queryKeys.parcelas.list(filters),
    queryFn: () => parcelasApi.getAll(filters),
  })
}

export function useParcela(id: number) {
  return useQuery({
    queryKey: queryKeys.parcelas.byId(id),
    queryFn: () => parcelasApi.getById(id),
    enabled: !!id,
  })
}

export function useUpdateParcela() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateParcelaInput }) =>
      parcelasApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parcelas.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.parcelas.byId(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.vendas.all })
    },
  })
}
