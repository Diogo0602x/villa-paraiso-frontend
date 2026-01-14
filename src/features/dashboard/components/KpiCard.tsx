"use client"

import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material"
import type { ReactNode } from "react"

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  color?: string
  loading?: boolean
}

export function KpiCard({ title, value, subtitle, icon, color = "primary.main", loading = false }: KpiCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="40%" />
            </Box>
            <Skeleton variant="circular" width={48} height={48} />
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={600}
              color={color}
              sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: 2,
                backgroundColor: `${color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: color,
                flexShrink: 0,
                ml: 1,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
