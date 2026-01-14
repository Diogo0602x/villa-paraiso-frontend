"use client"

import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material"
import { ptBR } from "@mui/material/locale"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { useServerInsertedHTML } from "next/navigation"
import { useState, type ReactNode } from "react"

const theme = createTheme(
  {
    palette: {
      primary: {
        main: "#1D4F29",
        light: "#2d6b3d",
        dark: "#153a1f",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#1D4F29",
        light: "#2d6b3d",
        dark: "#153a1f",
        contrastText: "#ffffff",
      },
      success: {
        main: "#1D4F29",
        light: "#2d6b3d",
        dark: "#153a1f",
      },
      warning: {
        main: "#ff9800",
        light: "#ffb74d",
        dark: "#f57c00",
      },
      error: {
        main: "#f44336",
        light: "#e57373",
        dark: "#d32f2f",
      },
      background: {
        default: "#ffffff",
        paper: "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "2.5rem",
        fontWeight: 500,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 500,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 500,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 500,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 500,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: "#f5f5f5",
          },
        },
      },
    },
  },
  ptBR,
)

interface ThemeProviderProps {
  children: ReactNode
}

// This implementation is taken from https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [cache] = useState(() => {
    const cache = createCache({ key: "css", prepend: true })
    cache.compat = true
    return cache
  })

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(" "),
        }}
      />
    )
  })

  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  )
}
