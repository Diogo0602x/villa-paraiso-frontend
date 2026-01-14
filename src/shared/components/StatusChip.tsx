"use client"

import { Chip } from "@mui/material"
import {
  type StatusLote,
  type StatusParcela,
  type StatusDividaEmpresa,
  StatusLoteLabels,
  StatusParcelaLabels,
  StatusDividaEmpresaLabels,
  StatusLoteColors,
  StatusParcelaColors,
} from "@/enums"

type StatusType = StatusLote | StatusParcela | StatusDividaEmpresa

interface StatusChipProps {
  status: StatusType
  type: "lote" | "parcela" | "divida"
  size?: "small" | "medium"
}

export function StatusChip({ status, type, size = "small" }: StatusChipProps) {
  let label: string
  let color: string

  switch (type) {
    case "lote":
      label = StatusLoteLabels[status as StatusLote]
      color = StatusLoteColors[status as StatusLote]
      break
    case "parcela":
      label = StatusParcelaLabels[status as StatusParcela]
      color = StatusParcelaColors[status as StatusParcela]
      break
    case "divida":
      label = StatusDividaEmpresaLabels[status as StatusDividaEmpresa]
      color = status === "ativa" ? "#ff9800" : status === "quitada" ? "#4caf50" : "#9e9e9e"
      break
    default:
      label = status
      color = "#9e9e9e"
  }

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        backgroundColor: color,
        color: "#fff",
        fontWeight: 500,
      }}
    />
  )
}
