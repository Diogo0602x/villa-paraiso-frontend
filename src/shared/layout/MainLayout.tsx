"use client"

import { useState } from "react"
import { Box, Toolbar } from "@mui/material"
import { Sidebar, DRAWER_WIDTH } from "./Sidebar"
import { Header } from "./Header"
import type { ReactNode } from "react"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: "background.default",
          minHeight: "100vh",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
