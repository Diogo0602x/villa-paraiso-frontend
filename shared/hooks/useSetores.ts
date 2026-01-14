"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import { setoresApi } from "@/services/setoresApi"
import type { CreateSetorInput, UpdateSetorInput } from "@/types"

export function useSetores() {
  return useQuery({
    queryKey: queryKeys.setores.all,
    queryFn: () => setoresApi.getAll(),
  })
}

export function useSetorBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.setores.bySlug(slug),
    queryFn: () => setoresApi.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useSetorLotes(slug: string) {
  return useQuery({
    queryKey: queryKeys.setores.lotes(slug),
    queryFn: () => setoresApi.getLotesBySlug(slug),
    enabled: !!slug,
  })
}

export function useCreateSetor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSetorInput) => setoresApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.setores.all })
    },
  })
}

export function useUpdateSetor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSetorInput }) => setoresApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.setores.all })
    },
  })
}

export function useDeleteSetor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => setoresApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.setores.all })
    },
  })
}
