import { api } from "./apiClient"
import type { ResumoGeral, HealthCheck, HealthCheckDetailed } from "@/types"

// Serviço baseado em API_FRONTEND.md
export const resumoApi = {
  getGeral: () => api.get<ResumoGeral>("/api/resumo/geral"),
}

// Health Check baseado em API_FRONTEND.md
export const healthCheckApi = {
  root: () => api.get<HealthCheck>("/"),
  detailed: () => api.get<HealthCheckDetailed>("/health"),
}
