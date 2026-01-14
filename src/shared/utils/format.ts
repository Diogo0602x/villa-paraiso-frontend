const CURRENCY_LOCALE = "pt-BR"
const CURRENCY_OPTIONS: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "BRL",
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, CURRENCY_OPTIONS).format(value)
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatCpf(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "")
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }
  return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
}

export function formatArea(area: number | undefined | null): string {
  if (area === undefined || area === null) return "-"
  return `${formatNumber(area)} m²`
}
