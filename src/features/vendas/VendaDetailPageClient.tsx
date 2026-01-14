"use client"

import { useRouter } from "next/navigation"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EditIcon from "@mui/icons-material/Edit"
import { PageHeader } from "@/shared/components"
import { useVenda } from "@/shared/hooks"
import { formatCurrency } from "@/shared/utils/format"
import { StatusLoteLabels } from "@/enums"

interface VendaDetailPageClientProps {
  vendaId: string
}

export function VendaDetailPageClient({ vendaId }: VendaDetailPageClientProps) {
  const router = useRouter()
  const { data: venda, isLoading, error } = useVenda(vendaId)

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
        title={`Venda - Lote ${venda.numero}`}
        subtitle={venda.setor?.nome || "Detalhes da venda"}
        action={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/vendas")}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/vendas/${vendaId}/editar`)}
            >
              Editar
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={3}>
        {/* Informações do Lote */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações do Lote
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Número do Lote
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {venda.numero}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Setor
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {venda.setor?.nome || "-"}
                  </Typography>
                </Box>
                {venda.area && (
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Área
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {venda.area.toLocaleString("pt-BR")} m²
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Status
                  </Typography>
                  <Chip
                    label={StatusLoteLabels[venda.status]}
                    color="success"
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Área
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {venda.area ? `${venda.area.toLocaleString("pt-BR")} m²` : "-"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Características
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {venda.tem_acesso_agua && (
                      <Chip label="Acesso à Água" size="small" color="primary" />
                    )}
                    {venda.frente_br060 && (
                      <Chip label="Frente BR-060" size="small" color="secondary" />
                    )}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Informações da Venda */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações da Venda
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Comprador
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {venda.comprador || "-"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Valor Total
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {venda.valor_total_venda ? formatCurrency(venda.valor_total_venda) : "-"}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Forma de Pagamento
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {venda.forma_pagamento || "-"}
                  </Typography>
                </Box>
                {venda.entrada_venda && (
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Entrada
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(venda.entrada_venda)}
                    </Typography>
                  </Box>
                )}
                {venda.parcelamento_venda && (
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Parcelamento
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {venda.parcelamento_venda}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Observações da Venda */}
        {venda.observacoes_venda && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Observações da Venda
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {venda.observacoes_venda}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Observações Gerais do Lote */}
        {venda.observacoes && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Observações do Lote
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {venda.observacoes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
