import type { Metadata } from "next"
import { MapaPageClient } from "@/features/mapa/MapaPageClient"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Mapa | Villa Paraíso",
  description: "Visualização interativa do mapa de lotes",
}

export default function MapaPage() {
  return <MapaPageClient />
}
