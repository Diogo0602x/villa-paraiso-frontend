"use client"

import { TextField, TextFieldProps, InputAdornment } from "@mui/material"
import { useState, useEffect, useRef } from "react"

interface CurrencyTextFieldProps extends Omit<TextFieldProps, "value" | "onChange" | "type"> {
  value: number
  onChange: (value: number) => void
}

export function CurrencyTextField({ value, onChange, ...props }: CurrencyTextFieldProps) {
  const [displayValue, setDisplayValue] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)
  const cursorPositionRef = useRef<number>(0)

  // Formatar número para string brasileira (1.234,56)
  const formatToDisplay = (num: number): string => {
    if (num === null || num === undefined || isNaN(num)) return ""
    if (num === 0) return ""
    return num.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Converter string brasileira para número
  const parseFromDisplay = (str: string): number => {
    if (!str || str.trim() === "") return 0
    // Remove tudo exceto números e vírgula
    const cleaned = str.replace(/[^\d,]/g, "").replace(/\./g, "").replace(",", ".")
    const parsed = Number.parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }

  useEffect(() => {
    setDisplayValue(formatToDisplay(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    cursorPositionRef.current = e.target.selectionStart || 0

    // Se estiver vazio, permite limpar
    if (inputValue === "" || inputValue === "R$") {
      setDisplayValue("")
      onChange(0)
      return
    }

    // Remove R$ e espaços, mantém apenas números e vírgula
    let cleaned = inputValue.replace(/R\$\s*/g, "").replace(/[^\d,]/g, "")

    // Garante apenas uma vírgula
    const commaCount = (cleaned.match(/,/g) || []).length
    if (commaCount > 1) {
      // Mantém apenas a primeira vírgula
      const firstCommaIndex = cleaned.indexOf(",")
      cleaned = cleaned.substring(0, firstCommaIndex + 1) + cleaned.substring(firstCommaIndex + 1).replace(/,/g, "")
    }

    // Limita a 2 casas decimais após a vírgula
    if (cleaned.includes(",")) {
      const parts = cleaned.split(",")
      if (parts[1] && parts[1].length > 2) {
        cleaned = parts[0] + "," + parts[1].substring(0, 2)
      }
    }

    // Converte para número
    const numValue = parseFromDisplay(cleaned)
    onChange(numValue)

    // Formata para exibição apenas se tiver valor válido
    if (cleaned === "" || cleaned === ",") {
      setDisplayValue(cleaned)
    } else {
      const formatted = formatToDisplay(numValue)
      setDisplayValue(formatted)
      
      // Restaura posição do cursor após formatação
      setTimeout(() => {
        if (inputRef.current) {
          const newPosition = Math.min(cursorPositionRef.current, formatted.length)
          inputRef.current.setSelectionRange(newPosition, newPosition)
        }
      }, 0)
    }
  }

  const handleBlur = () => {
    // Garante formatação completa ao perder o foco
    const formatted = formatToDisplay(value)
    setDisplayValue(formatted)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Ao focar, seleciona todo o texto se houver valor
    if (displayValue && displayValue !== "") {
      setTimeout(() => {
        e.target.select()
      }, 0)
    }
  }

  return (
    <TextField
      {...props}
      inputRef={(ref) => {
        inputRef.current = ref
        if (props.inputRef) {
          if (typeof props.inputRef === "function") {
            props.inputRef(ref)
          } else {
            props.inputRef.current = ref
          }
        }
      }}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      InputProps={{
        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        ...props.InputProps,
      }}
      inputProps={{
        inputMode: "decimal",
        ...props.inputProps,
      }}
    />
  )
}
