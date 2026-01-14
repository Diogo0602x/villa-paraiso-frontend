"use client"

import { Box, Typography, Breadcrumbs, Link as MuiLink } from "@mui/material"
import Link from "next/link"
import type { ReactNode } from "react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  action?: ReactNode
}

export function PageHeader({ title, subtitle, breadcrumbs, action }: PageHeaderProps) {
  return (
    <Box mb={3}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {breadcrumbs.map((item, index) =>
            item.href ? (
              <MuiLink key={index} component={Link} href={item.href} color="inherit" underline="hover">
                {item.label}
              </MuiLink>
            ) : (
              <Typography key={index} color="text.primary">
                {item.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
    </Box>
  )
}
