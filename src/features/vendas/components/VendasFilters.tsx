"use client"

import { useEffect } from "react"
import { Box, TextField, MenuItem, Button, Paper } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { ptBR } from "date-fns/locale"
import { useForm, Controller } from "react-hook-form"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import { useSetores } from "@/shared/hooks"
import { formatApiDate, parseApiDate } from "@/lib/date"

interface FiltersForm {
  setorSlug: string
  dataInicio: Date | null
  dataFim: Date | null
}

interface VendasFiltersProps {
  onFiltersChange: (filters: { setorSlug?: string; dataInicio?: string; dataFim?: string }) => void
}

export function VendasFilters({ onFiltersChange }: VendasFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { data: setoresResponse } = useSetores()
  const setores = setoresResponse?.data || []

  const { control, handleSubmit, reset, watch } = useForm<FiltersForm>({
    defaultValues: {
      setorSlug: searchParams.get("setorSlug") || "",
      dataInicio: searchParams.get("dataInicio") ? parseApiDate(searchParams.get("dataInicio")!) : null,
      dataFim: searchParams.get("dataFim") ? parseApiDate(searchParams.get("dataFim")!) : null,
    },
  })

  const onSubmit = (data: FiltersForm) => {
    const params = new URLSearchParams()
    if (data.setorSlug) params.set("setorSlug", data.setorSlug)
    if (data.dataInicio) params.set("dataInicio", formatApiDate(data.dataInicio))
    if (data.dataFim) params.set("dataFim", formatApiDate(data.dataFim))

    router.push(`${pathname}?${params.toString()}`)

    onFiltersChange({
      setorSlug: data.setorSlug || undefined,
      dataInicio: data.dataInicio ? formatApiDate(data.dataInicio) : undefined,
      dataFim: data.dataFim ? formatApiDate(data.dataFim) : undefined,
    })
  }

  const handleClear = () => {
    reset({ setorSlug: "", dataInicio: null, dataFim: null })
    router.push(pathname)
    onFiltersChange({})
  }

  // Sync URL params on mount
  useEffect(() => {
    const setorSlug = searchParams.get("setorSlug") || undefined
    const dataInicio = searchParams.get("dataInicio") || undefined
    const dataFim = searchParams.get("dataFim") || undefined
    onFiltersChange({ setorSlug, dataInicio, dataFim })
  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          gap={2}
          flexWrap="wrap"
          alignItems="center"
        >
          <Controller
            name="setorSlug"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Setor" size="small" sx={{ minWidth: 200 }}>
                <MenuItem value="">Todos os setores</MenuItem>
                {setores.map((setor) => (
                  <MenuItem key={setor.id} value={setor.slug}>
                    {setor.nome}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="dataInicio"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Data Início"
                slotProps={{
                  textField: { size: "small", sx: { minWidth: 160 } },
                }}
              />
            )}
          />

          <Controller
            name="dataFim"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Data Fim"
                slotProps={{
                  textField: { size: "small", sx: { minWidth: 160 } },
                }}
              />
            )}
          />

          <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
            Filtrar
          </Button>

          <Button type="button" variant="outlined" startIcon={<ClearIcon />} onClick={handleClear}>
            Limpar
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  )
}
