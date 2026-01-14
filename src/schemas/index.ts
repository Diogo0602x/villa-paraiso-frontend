import { z } from "zod"
import { StatusLote, StatusParcela, FormaPagamento, StatusDividaEmpresa } from "@/enums"

// Coordenadas schema
export const coordenadasSchema = z.object({
  type: z.enum(["Polygon", "Point"]),
  coordinates: z.union([z.array(z.array(z.number())), z.array(z.array(z.array(z.number())))]),
})

// Setor schemas
export const setorSchema = z.object({
  id: z.number(),
  nome: z.string(),
  slug: z.string(),
  totalLotes: z.number(),
  lotesComAgua: z.number(),
  observacoes: z.string().optional().nullable(),
  caminhoPasta: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lotes: z.array(z.lazy(() => loteSchema)).optional(),
})

export const createSetorSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  observacoes: z.string().optional(),
  caminhoPasta: z.string().min(1, "Caminho da pasta é obrigatório"),
})

export const updateSetorSchema = createSetorSchema.partial()

// Lote schemas
export const loteSchema = z.object({
  id: z.number(),
  numero: z.string(),
  setorId: z.number(),
  setor: z.lazy(() => setorSchema).optional(),
  temAcessoAgua: z.boolean(),
  frenteBR060: z.boolean(),
  area: z.number().optional().nullable(),
  coordenadas: coordenadasSchema.optional().nullable(),
  status: z.enum([StatusLote.DISPONIVEL, StatusLote.RESERVADO, StatusLote.VENDIDO]),
  observacoes: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  venda: z
    .lazy(() => vendaSchema)
    .optional()
    .nullable(),
})

export const createLoteSchema = z.object({
  numero: z.string().min(1, "Número é obrigatório"),
  setorId: z.number().min(1, "Setor é obrigatório"),
  temAcessoAgua: z.boolean(),
  frenteBR060: z.boolean(),
  area: z.number().positive("Área deve ser positiva").optional(),
  coordenadas: coordenadasSchema.optional(),
  status: z.enum([StatusLote.DISPONIVEL, StatusLote.RESERVADO, StatusLote.VENDIDO]),
  observacoes: z.string().optional(),
})

export const updateLoteSchema = createLoteSchema.partial()

// Venda schemas
export const vendaSchema = z.object({
  id: z.number(),
  loteId: z.number(),
  lote: z.lazy(() => loteSchema).optional(),
  valorTotal: z.number(),
  valorEntrada: z.number(),
  quantidadeParcelas: z.number(),
  valorParcela: z.number(),
  dataVenda: z.string(),
  compradorNome: z.string(),
  compradorCpf: z.string().optional().nullable(),
  compradorTelefone: z.string().optional().nullable(),
  compradorEmail: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  parcelas: z.array(z.lazy(() => parcelaSchema)).optional(),
})

export const createVendaSchema = z.object({
  loteId: z.number().min(1, "Lote é obrigatório"),
  valorTotal: z.number().positive("Valor total deve ser positivo"),
  valorEntrada: z.number().min(0, "Valor de entrada não pode ser negativo"),
  quantidadeParcelas: z.number().int().min(1, "Quantidade de parcelas deve ser pelo menos 1"),
  dataVenda: z.string().min(1, "Data da venda é obrigatória"),
  compradorNome: z.string().min(1, "Nome do comprador é obrigatório"),
  compradorCpf: z.string().optional(),
  compradorTelefone: z.string().optional(),
  compradorEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  observacoes: z.string().optional(),
})

export const updateVendaSchema = z.object({
  compradorNome: z.string().min(1, "Nome do comprador é obrigatório").optional(),
  compradorCpf: z.string().optional(),
  compradorTelefone: z.string().optional(),
  compradorEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  observacoes: z.string().optional(),
})

// Parcela schemas
export const parcelaSchema = z.object({
  id: z.number(),
  vendaId: z.number(),
  venda: z.lazy(() => vendaSchema).optional(),
  numeroParcela: z.number(),
  valor: z.number(),
  dataVencimento: z.string(),
  dataPagamento: z.string().optional().nullable(),
  status: z.enum([StatusParcela.PENDENTE, StatusParcela.PAGO, StatusParcela.ATRASADO]),
  observacoes: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  pagamentos: z.array(z.lazy(() => pagamentoSchema)).optional(),
})

export const updateParcelaSchema = z.object({
  dataVencimento: z.string().optional(),
  observacoes: z.string().optional(),
})

// Pagamento schemas
export const pagamentoSchema = z.object({
  id: z.number(),
  parcelaId: z.number(),
  parcela: z.lazy(() => parcelaSchema).optional(),
  valor: z.number(),
  dataPagamento: z.string(),
  formaPagamento: z.enum([
    FormaPagamento.DINHEIRO,
    FormaPagamento.PIX,
    FormaPagamento.TRANSFERENCIA,
    FormaPagamento.CHEQUE,
    FormaPagamento.OUTRO,
  ]),
  observacoes: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const createPagamentoSchema = z.object({
  parcelaId: z.number().min(1, "Parcela é obrigatória"),
  valor: z.number().positive("Valor deve ser positivo"),
  dataPagamento: z.string().min(1, "Data do pagamento é obrigatória"),
  formaPagamento: z.enum([
    FormaPagamento.DINHEIRO,
    FormaPagamento.PIX,
    FormaPagamento.TRANSFERENCIA,
    FormaPagamento.CHEQUE,
    FormaPagamento.OUTRO,
  ]),
  observacoes: z.string().optional(),
})

export const updatePagamentoSchema = createPagamentoSchema.partial().omit({ parcelaId: true })

// Divida Empresa schemas
export const dividaEmpresaSchema = z.object({
  id: z.number(),
  descricao: z.string(),
  credor: z.string(),
  valorTotal: z.number(),
  valorPago: z.number(),
  dataVencimento: z.string().optional().nullable(),
  dataInicio: z.string(),
  status: z.enum([StatusDividaEmpresa.ATIVA, StatusDividaEmpresa.QUITADA, StatusDividaEmpresa.CANCELADA]),
  observacoes: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const createDividaEmpresaSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  credor: z.string().min(1, "Credor é obrigatório"),
  valorTotal: z.number().positive("Valor total deve ser positivo"),
  dataVencimento: z.string().optional(),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  observacoes: z.string().optional(),
})

export const updateDividaEmpresaSchema = createDividaEmpresaSchema.partial()

export const pagamentoDividaSchema = z.object({
  valor: z.number().positive("Valor deve ser positivo"),
})

// Pagination schema
export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

export function paginatedResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: z.array(dataSchema),
    meta: paginationMetaSchema,
  })
}

// Statistics schemas
export const estatisticasGeralSchema = z.object({
  totalLotes: z.number(),
  lotesDisponiveis: z.number(),
  lotesReservados: z.number(),
  lotesVendidos: z.number(),
  totalVendas: z.number(),
  valorTotalVendas: z.number(),
  valorTotalRecebido: z.number(),
  valorTotalPendente: z.number(),
})

export const faturamentoMensalSchema = z.object({
  mes: z.number(),
  ano: z.number(),
  valorEsperado: z.number(),
  valorRecebido: z.number(),
  valorPendente: z.number(),
})

export const estatisticasDividasSchema = z.object({
  totalDividasEmpresa: z.number(),
  totalParcelasAtrasadas: z.number(),
  valorDividasEmpresa: z.number(),
  valorParcelasAtrasadas: z.number(),
  parcelasAtrasadas: z.array(parcelaSchema).optional(),
})

// GeoJSON schemas
export const geoJsonFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: coordenadasSchema,
  properties: z.object({
    id: z.number(),
    numero: z.string(),
    setorSlug: z.string(),
    setorNome: z.string(),
    status: z.enum([StatusLote.DISPONIVEL, StatusLote.RESERVADO, StatusLote.VENDIDO]),
    temAcessoAgua: z.boolean(),
    frenteBR060: z.boolean(),
    area: z.number().optional().nullable(),
    compradorNome: z.string().optional().nullable(),
    valorTotal: z.number().optional().nullable(),
  }),
})

export const geoJsonCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(geoJsonFeatureSchema),
})

// API Error schema
export const apiErrorSchema = z.object({
  statusCode: z.number(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string(),
})
