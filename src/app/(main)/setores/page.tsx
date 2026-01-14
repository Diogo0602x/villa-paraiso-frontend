import { SetoresPageClient } from "@/features/setores/SetoresPageClient"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Setores | Villa Paraíso",
  description: "Gerenciamento de setores",
}

export default function SetoresPage() {
  return <SetoresPageClient />
}
