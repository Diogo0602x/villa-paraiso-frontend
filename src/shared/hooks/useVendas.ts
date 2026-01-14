import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vendasApi } from "@/services/vendasApi"
import type { Venda, VendaCreate, VendaUpdate, VendasFilters } from "@/types"

// Query keys
const vendasKeys = {
  all: ["vendas"] as const,
  lists: () => [...vendasKeys.all, "list"] as const,
  list: (filters?: VendasFilters) => [...vendasKeys.lists(), filters] as const,
  details: () => [...vendasKeys.all, "detail"] as const,
  detail: (id: string) => [...vendasKeys.details(), id] as const,
}

// Listar todas as vendas
export function useVendas(filters?: VendasFilters) {
  return useQuery({
    queryKey: vendasKeys.list(filters),
    queryFn: () => vendasApi.getAll(filters),
  })
}

// Buscar uma venda específica
export function useVenda(id: string) {
  return useQuery({
    queryKey: vendasKeys.detail(id),
    queryFn: () => vendasApi.getById(id),
    enabled: !!id,
  })
}

// Criar nova venda
export function useCreateVenda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: VendaCreate) => vendasApi.create(data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: vendasKeys.all })
      queryClient.invalidateQueries({ queryKey: ["lotes"] })
    },
  })
}

// Atualizar venda
export function useUpdateVenda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VendaUpdate }) =>
      vendasApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: vendasKeys.all })
      queryClient.invalidateQueries({ queryKey: vendasKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ["lotes"] })
    },
  })
}

// Deletar venda (reverter status)
export function useDeleteVenda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => vendasApi.delete(id),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: vendasKeys.all })
      queryClient.invalidateQueries({ queryKey: ["lotes"] })
    },
  })
}
