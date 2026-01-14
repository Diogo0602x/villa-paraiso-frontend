"use client"

import { Box, Typography, Button, Chip, Divider } from "@mui/material"
import type { GeoJsonFeature } from "@/types"
import { StatusLote } from "@/enums"
import { formatCurrency } from "@/utils"

interface MapPopupProps {
  feature: GeoJsonFeature["properties"]
  onViewDetails: () => void
}

export function MapPopupContent({ feature, onViewDetails }: MapPopupProps) {
  const statusColors: Record<StatusLote, "success" | "warning" | "error"> = {
    [StatusLote.DISPONIVEL]: "success",
    [StatusLote.RESERVADO]: "warning",
    [StatusLote.VENDIDO]: "error",
  }

  const statusLabels: Record<StatusLote, string> = {
    [StatusLote.DISPONIVEL]: "Disponível",
    [StatusLote.RESERVADO]: "Reservado",
    [StatusLote.VENDIDO]: "Vendido",
  }

  return (
    <Box sx={{ minWidth: 220, p: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Lote {feature.numero}
        </Typography>
        <Chip label={statusLabels[feature.status]} color={statusColors[feature.status]} size="small" />
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        {feature.setor?.nome || "N/A"}
      </Typography>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
        {feature.area && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Área
            </Typography>
            <Typography variant="body2">{feature.area.toLocaleString("pt-BR")} m²</Typography>
          </Box>
        )}
        <Box>
          <Typography variant="caption" color="text.secondary">
            Água
          </Typography>
          <Typography variant="body2">{feature.temAcessoAgua ? "Sim" : "Não"}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            BR-060
          </Typography>
          <Typography variant="body2">{feature.frenteBR060 ? "Sim" : "Não"}</Typography>
        </Box>
      </Box>

      {feature.status === StatusLote.VENDIDO && feature.compradorNome && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Comprador
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {feature.compradorNome}
            </Typography>
            {feature.valorTotal && (
              <Typography variant="body2" color="success.main">
                {formatCurrency(feature.valorTotal)}
              </Typography>
            )}
          </Box>
        </>
      )}

      <Button variant="outlined" size="small" fullWidth sx={{ mt: 2 }} onClick={onViewDetails}>
        Ver Detalhes
      </Button>
    </Box>
  )
}
