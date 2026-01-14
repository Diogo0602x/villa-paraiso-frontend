"use client"

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: "primary" | "secondary" | "error" | "warning" | "info" | "success"
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmColor = "primary",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 2, sm: 3 },
          maxWidth: { xs: "calc(100% - 32px)", sm: "xs" },
        },
      }}
    >
      <DialogTitle sx={{ fontSize: { xs: "1.125rem", sm: "1.25rem" }, p: { xs: 2, sm: 3 } }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <DialogContentText sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 3 }, gap: { xs: 1, sm: 2 }, flexDirection: { xs: "column-reverse", sm: "row" } }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          fullWidth={false}
          sx={{ width: { xs: "100%", sm: "auto" }, minHeight: { xs: 44, sm: 36 } }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
          fullWidth={false}
          sx={{ width: { xs: "100%", sm: "auto" }, minHeight: { xs: 44, sm: 36 } }}
        >
          {loading ? "Processando..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
