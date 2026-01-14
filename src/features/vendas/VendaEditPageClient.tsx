"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { PageHeader, CurrencyTextField } from "@/shared/components"
import { useVenda, useUpdateVenda } from "@/shared/hooks"
import type { VendaUpdate } from "@/types"

interface VendaEditPageClientProps {
  vendaId: string
}

export function VendaEditPageClient({ vendaId }: VendaEditPageClientProps) {
  const router = useRouter()
  const { data: venda, isLoading, error } = useVenda(vendaId)
  const updateVenda = useUpdateVenda()

  const [formData, setFormData] = useState<VendaUpdate>({
    comprador: "",
    valor_total: 0,
    forma_pagamento: "",
    entrada: undefined,
    parcelamento: undefined,
    observacoes_venda: null,
  })

  useEffect(() => {
    if (venda) {
      // Garantir que observacoes_venda seja uma string (não null) para o TextField
      const observacoesVenda = venda.observacoes_venda !== null && venda.observacoes_venda !== undefined 
        ? venda.observacoes_venda 
        : ""
      
      setFormData({
        comprador: venda.comprador ?? "",
        valor_total: venda.valor_total_venda ?? 0,
        forma_pagamento: venda.forma_pagamento ?? "",
        entrada: venda.entrada_venda ?? undefined,
        parcelamento: venda.parcelamento_venda ?? undefined,
        observacoes_venda: observacoesVenda,
      })
    }
  }, [venda])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.comprador || !formData.valor_total || !formData.forma_pagamento) {
      return
    }

    try {
      await updateVenda.mutateAsync({ id: vendaId, data: formData })
      router.push(`/vendas/${vendaId}`)
    } catch (error) {
      console.error("Erro ao atualizar venda:", error)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !venda) {
    return (
      <Box>
        <PageHeader title="Venda não encontrada" />
        <Alert severity="error">Erro ao carregar venda. Tente novamente mais tarde.</Alert>
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader
        title={`Editar Venda - Lote ${venda.numero}`}
        subtitle={venda.setor?.nome || "Editar informações da venda"}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(`/vendas/${vendaId}`)}
          >
            Voltar
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Informações do Lote (somente leitura) */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informações do Lote
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Lote:</strong> {venda.numero}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Setor:</strong> {venda.setor?.nome || "-"}
                  </Typography>
                  {venda.area && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Área:</strong> {venda.area.toLocaleString("pt-BR")} m²
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Informações do Comprador */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informações do Comprador
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={3}>
                  <TextField
                    label="Comprador"
                    value={formData.comprador || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, comprador: e.target.value })
                    }
                    required
                    fullWidth
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Informações Financeiras */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informações Financeiras
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={3}>
                  <CurrencyTextField
                    label="Valor Total"
                    value={formData.valor_total || 0}
                    onChange={(value) =>
                      setFormData({ ...formData, valor_total: value })
                    }
                    required
                    fullWidth
                  />

                  <TextField
                    label="Forma de Pagamento"
                    value={formData.forma_pagamento || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, forma_pagamento: e.target.value })
                    }
                    required
                    fullWidth
                    placeholder="Ex: À vista, Parcelado, Financiamento"
                  />

                  <CurrencyTextField
                    label="Entrada (opcional)"
                    value={formData.entrada || 0}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        entrada: value > 0 ? value : undefined,
                      })
                    }
                    fullWidth
                  />

                  <TextField
                    label="Parcelamento (opcional)"
                    value={formData.parcelamento || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parcelamento: e.target.value || undefined,
                      })
                    }
                    fullWidth
                    placeholder="Ex: 10x de R$ 10.000,00"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Observações da Venda */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Observações da Venda
                </Typography>
                <Divider sx={{ my: 2 }} />
                <TextField
                  label="Observações da Venda"
                  value={formData.observacoes_venda ?? ""}
                  onChange={(e) => {
                    const value = e.target.value.trim()
                    setFormData({
                      ...formData,
                      observacoes_venda: value || null,
                    })
                  }}
                  multiline
                  rows={4}
                  fullWidth
                  helperText="Informações adicionais sobre a venda (separadas das observações gerais do lote)"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Ações */}
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => router.push(`/vendas/${vendaId}`)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={updateVenda.isPending}
              >
                {updateVenda.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </Stack>
          </Grid>

          {updateVenda.isError && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">
                Erro ao atualizar venda. Tente novamente.
              </Alert>
            </Grid>
          )}
        </Grid>
      </form>
    </Box>
  )
}
