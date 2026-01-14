import { format, parseISO, differenceInDays, isBefore, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"

const DATE_FORMAT = "dd/MM/yyyy"
const DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm"
const API_DATE_FORMAT = "yyyy-MM-dd"

export function formatDate(date: string | Date): string {
  const parsedDate = typeof date === "string" ? parseISO(date) : date
  if (!isValid(parsedDate)) return "-"
  return format(parsedDate, DATE_FORMAT, { locale: ptBR })
}

export function formatDateTime(date: string | Date): string {
  const parsedDate = typeof date === "string" ? parseISO(date) : date
  if (!isValid(parsedDate)) return "-"
  return format(parsedDate, DATE_TIME_FORMAT, { locale: ptBR })
}

export function formatApiDate(date: Date): string {
  return format(date, API_DATE_FORMAT)
}

export function parseApiDate(date: string): Date {
  return parseISO(date)
}

export function calcularDiasAtraso(dataVencimento: string): number {
  const vencimento = parseISO(dataVencimento)
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  if (!isValid(vencimento)) return 0
  if (isBefore(hoje, vencimento) || format(hoje, API_DATE_FORMAT) === dataVencimento) {
    return 0
  }

  return differenceInDays(hoje, vencimento)
}

export function isVencido(dataVencimento: string): boolean {
  return calcularDiasAtraso(dataVencimento) > 0
}

export function isVenceHoje(dataVencimento: string): boolean {
  const vencimento = parseISO(dataVencimento)
  const hoje = new Date()
  return format(hoje, API_DATE_FORMAT) === format(vencimento, API_DATE_FORMAT)
}

export function getMonthName(month: number): string {
  const date = new Date(2024, month - 1, 1)
  return format(date, "MMMM", { locale: ptBR })
}
