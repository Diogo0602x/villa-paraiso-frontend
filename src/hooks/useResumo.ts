"use client"

import { useQuery } from "@tanstack/react-query"
import { resumoApi, healthCheckApi } from "@/services/resumoApi"

// Hooks baseados em API_FRONTEND.md
export function useResumoGeral() {
  return useQuery({
    queryKey: ["resumo", "geral"],
    queryFn: () => resumoApi.getGeral(),
  })
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health", "root"],
    queryFn: () => healthCheckApi.root(),
  })
}

export function useHealthCheckDetailed() {
  return useQuery({
    queryKey: ["health", "detailed"],
    queryFn: () => healthCheckApi.detailed(),
  })
}
