"use client"

import { useState } from "react"
import { Box, TextField, Button, Stack } from "@mui/material"
import { FilterList, Clear } from "@mui/icons-material"

export interface PagamentosFiltersState {
  dataInicio?: string
  dataFim?: string
}

interface PagamentosFiltersProps {
  filters: PagamentosFiltersState
  onFiltersChange: (filters: PagamentosFiltersState) => void
}

export function PagamentosFilters({ filters, onFiltersChange }: PagamentosFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PagamentosFiltersState>(filters)

  const handleApply = () => {
    onFiltersChange(localFilters)
  }

  const handleClear = () => {
    const cleared: PagamentosFiltersState = {}
    setLocalFilters(cleared)
    onFiltersChange(cleared)
  }

  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== "")

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-end">
        <TextField
          size="small"
          label="Data De"
          type="date"
          value={localFilters.dataInicio || ""}
          onChange={(e) =>
            setLocalFilters((prev) => ({
              ...prev,
              dataInicio: e.target.value || undefined,
            }))
          }
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          size="small"
          label="Data Até"
          type="date"
          value={localFilters.dataFim || ""}
          onChange={(e) =>
            setLocalFilters((prev) => ({
              ...prev,
              dataFim: e.target.value || undefined,
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
