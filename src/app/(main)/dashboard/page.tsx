import { DashboardPage } from "@/features/dashboard"
import type { Metadata } from "next"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Dashboard | Villa Paraíso",
  description: "Visão geral do sistema de gestão imobiliária",
}

export default function Page() {
  return <DashboardPage />
}
