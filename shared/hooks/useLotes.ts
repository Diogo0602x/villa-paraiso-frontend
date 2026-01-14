"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import { lotesApi, type LotesFilters } from "@/services/lotesApi"
import type { CreateLoteInput, UpdateLoteInput } from "@/types"

export function useLotes(filters?: LotesFilters) {
  return useQuery({
    queryKey: queryKeys.lotes.list(filters || {}),
    queryFn: () => lotesApi.getAll(filters),
  })
}

export function useLote(id: number) {
  return useQuery({
    queryKey: queryKeys.lotes.byId(id),
    queryFn: () => lotesApi.getById(id),
    enabled: !!id,
  })
}

export function useLotesBySetor(setorSlug: string) {
  return useQuery({
    queryKey: queryKeys.lotes.bySetor(setorSlug),
    queryFn: () => lotesApi.getBySetorSlug(setorSlug),
    enabled: !!setorSlug,
  })
}

export function useCreateLote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLoteInput) => lotesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lotes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.setores.all })
    },
  })
}

export function useUpdateLote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLoteInput }) => lotesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lotes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.lotes.byId(variables.id) })
    },
  })
}

export function useDeleteLote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => lotesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lotes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.setores.all })
    },
  })
}
