"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { lotesApi, type LotesFilters, type LotesVendidosFilters, type LotesDisponiveisFilters } from "@/services/lotesApi"
import type { LoteCreate, LoteUpdate, LoteVenda } from "@/types"

// Hooks de query (GET)
export function useLotes(filters?: LotesFilters) {
  return useQuery({
    queryKey: ["lotes", "list", filters || {}],
    queryFn: () => lotesApi.getAll(filters),
  })
}

export function useLote(id: string) {
  return useQuery({
    queryKey: ["lotes", id],
    queryFn: () => lotesApi.getById(id),
    enabled: !!id,
  })
}

export function useLotesBySetor(setorSlug: string) {
  return useQuery({
    queryKey: ["lotes", "setor", setorSlug],
    queryFn: () => lotesApi.getAll({ setor_slug: setorSlug }),
    enabled: !!setorSlug,
  })
}

export function useResumoLotesStatus() {
  return useQuery({
    queryKey: ["lotes", "resumo", "status"],
    queryFn: () => lotesApi.getResumoStatus(),
  })
}

export function useLotesVendidos(filters?: LotesVendidosFilters) {
  return useQuery({
    queryKey: ["lotes", "vendidos", filters || {}],
    queryFn: () => lotesApi.getVendidos(filters),
  })
}

export function useLotesDisponiveis(filters?: LotesDisponiveisFilters) {
  return useQuery({
    queryKey: ["lotes", "disponiveis", filters || {}],
    queryFn: () => lotesApi.getDisponiveis(filters),
  })
}

// Hooks de mutação (POST, PUT, DELETE)
export function useCreateLote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoteCreate) => lotesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes"] })
      queryClient.invalidateQueries({ queryKey: ["setores"] })
    },
  })
}

export function useUpdateLote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LoteUpdate }) => lotesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lotes"] })
      queryClient.invalidateQueries({ queryKey: ["lotes", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["setores"] })
    },
  })
}

export function useDeleteLote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => lotesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes"] })
      queryClient.invalidateQueries({ queryKey: ["setores"] })
    },
  })
}

export function useRegistrarVendaLote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LoteVenda }) => lotesApi.registrarVenda(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lotes"] })
      queryClient.invalidateQueries({ queryKey: ["lotes", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["setores"] })
    },
  })
}
