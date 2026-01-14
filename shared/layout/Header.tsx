"use client"

import type React from "react"

import { AppBar, Toolbar, Box, IconButton, Avatar, Menu, MenuItem } from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { useState } from "react"
import { SidebarToggle, DRAWER_WIDTH } from "./Sidebar"

interface HeaderProps {
  onSidebarToggle: () => void
}

export function Header({ onSidebarToggle }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Toolbar>
        <SidebarToggle onToggle={onSidebarToggle} />
        <Box flexGrow={1} />
        <IconButton onClick={handleMenuOpen} size="small">
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
            <AccountCircleIcon />
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
          <MenuItem onClick={handleMenuClose}>Configurações</MenuItem>
          <MenuItem onClick={handleMenuClose}>Sair</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
