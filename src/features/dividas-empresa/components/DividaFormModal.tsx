"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from "@mui/material"
import { useCreateDivida, useUpdateDivida } from "@/hooks/useDividas"
import { StatusDividaEmpresa, StatusDividaEmpresaLabels } from "@/enums"
import type { DividaEmpresa, DividaEmpresaCreate, DividaEmpresaUpdate, StatusDividaEmpresa as StatusDividaEmpresaType } from "@/types"
import { CurrencyTextField } from "@/shared/components"

interface DividaFormModalProps {
  open: boolean
  onClose: () => void
  divida?: DividaEmpresa | null
}

export function DividaFormModal({ open, onClose, divida }: DividaFormModalProps) {
  const isEditing = !!divida
  const createMutation = useCreateDivida()
  const updateMutation = useUpdateDivida()

  const [formData, setFormData] = useState<DividaEmpresaCreate | DividaEmpresaUpdate>({
    descricao: "",
    credor: "",
    valor_total: 0,
    valor_pago: 0,
    data_pagamento: null,
    status: StatusDividaEmpresa.PENDENTE,
    observacoes: null,
  })

  useEffect(() => {
    if (divida) {
      setFormData({
        descricao: divida.descricao,
        credor: divida.credor,
        valor_total: divida.valor_total,
        valor_pago: divida.valor_pago,
        data_pagamento: divida.data_pagamento,
        status: divida.status,
        observacoes: divida.observacoes,
      })
    } else {
      setFormData({
        descricao: "",
        credor: "",
        valor_total: 0,
        valor_pago: 0,
        data_pagamento: null,
        status: StatusDividaEmpresa.PENDENTE,
        observacoes: null,
      })
    }
  }, [divida, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && divida) {
        await updateMutation.mutateAsync({ id: divida.id, data: formData })
      } else {
        await createMutation.mutateAsync(formData as DividaEmpresaCreate)
      }
      onClose()
    } catch (error) {
      console.error("Erro ao salvar dívida:", error)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? "Editar Dívida" : "Nova Dívida"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Descrição"
              value={formData.descricao || ""}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
              fullWidth
            />

            <TextField
              label="Credor"
              value={formData.credor || ""}
              onChange={(e) => setFormData({ ...formData, credor: e.target.value })}
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

            <CurrencyTextField
              label="Valor Pago"
              value={formData.valor_pago || 0}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  valor_pago: value,
                })
              }
              fullWidth
            />

            <TextField
              label="Data de Pagamento"
              type="date"
              value={formData.data_pagamento || ""}
              onChange={(e) => setFormData({ ...formData, data_pagamento: e.target.value || null })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Observações"
              value={formData.observacoes || ""}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value || null })}
              multiline
              rows={3}
              fullWidth
            />

            {(createMutation.isError || updateMutation.isError) && (
              <Alert severity="error">Erro ao salvar dívida. Tente novamente.</Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
