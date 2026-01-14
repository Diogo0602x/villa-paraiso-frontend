"use client"

import { useState } from "react"
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Stack } from "@mui/material"
import { FilterList, Clear } from "@mui/icons-material"
import type { StatusParcela } from "@/enums"
import { StatusParcelaLabels } from "@/enums"

export interface ParcelasFiltersState {
  status?: StatusParcela
  dataVencimentoInicio?: string
  dataVencimentoFim?: string
}

interface ParcelasFiltersProps {
  filters: ParcelasFiltersState
  onFiltersChange: (filters: ParcelasFiltersState) => void
}

export function ParcelasFilters({ filters, onFiltersChange }: ParcelasFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ParcelasFiltersState>(filters)

  const handleApply = () => {
    onFiltersChange(localFilters)
  }

  const handleClear = () => {
    const cleared: ParcelasFiltersState = {}
    setLocalFilters(cleared)
    onFiltersChange(cleared)
  }

  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== "")

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-end">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={localFilters.status || ""}
            label="Status"
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                status: (e.target.value as StatusParcela) || undefined,
              }))
            }
          >
            <MenuItem value="">Todos</MenuItem>
            {Object.entries(StatusParcelaLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Vencimento De"
          type="date"
          value={localFilters.dataVencimentoInicio || ""}
          onChange={(e) =>
            setLocalFilters((prev) => ({
              ...prev,
              dataVencimentoInicio: e.target.value || undefined,
            }))
          }
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          size="small"
          label="Vencimento Até"
          type="date"
          value={localFilters.dataVencimentoFim || ""}
          onChange={(e) =>
            setLocalFilters((prev) => ({
              ...prev,
              dataVencimentoFim: e.target.value || undefined,
            }))
          }
          InputLabelProps={{ shrink: true }}
        />

        <Button variant="contained" startIcon={<FilterList />} onClick={handleApply}>
          Filtrar
        </Button>

        {hasFilters && (
          <Button variant="outlined" startIcon={<Clear />} onClick={handleClear}>
            Limpar
          </Button>
        )}
      </Stack>
    </Box>
  )
}
