"use client"

import { Box, FormControl, InputLabel, Select, MenuItem, Stack, Typography, FormGroup, FormControlLabel, Checkbox, Divider } from "@mui/material"
import { StatusLote } from "@/enums"
import { StatusLoteLabels } from "@/enums"
import type { Setor } from "@/types"

export interface MapFiltersState {
  kmlGeralSelecionado: boolean // KML geral selecionado (sempre sozinho)
  setoresSelecionados: string[] // Array de slugs de setores selecionados
  status?: StatusLote
}

interface MapFiltersProps {
  filters: MapFiltersState
  setores: Setor[]
  onFiltersChange: (filters: MapFiltersState) => void
  disabled?: boolean
}

export function MapFilters({ filters, setores, onFiltersChange, disabled }: MapFiltersProps) {
  const handleKmlGeralToggle = () => {
    const newKmlGeralSelected = !filters.kmlGeralSelecionado
    
    onFiltersChange({
      ...filters,
      kmlGeralSelecionado: newKmlGeralSelected,
      setoresSelecionados: newKmlGeralSelected ? [] : filters.setoresSelecionados || [], // Se KML geral selecionado, limpar setores
    })
  }

  const handleSetorToggle = (setorSlug: string) => {
    const currentSelected = filters.setoresSelecionados || []
    const newSelected = currentSelected.includes(setorSlug)
      ? currentSelected.filter((slug) => slug !== setorSlug)
      : [...currentSelected, setorSlug]
    
    onFiltersChange({
      ...filters,
      kmlGeralSelecionado: false, // Se selecionar setor, desmarcar KML geral
      setoresSelecionados: newSelected,
    })
  }

  const handleSelectAll = () => {
    const allSlugs = setores.map((s) => s.slug)
    const allSelected = allSlugs.every((slug) => filters.setoresSelecionados?.includes(slug))
    
    onFiltersChange({
      ...filters,
      kmlGeralSelecionado: false, // "Selecionar todos" não inclui KML geral
      setoresSelecionados: allSelected ? [] : allSlugs,
    })
  }

  const allSelected = setores.length > 0 && setores.every((s) => filters.setoresSelecionados?.includes(s.slug))
  const someSelected = setores.some((s) => filters.setoresSelecionados?.includes(s.slug))

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Filtros
      </Typography>
      <Stack spacing={2}>
        <FormControl component="fieldset" disabled={disabled}>
          <Typography variant="body2" fontWeight="medium" mb={1}>
            Mapas
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.kmlGeralSelecionado || false}
                  onChange={handleKmlGeralToggle}
                  size="small"
                />
              }
              label="Mapa Geral"
            />
          </FormGroup>
        </FormControl>

        <Divider />

        <FormControl component="fieldset" disabled={disabled}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" fontWeight="medium">
              Setores
            </Typography>
            <Typography
              variant="caption"
              sx={{ cursor: "pointer", color: "primary.main", textDecoration: "underline" }}
              onClick={handleSelectAll}
            >
              {allSelected ? "Desmarcar todos" : "Selecionar todos"}
            </Typography>
          </Box>
          <FormGroup>
            {setores.map((setor) => (
              <FormControlLabel
                key={setor.slug}
                control={
                  <Checkbox
                    checked={filters.setoresSelecionados?.includes(setor.slug) || false}
                    onChange={() => handleSetorToggle(setor.slug)}
                    size="small"
                    disabled={filters.kmlGeralSelecionado} // Desabilitar setores quando KML geral está selecionado
                  />
                }
                label={setor.nome}
              />
            ))}
          </FormGroup>
        </FormControl>

        <Divider />

        <FormControl size="small" fullWidth disabled={disabled}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ""}
            label="Status"
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                status: (e.target.value as StatusLote) || undefined,
              })
            }
          >
            <MenuItem value="">Todos</MenuItem>
            {Object.entries(StatusLoteLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  )
}

export function MapLegend() {
  const legendItems = [
    { status: StatusLote.DISPONIVEL, color: "#4caf50", label: "Disponível" },
    { status: StatusLote.RESERVADO, color: "#ff9800", label: "Reservado" },
    { status: StatusLote.VENDIDO, color: "#f44336", label: "Vendido" },
  ]

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Legenda
      </Typography>
      <Stack spacing={1}>
        {legendItems.map((item) => (
          <Box key={item.status} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: 0.5,
                bgcolor: item.color,
                border: "1px solid rgba(0,0,0,0.2)",
              }}
            />
            <Typography variant="body2">{item.label}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
