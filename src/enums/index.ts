// Status enums based on API contract (API_FRONTEND.md)

export const StatusLote = {
  DISPONIVEL: "disponivel",
  RESERVADO: "reservado",
  VENDIDO: "vendido",
  INDISPONIVEL: "indisponivel",
} as const

export type StatusLote = (typeof StatusLote)[keyof typeof StatusLote]

export const StatusParcela = {
  PENDENTE: "pendente",
  PAGO: "pago",
  ATRASADO: "atrasado",
} as const

export type StatusParcela = (typeof StatusParcela)[keyof typeof StatusParcela]

export const FormaPagamento = {
  DINHEIRO: "dinheiro",
  PIX: "pix",
  TRANSFERENCIA: "transferencia",
  CHEQUE: "cheque",
  OUTRO: "outro",
} as const

export type FormaPagamento = (typeof FormaPagamento)[keyof typeof FormaPagamento]

export const StatusDividaEmpresa = {
  PENDENTE: "pendente",
  PARCIALMENTE_PAGA: "parcialmente_paga",
  PAGA: "paga",
  CANCELADA: "cancelada",
} as const

export type StatusDividaEmpresa = (typeof StatusDividaEmpresa)[keyof typeof StatusDividaEmpresa]

// Label mappings for UI
export const StatusLoteLabels: Record<StatusLote, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  indisponivel: "Indisponível",
}

export const StatusParcelaLabels: Record<StatusParcela, string> = {
  pendente: "Pendente",
  pago: "Pago",
  atrasado: "Atrasado",
}

export const FormaPagamentoLabels: Record<FormaPagamento, string> = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  transferencia: "Transferência",
  cheque: "Cheque",
  outro: "Outro",
}

export const StatusDividaEmpresaLabels: Record<StatusDividaEmpresa, string> = {
  pendente: "Pendente",
  parcialmente_paga: "Parcialmente Paga",
  paga: "Paga",
  cancelada: "Cancelada",
}

// StatusDividaEmpresa é o mesmo que StatusDivida na documentação
export const StatusDividaEmpresaColors: Record<StatusDividaEmpresa, string> = {
  pendente: "#f44336",
  parcialmente_paga: "#ff9800",
  paga: "#4caf50",
  cancelada: "#9e9e9e",
}

// Color mappings for UI
export const StatusLoteColors: Record<StatusLote, string> = {
  disponivel: "#4caf50",
  reservado: "#ff9800",
  vendido: "#f44336",
  indisponivel: "#9e9e9e",
}

export const StatusParcelaColors: Record<StatusParcela, string> = {
  pendente: "#ff9800",
  pago: "#4caf50",
  atrasado: "#f44336",
}
