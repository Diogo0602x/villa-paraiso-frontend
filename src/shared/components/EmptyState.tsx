"use client"

import { Box, Typography, Button } from "@mui/material"
import InboxIcon from "@mui/icons-material/Inbox"

interface EmptyStateProps {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title = "Nenhum item encontrado",
  description = "Não há dados para exibir no momento.",
  action,
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
      py={4}
    >
      <InboxIcon sx={{ fontSize: 64, color: "text.disabled" }} />
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" textAlign="center">
        {description}
      </Typography>
      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  )
}
