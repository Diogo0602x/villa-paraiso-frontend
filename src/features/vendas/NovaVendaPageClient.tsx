"use client"

import { useState } from "react"
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { PageHeader, CurrencyTextField } from "@/shared/components"
import { useCreateVenda, useLotes, useSetores } from "@/shared/hooks"
import { StatusLote } from "@/enums"
import type { VendaCreate } from "@/types"

export function NovaVendaPageClient() {
  const router = useRouter()
  const { data: setores } = useSetores()
  const { data: lotesDisponiveis, isLoading: loadingLotes } = useLotes({
    status: StatusLote.DISPONIVEL,
  })
  const createVenda = useCreateVenda()

  const [formData, setFormData] = useState<VendaCreate>({
    lote_id: "",
    comprador: "",
    valor_total: 0,
    forma_pagamento: "",
    entrada: undefined,
    parcelamento: undefined,
    observacoes_venda: null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.lote_id || !formData.comprador || !formData.valor_total || !formData.forma_pagamento) {
      return
    }

    try {
      await createVenda.mutateAsync(formData)
      router.push("/vendas")
    } catch (error) {
      console.error("Erro ao criar venda:", error)
    }
  }

  const selectedLote = lotesDisponiveis?.find((l) => l.id === formData.lote_id)

  return (
    <Box>
      <PageHeader
        title="Nova Venda"
        subtitle="Registrar venda de lote"
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/vendas")}
          >
            Voltar
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Seleção do Lote */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Selecionar Lote
                </Typography>
                <Divider sx={{ my: 2 }} />
                {loadingLotes ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <FormControl fullWidth required>
                    <InputLabel>Lote</InputLabel>
                    <Select
                      value={formData.lote_id}
                      label="Lote"
                      onChange={(e) => setFormData({ ...formData, lote_id: e.target.value })}
                    >
                      {lotesDisponiveis?.map((lote) => (
                        <MenuItem key={lote.id} value={lote.id}>
                          Lote {lote.numero} - {lote.setor?.nome || "Sem setor"}
                          {lote.area && ` - ${lote.area} m²`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {selectedLote && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Setor:</strong> {selectedLote.setor?.nome || "-"}
                    </Typography>
                    {selectedLote.area && (
                      <Typography variant="body2">
                        <strong>Área:</strong> {selectedLote.area.toLocaleString("pt-BR")} m²
                      </Typography>
                    )}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Informações da Venda */}
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
                    value={formData.comprador}
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
                    value={formData.forma_pagamento}
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
                  value={formData.observacoes_venda || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      observacoes_venda: e.target.value || null,
                    })
                  }
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
              <Button variant="outlined" onClick={() => router.push("/vendas")}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createVenda.isPending}
              >
                {createVenda.isPending ? "Registrando..." : "Registrar Venda"}
              </Button>
            </Stack>
          </Grid>

          {createVenda.isError && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">
                Erro ao registrar venda. Tente novamente.
              </Alert>
            </Grid>
          )}
        </Grid>
      </form>
    </Box>
  )
}
