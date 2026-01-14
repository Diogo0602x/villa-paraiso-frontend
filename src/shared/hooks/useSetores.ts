"use client"

import { useQuery } from "@tanstack/react-query"
import { setoresApi } from "@/services/setoresApi"
import { lotesApi } from "@/services/lotesApi"

// Hooks baseados em API_FRONTEND.md - apenas GET endpoints
export function useSetores() {
  return useQuery({
    queryKey: ["setores", "all"],
    queryFn: () => setoresApi.getAll(),
  })
}

export function useSetorBySlug(slug: string) {
  return useQuery({
    queryKey: ["setores", "slug", slug],
    queryFn: () => setoresApi.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useSetorById(id: string) {
  return useQuery({
    queryKey: ["setores", id],
    queryFn: () => setoresApi.getById(id),
    enabled: !!id,
  })
}

export function useSetorLotes(slug: string) {
  return useQuery({
    queryKey: ["lotes", "setor", slug],
    queryFn: () => lotesApi.getAll({ setor_slug: slug }),
    enabled: !!slug,
  })
}
