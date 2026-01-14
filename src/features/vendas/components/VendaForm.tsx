"use client"
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { ptBR } from "date-fns/locale"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { createVendaSchema } from "@/schemas"
import { useLotes } from "@/shared/hooks"
import { useToast } from "@/shared/providers"
import { formatApiDate } from "@/lib/date"
import { StatusLote } from "@/enums"
import type { CreateVendaInput, Lote } from "@/types"

interface VendaFormData {
  loteId: number
  valorTotal: number
  valorEntrada: number
  quantidadeParcelas: number
  dataVenda: Date
  compradorNome: string
  compradorCpf: string
  compradorTelefone: string
  compradorEmail: string
  observacoes: string
}

interface VendaFormProps {
  onSubmit: (data: CreateVendaInput) => Promise<void>
  loading?: boolean
  initialLoteId?: number
}

export function VendaForm({ onSubmit, loading = false, initialLoteId }: VendaFormProps) {
  const router = useRouter()
  const { showError } = useToast()

  // Fetch only available lotes
  const { data: lotesData, isLoading: loadingLotes } = useLotes({ status: StatusLote.DISPONIVEL, limit: 1000 })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VendaFormData>({
    resolver: zodResolver(createVendaSchema),
    defaultValues: {
      loteId: initialLoteId || 0,
      valorTotal: 0,
      valorEntrada: 0,
      quantidadeParcelas: 1,
      dataVenda: new Date(),
      compradorNome: "",
      compradorCpf: "",
      compradorTelefone: "",
      compradorEmail: "",
      observacoes: "",
    },
  })

  const valorTotal = watch("valorTotal")
  const valorEntrada = watch("valorEntrada")
  const quantidadeParcelas = watch("quantidadeParcelas")

  // Calculate valor parcela
  const valorRestante = valorTotal - valorEntrada
  const valorParcela = quantidadeParcelas > 0 ? valorRestante / quantidadeParcelas : 0

  const handleFormSubmit = async (data: VendaFormData) => {
    try {
      await onSubmit({
        ...data,
        dataVenda: formatApiDate(data.dataVenda),
        compradorCpf: data.compradorCpf || undefined,
        compradorTelefone: data.compradorTelefone || undefined,
        compradorEmail: data.compradorEmail || undefined,
        observacoes: data.observacoes || undefined,
      })
    } catch (error) {
      showError("Erro ao criar venda")
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Dados do Lote
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="loteId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Lote *"
                    error={!!errors.loteId}
                    helperText={errors.loteId?.message}
                    disabled={loadingLotes}
                  >
                    <MenuItem value={0} disabled>
                      Selecione um lote
                    </MenuItem>
                    {lotesData?.data?.map((lote: Lote) => (
                      <MenuItem key={lote.id} value={lote.id}>
                        Lote {lote.numero} - {lote.setor?.nome || "Sem setor"}
                        {lote.area ? ` (${lote.area} m²)` : ""}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="dataVenda"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Data da Venda *"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dataVenda,
                        helperText: errors.dataVenda?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Valores
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="valorTotal"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Valor Total *"
                    error={!!errors.valorTotal}
                    helperText={errors.valorTotal?.message}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      },
                    }}
                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="valorEntrada"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Valor de Entrada *"
                    error={!!errors.valorEntrada}
                    helperText={errors.valorEntrada?.message}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      },
                    }}
                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="quantidadeParcelas"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Quantidade de Parcelas *"
                    error={!!errors.quantidadeParcelas}
                    helperText={errors.quantidadeParcelas?.message}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10) || 1)}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Valor da Parcela: <strong>R$ {valorParcela.toFixed(2)}</strong> ({quantidadeParcelas}x)
                </Typography>
              </Box>
            </Grid>

            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Dados do Comprador
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="compradorNome"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nome do Comprador *"
                    error={!!errors.compradorNome}
                    helperText={errors.compradorNome?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="compradorCpf"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="CPF"
                    error={!!errors.compradorCpf}
                    helperText={errors.compradorCpf?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="compradorTelefone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Telefone"
                    error={!!errors.compradorTelefone}
                    helperText={errors.compradorTelefone?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="compradorEmail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.compradorEmail}
                    helperText={errors.compradorEmail?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="observacoes"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth multiline rows={3} label="Observações" />}
              />
            </Grid>

            <Grid size={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => router.back()} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Criar Venda"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  )
}
