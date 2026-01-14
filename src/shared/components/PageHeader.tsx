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
    <Box mb={{ xs: 2, md: 3 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
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
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={{ xs: 2, sm: 0 }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={600}
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              mt={0.5}
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && (
          <Box sx={{ width: { xs: "100%", sm: "auto" } }}>{action}</Box>
        )}
      </Box>
    </Box>
  )
}
