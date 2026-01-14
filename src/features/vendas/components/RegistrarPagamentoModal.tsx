"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { ptBR } from "date-fns/locale"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPagamentoSchema } from "@/schemas"
import { pagamentosApi } from "@/services/pagamentosApi"
import { useToast } from "@/shared/providers"
import { formatCurrency } from "@/shared/utils/format"
import { formatApiDate } from "@/lib/date"
import { FormaPagamento, FormaPagamentoLabels } from "@/enums"
import { queryKeys } from "@/lib/queryKeys"
import type { Parcela, CreatePagamentoInput } from "@/types"

interface RegistrarPagamentoModalProps {
  open: boolean
  parcela: Parcela
  onClose: () => void
  onSuccess: () => void
}

interface PagamentoFormData {
  valor: number
  dataPagamento: Date
  formaPagamento: FormaPagamento
  observacoes: string
}

export function RegistrarPagamentoModal({ open, parcela, onClose, onSuccess }: RegistrarPagamentoModalProps) {
  const { showSuccess, showError } = useToast()
  const queryClient = useQueryClient()

  const totalPago = parcela.pagamentos?.reduce((sum, p) => sum + p.valor, 0) || 0
  const valorRestante = parcela.valor - totalPago

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PagamentoFormData>({
    resolver: zodResolver(createPagamentoSchema.omit({ parcelaId: true })),
    defaultValues: {
      valor: valorRestante,
      dataPagamento: new Date(),
      formaPagamento: FormaPagamento.PIX,
      observacoes: "",
    },
  })

  const createPagamento = useMutation({
    mutationFn: (data: CreatePagamentoInput) => pagamentosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pagamentos.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.parcelas.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.vendas.all })
      showSuccess("Pagamento registrado com sucesso")
      reset()
      onSuccess()
    },
    onError: () => {
      showError("Erro ao registrar pagamento")
    },
  })

  const onSubmit = (data: PagamentoFormData) => {
    createPagamento.mutate({
      parcelaId: parcela.id,
      valor: data.valor,
      dataPagamento: formatApiDate(data.dataPagamento),
      formaPagamento: data.formaPagamento,
      observacoes: data.observacoes || undefined,
    })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Pagamento</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Parcela {parcela.numeroParcela} - Valor: {formatCurrency(parcela.valor)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Já pago: {formatCurrency(totalPago)} | Restante: {formatCurrency(valorRestante)}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="valor"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Valor *"
                    error={!!errors.valor}
                    helperText={errors.valor?.message}
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

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="dataPagamento"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Data do Pagamento *"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dataPagamento,
                        helperText: errors.dataPagamento?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="formaPagamento"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Forma de Pagamento *"
                    error={!!errors.formaPagamento}
                    helperText={errors.formaPagamento?.message}
                  >
                    {Object.entries(FormaPagamentoLabels).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="observacoes"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth multiline rows={2} label="Observações" />}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={createPagamento.isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={createPagamento.isPending}>
            {createPagamento.isPending ? "Registrando..." : "Registrar Pagamento"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}
