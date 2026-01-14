"use client"

import { useState } from "react"
import {
  Paper,
  Typography,
  Divider,
  Box,
  Button,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { ptBR } from "date-fns/locale"
import { useForm, Controller } from "react-hook-form"
import AddIcon from "@mui/icons-material/Add"
import { useUpdateVenda } from "@/shared/hooks"
import { useToast } from "@/shared/providers"
import { formatCurrency } from "@/shared/utils/format"
import { formatDate, formatApiDate } from "@/lib/date"

interface PermutaForm {
  descricao: string
  valorAbatido: number
  data: Date
  observacoes: string
}

interface Permuta {
  descricao: string
  valorAbatido: number
  data: string
  observacoes: string
}

interface PermutaSectionProps {
  vendaId: number
  observacoes: string
}

// Parse permutas from observacoes field
function parsePermutas(observacoes: string): Permuta[] {
  const permutas: Permuta[] = []
  const regex =
    /PERMUTA:\s*([^|]+)\s*\|\s*Valor abatido:\s*R\$\s*([\d.,]+)\s*\|\s*Data:\s*(\d{4}-\d{2}-\d{2})\s*\|\s*Obs:\s*([^§]*)/g

  let match
  while ((match = regex.exec(observacoes)) !== null) {
    permutas.push({
      descricao: match[1].trim(),
      valorAbatido: Number.parseFloat(match[2].replace(".", "").replace(",", ".")),
      data: match[3],
      observacoes: match[4].trim(),
    })
  }

  return permutas
}

// Format permuta to text block
function formatPermutaText(permuta: PermutaForm): string {
  return `PERMUTA: ${permuta.descricao} | Valor abatido: R$ ${permuta.valorAbatido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} | Data: ${formatApiDate(permuta.data)} | Obs: ${permuta.observacoes}§`
}

export function PermutaSection({ vendaId, observacoes }: PermutaSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { showSuccess, showError } = useToast()
  const updateVenda = useUpdateVenda()

  const permutas = parsePermutas(observacoes)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermutaForm>({
    defaultValues: {
      descricao: "",
      valorAbatido: 0,
      data: new Date(),
      observacoes: "",
    },
  })

  const onSubmit = async (data: PermutaForm) => {
    try {
      const newPermutaText = formatPermutaText(data)
      const newObservacoes = observacoes ? `${observacoes}\n${newPermutaText}` : newPermutaText

      await updateVenda.mutateAsync({
        id: vendaId,
        data: { observacoes: newObservacoes },
      })

      showSuccess("Permuta registrada com sucesso")
      reset()
      setModalOpen(false)
    } catch {
      showError("Erro ao registrar permuta")
    }
  }

  const totalAbatido = permutas.reduce((sum, p) => sum + p.valorAbatido, 0)

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Permutas / Abatimentos (MVP)</Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
            Registrar Permuta
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {permutas.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={3}>
            Nenhuma permuta registrada
          </Typography>
        ) : (
          <>
            <List>
              {permutas.map((permuta, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={permuta.descricao}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="success.main">
                          Abatido: {formatCurrency(permuta.valorAbatido)}
                        </Typography>
                        {" - "}
                        <Typography component="span" variant="body2">
                          Data: {formatDate(permuta.data)}
                        </Typography>
                        {permuta.observacoes && (
                          <>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              {permuta.observacoes}
                            </Typography>
                          </>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2, p: 2, bgcolor: "success.light", borderRadius: 1 }}>
              <Typography variant="body1" fontWeight={600} color="success.dark">
                Total Abatido: {formatCurrency(totalAbatido)}
              </Typography>
            </Box>
          </>
        )}

        {/* Add Permuta Modal */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Registrar Permuta</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={12}>
                <Controller
                  name="descricao"
                  control={control}
                  rules={{ required: "Descrição é obrigatória" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Descrição *"
                      placeholder="Ex: Carro Corolla 2020"
                      error={!!errors.descricao}
                      helperText={errors.descricao?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="valorAbatido"
                  control={control}
                  rules={{ required: "Valor é obrigatório", min: { value: 0.01, message: "Valor deve ser positivo" } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Valor Abatido *"
                      error={!!errors.valorAbatido}
                      helperText={errors.valorAbatido?.message}
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
                  name="data"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Data *"
                      slotProps={{
                        textField: { fullWidth: true },
                      }}
                    />
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
            <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={updateVenda.isPending}>
              {updateVenda.isPending ? "Salvando..." : "Registrar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </LocalizationProvider>
  )
}
