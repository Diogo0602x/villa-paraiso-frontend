"use client"

import { Box } from "@mui/material"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/shared/components"
import { useCreateVenda } from "@/shared/hooks"
import { useToast } from "@/shared/providers"
import { VendaForm } from "./components"
import type { CreateVendaInput } from "@/types"

export function NovaVendaPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const createVenda = useCreateVenda()

  const handleSubmit = async (data: CreateVendaInput) => {
    try {
      const venda = await createVenda.mutateAsync(data)
      showSuccess("Venda criada com sucesso")
      router.push(`/vendas/${venda.id}`)
    } catch {
      showError("Erro ao criar venda")
      throw new Error("Failed to create venda")
    }
  }

  return (
    <Box>
      <PageHeader
        title="Nova Venda"
        subtitle="Cadastrar uma nova venda de lote"
        breadcrumbs={[{ label: "Vendas", href: "/vendas" }, { label: "Nova Venda" }]}
      />

      <VendaForm onSubmit={handleSubmit} loading={createVenda.isPending} />
    </Box>
  )
}
