"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import MapIcon from "@mui/icons-material/Map"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ReceiptIcon from "@mui/icons-material/Receipt"
import PaymentIcon from "@mui/icons-material/Payment"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import AssessmentIcon from "@mui/icons-material/Assessment"
import SettingsIcon from "@mui/icons-material/Settings"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import PeopleIcon from "@mui/icons-material/People"
import LandscapeIcon from "@mui/icons-material/Landscape"

const DRAWER_WIDTH = 260

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
  { text: "Mapa", icon: <MapIcon />, href: "/mapa" },
  { text: "Setores", icon: <LandscapeIcon />, href: "/setores" },
  { text: "Lotes", icon: <LandscapeIcon />, href: "/lotes" },
  { text: "Dívidas Empresa", icon: <AccountBalanceIcon />, href: "/dividas-empresa" },
  { text: "Vendas", icon: <ShoppingCartIcon />, href: "/vendas" },
  { text: "Clientes", icon: <PeopleIcon />, href: "/clientes" },
  { text: "Recebíveis", icon: <ReceiptIcon />, href: "/recebiveis" },
  { text: "Pagamentos", icon: <PaymentIcon />, href: "/pagamentos" },
  { text: "Relatórios", icon: <AssessmentIcon />, href: "/relatorios" },
  { text: "Administração", icon: <SettingsIcon />, href: "/admin" },
]

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const drawerContent = (
    <>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            component="img"
            src="/logo_texto_verde.webp"
            alt="Villa Paraíso"
            sx={{
              height: 40,
              width: "auto",
            }}
          />
        </Box>
        {isMobile && (
          <IconButton onClick={onToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                }}
                onClick={isMobile ? onToggle : undefined}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "white" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </>
  )

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export function SidebarToggle({ onToggle }: { onToggle: () => void }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  if (!isMobile) return null

  return (
    <IconButton onClick={onToggle} sx={{ mr: 2 }}>
      <MenuIcon />
    </IconButton>
  )
}

export { DRAWER_WIDTH }
