"use client"

import { Card, CardContent, Typography, Grid, Box, Divider } from "@mui/material"
import { Person, Phone, Email, Badge } from "@mui/icons-material"
import type { Cliente } from "@/hooks/useClientes"
import { formatCurrency } from "@/utils"

interface ClienteInfoCardProps {
  cliente: Cliente
}

export function ClienteInfoCard({ cliente }: ClienteInfoCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Informações do Cliente
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Person color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Nome
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {cliente.nome}
                </Typography>
              </Box>
            </Box>

            {cliente.cpf && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Badge color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    CPF
                  </Typography>
                  <Typography variant="body1">{cliente.cpf}</Typography>
                </Box>
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {cliente.telefone && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Phone color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Telefone
                  </Typography>
                  <Typography variant="body1">{cliente.telefone}</Typography>
                </Box>
              </Box>
            )}

            {cliente.email && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Email color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{cliente.email}</Typography>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Resumo Financeiro
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Total de Vendas
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {cliente.totalVendas}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Valor Total
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {formatCurrency(cliente.valorTotal)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Valor Pago
            </Typography>
            <Typography variant="h6" fontWeight={600} color="success.main">
              {formatCurrency(cliente.valorPago)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Valor Pendente
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              color={cliente.parcelasAtrasadas > 0 ? "error.main" : "warning.main"}
            >
              {formatCurrency(cliente.valorPendente)}
            </Typography>
          </Grid>
        </Grid>

        {cliente.parcelasAtrasadas > 0 && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: "error.50",
              borderRadius: 1,
              border: 1,
              borderColor: "error.200",
            }}
          >
            <Typography variant="body2" color="error.main">
              Este cliente possui {cliente.parcelasAtrasadas} parcela(s) em atraso.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
