import { api } from "./apiClient"
import type { Setor } from "@/types"

// Serviço baseado em API_FRONTEND.md - apenas GET endpoints
export const setoresApi = {
  getAll: () => api.get<Setor[]>("/api/setores"),

  getBySlug: (slug: string) => api.get<Setor>(`/api/setores/slug/${slug}`),

  getById: (id: string) => api.get<Setor>(`/api/setores/${id}`),
}
