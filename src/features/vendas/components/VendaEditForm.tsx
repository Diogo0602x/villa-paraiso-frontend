"use client"

import { Box, Paper, TextField, Button, Grid, Typography, CircularProgress } from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { updateVendaSchema } from "@/schemas"
import { useVenda, useUpdateVenda } from "@/shared/hooks"
import { useToast } from "@/shared/providers"
import { LoadingState, ErrorState } from "@/shared/components"

interface VendaEditFormProps {
  vendaId: number
}

interface EditFormData {
  compradorNome: string
  compradorCpf: string
  compradorTelefone: string
  compradorEmail: string
  observacoes: string
}

export function VendaEditForm({ vendaId }: VendaEditFormProps) {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const { data: venda, isLoading, error, refetch } = useVenda(vendaId)
  const updateVenda = useUpdateVenda()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(updateVendaSchema),
    values: {
      compradorNome: venda?.compradorNome || "",
      compradorCpf: venda?.compradorCpf || "",
      compradorTelefone: venda?.compradorTelefone || "",
      compradorEmail: venda?.compradorEmail || "",
      observacoes: venda?.observacoes || "",
    },
  })

  if (isLoading) return <LoadingState message="Carregando venda..." />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!venda) return <ErrorState error={new Error("Venda não encontrada")} />

  const onSubmit = async (data: EditFormData) => {
    try {
      await updateVenda.mutateAsync({
        id: vendaId,
        data: {
          compradorNome: data.compradorNome,
          compradorCpf: data.compradorCpf || undefined,
          compradorTelefone: data.compradorTelefone || undefined,
          compradorEmail: data.compradorEmail || undefined,
          observacoes: data.observacoes || undefined,
        },
      })
      showSuccess("Venda atualizada com sucesso")
      router.push(`/vendas/${vendaId}`)
    } catch {
      showError("Erro ao atualizar venda")
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
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
              render={({ field }) => <TextField {...field} fullWidth multiline rows={4} label="Observações" />}
            />
          </Grid>

          <Grid size={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => router.back()} disabled={updateVenda.isPending}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={updateVenda.isPending}>
                {updateVenda.isPending ? <CircularProgress size={24} /> : "Salvar Alterações"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}
