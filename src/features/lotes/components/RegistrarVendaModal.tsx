"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Typography,
  Box,
} from "@mui/material"
import { useRegistrarVendaLote } from "@/shared/hooks/useLotes"
import type { Lote, LoteVenda } from "@/types"
import { CurrencyTextField } from "@/shared/components"

interface RegistrarVendaModalProps {
  open: boolean
  onClose: () => void
  lote: Lote | null
}

export function RegistrarVendaModal({ open, onClose, lote }: RegistrarVendaModalProps) {
  const registrarVendaMutation = useRegistrarVendaLote()

  const [formData, setFormData] = useState<LoteVenda>({
    comprador: "",
    valor_total: 0,
    forma_pagamento: "",
    entrada: undefined,
    parcelamento: undefined,
    observacoes_venda: null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!lote) return

    try {
      await registrarVendaMutation.mutateAsync({ id: lote.id, data: formData })
      onClose()
      // Reset form
      setFormData({
        comprador: "",
        valor_total: 0,
        forma_pagamento: "",
        entrada: undefined,
        parcelamento: undefined,
        observacoes_venda: null,
      })
    } catch (error) {
      console.error("Erro ao registrar venda:", error)
    }
  }

  if (!lote) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Registrar Venda - Lote {lote.numero}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="info">
              <Typography variant="body2">
                Setor: <strong>{lote.setor?.nome || "-"}</strong>
              </Typography>
              {lote.area && (
                <Typography variant="body2">
                  Área: <strong>{lote.area.toLocaleString("pt-BR")} m²</strong>
                </Typography>
              )}
            </Alert>

            <TextField
              label="Comprador"
              value={formData.comprador}
              onChange={(e) => setFormData({ ...formData, comprador: e.target.value })}
              required
              fullWidth
            />

            <CurrencyTextField
              label="Valor Total"
              value={formData.valor_total || 0}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  valor_total: value,
                })
              }
              required
              fullWidth
            />

            <TextField
              label="Forma de Pagamento"
              value={formData.forma_pagamento}
              onChange={(e) => setFormData({ ...formData, forma_pagamento: e.target.value })}
              required
              fullWidth
              placeholder="Ex: À vista, Parcelado, Financiamento"
            />

            <CurrencyTextField
              label="Entrada (opcional)"
              value={formData.entrada || 0}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  entrada: value > 0 ? value : undefined,
                })
              }
              fullWidth
            />

            <TextField
              label="Parcelamento (opcional)"
              value={formData.parcelamento || ""}
              onChange={(e) => setFormData({ ...formData, parcelamento: e.target.value || undefined })}
              fullWidth
              placeholder="Ex: 10x de R$ 10.000,00"
            />

            <TextField
              label="Observações da Venda"
              value={formData.observacoes_venda || ""}
              onChange={(e) => setFormData({ ...formData, observacoes_venda: e.target.value || null })}
              multiline
              rows={3}
              fullWidth
              helperText="Informações adicionais sobre a venda (separadas das observações gerais do lote)"
            />

            {registrarVendaMutation.isError && (
              <Alert severity="error">Erro ao registrar venda. Tente novamente.</Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={registrarVendaMutation.isPending}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={registrarVendaMutation.isPending}>
            {registrarVendaMutation.isPending ? "Registrando..." : "Registrar Venda"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
