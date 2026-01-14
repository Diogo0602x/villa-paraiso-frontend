# 📡 API Frontend - Villa Paraíso Backend

Documentação completa da API com tipagens TypeScript para uso no frontend.

## 📋 Índice

- [Tipos Base](#tipos-base)
- [Enums](#enums)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Setores](#setores)
  - [Lotes](#lotes)
  - [Dívidas](#dívidas)
  - [Resumo](#resumo)

---

## Tipos Base

```typescript
// Enums
export enum StatusLote {
  DISPONIVEL = "disponivel",
  RESERVADO = "reservado",
  VENDIDO = "vendido",
  INDISPONIVEL = "indisponivel"
}

export enum StatusDividaEmpresa {
  PENDENTE = "pendente",
  PARCIALMENTE_PAGA = "parcialmente_paga",
  PAGA = "paga",
  CANCELADA = "cancelada"
}

// Setor
export interface Setor {
  id: string;
  nome: string;
  slug: string;
  total_lotes: number;
  lotes_com_agua: number;
  cor: string | null;
  observacoes: string | null;
  caminho_pasta: string | null;
}

// Lote
export interface Lote {
  id: string;
  numero: string;
  setor_id: string;
  status: StatusLote;
  tem_acesso_agua: boolean;
  frente_br060: boolean;
  area: number | null;
  observacoes: string | null;
  // Campos de venda (estruturados)
  comprador: string | null;
  valor_total_venda: number | null;
  entrada_venda: number | null;
  parcelamento_venda: string | null;
  observacoes_venda: string | null;
  // Relacionamento (sempre incluído)
  setor: Setor | null;
}

// Dívida Empresa
export interface DividaEmpresa {
  id: string;
  descricao: string;
  credor: string;
  valor_total: number; // Decimal convertido para number
  valor_pago: number; // Decimal convertido para number
  data_pagamento: string | null; // ISO date string (YYYY-MM-DD)
  status: StatusDividaEmpresa;
  observacoes: string | null;
}

// Resumo de Lotes por Status
export interface ResumoLotesStatus {
  total: number;
  disponiveis: number;
  reservados: number;
  vendidos: number;
  indisponiveis: number;
}

// Resumo Financeiro de Dívidas
export interface ResumoDividas {
  valor_total: number;
  valor_pago: number;
  valor_a_pagar: number;
  total_dividas: number;
  dividas_pendentes: number;
  dividas_parciais: number;
  dividas_pagas: number;
  percentual_pago: number;
}

// Resumo Geral
export interface ResumoGeral {
  lotes: {
    total: number;
    disponiveis: number;
    vendidos: number;
    com_agua: number;
    percentual_vendido: number;
  };
  setores: {
    total: number;
  };
  dividas: {
    valor_total: number;
    valor_pago: number;
    valor_a_pagar: number;
    total_dividas: number;
  };
}

// Health Check
export interface HealthCheck {
  message: string;
  status: "ok";
}

export interface HealthCheckDetailed {
  status: "healthy";
  app: string;
  version: string;
}
```

---

## Endpoints

### Base URL

```typescript
const BASE_URL = "http://localhost:8000"; // ou sua URL de produção
```

---

## Health Check

### `GET /`

**Descrição:** Health check básico da API

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
HealthCheck
// {
//   message: "Villa Paraíso Backend v1.0.0",
//   status: "ok"
// }
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/`);
const data: HealthCheck = await response.json();
```

---

### `GET /health`

**Descrição:** Health check detalhado

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
HealthCheckDetailed
// {
//   status: "healthy",
//   app: "Villa Paraíso Backend",
//   version: "1.0.0"
// }
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/health`);
const data: HealthCheckDetailed = await response.json();
```

---

## Setores

### `GET /api/setores`

**Descrição:** Lista todos os setores com contadores atualizados dinamicamente

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
Setor[]
// [
//   {
//     id: "uuid",
//     nome: "Portal do Cerrado",
//     slug: "setor-portal-do-cerrado",
//     total_lotes: 9,
//     lotes_com_agua: 5,
//     cor: "#F2DACE",
//     observacoes: null,
//     caminho_pasta: null
//   },
//   ...
// ]
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/api/setores`);
const setores: Setor[] = await response.json();
```

---

### `GET /api/setores/slug/{slug}`

**Descrição:** Busca um setor pelo slug

**Request:**
```typescript
// Path parameter
slug: string
// Exemplos: "setor-portal-do-cerrado", "setor-vale-do-pequi"
```

**Response:**
```typescript
Setor
```

**Exemplo de uso:**
```typescript
const slug = "setor-portal-do-cerrado";
const response = await fetch(`${BASE_URL}/api/setores/slug/${slug}`);
const setor: Setor = await response.json();
```

---

### `GET /api/setores/{setor_id}`

**Descrição:** Busca um setor pelo ID (UUID)

**Request:**
```typescript
// Path parameter
setor_id: string // UUID
```

**Response:**
```typescript
Setor
```

**Exemplo de uso:**
```typescript
const setorId = "123e4567-e89b-12d3-a456-426614174000";
const response = await fetch(`${BASE_URL}/api/setores/${setorId}`);
const setor: Setor = await response.json();
```

---

## Lotes

### `GET /api/lotes`

**Descrição:** Lista todos os lotes com filtros opcionais

**Request:**
```typescript
// Query parameters (todos opcionais)
interface GetLotesParams {
  setor_id?: string;        // UUID do setor
  setor_slug?: string;      // Slug do setor
  numero?: string;          // Busca parcial por número
  status?: StatusLote;      // Filtrar por status
  tem_acesso_agua?: boolean; // Filtrar por acesso à água
  frente_br060?: boolean;    // Filtrar por frente BR-060
}
```

**Response:**
```typescript
Lote[] // Array de lotes, cada lote sempre inclui setor completo
// [
//   {
//     id: "uuid",
//     numero: "001",
//     setor_id: "uuid",
//     status: StatusLote.DISPONIVEL,
//     tem_acesso_agua: true,
//     frente_br060: false,
//     area: 500,
//     observacoes: null,
//     comprador: null,
//     valor_total_venda: null,
//     entrada_venda: null,
//     parcelamento_venda: null,
//     observacoes_venda: null,
//     setor: {
//       id: "uuid",
//       nome: "Portal do Cerrado",
//       slug: "setor-portal-do-cerrado",
//       ...
//     }
//   },
//   ...
// ]
```

**Exemplos de uso:**

```typescript
// Listar todos os lotes
const response1 = await fetch(`${BASE_URL}/api/lotes`);
const todosLotes: Lote[] = await response1.json();

// Filtrar por status
const params1 = new URLSearchParams({ status: StatusLote.VENDIDO });
const response2 = await fetch(`${BASE_URL}/api/lotes?${params1}`);
const lotesVendidos: Lote[] = await response2.json();

// Filtrar por setor (slug)
const params2 = new URLSearchParams({ 
  setor_slug: "setor-portal-do-cerrado" 
});
const response3 = await fetch(`${BASE_URL}/api/lotes?${params2}`);
const lotesSetor: Lote[] = await response3.json();

// Múltiplos filtros
const params3 = new URLSearchParams({
  setor_slug: "setor-portal-do-cerrado",
  status: StatusLote.DISPONIVEL,
  tem_acesso_agua: "true"
});
const response4 = await fetch(`${BASE_URL}/api/lotes?${params4}`);
const lotesFiltrados: Lote[] = await response4.json();

// Buscar por número
const params4 = new URLSearchParams({ numero: "136" });
const response5 = await fetch(`${BASE_URL}/api/lotes?${params5}`);
const lotesNumero: Lote[] = await response5.json();
```

**Função helper:**
```typescript
async function getLotes(params?: GetLotesParams): Promise<Lote[]> {
  const searchParams = new URLSearchParams();
  
  if (params?.setor_id) searchParams.append("setor_id", params.setor_id);
  if (params?.setor_slug) searchParams.append("setor_slug", params.setor_slug);
  if (params?.numero) searchParams.append("numero", params.numero);
  if (params?.status) searchParams.append("status", params.status);
  if (params?.tem_acesso_agua !== undefined) {
    searchParams.append("tem_acesso_agua", params.tem_acesso_agua.toString());
  }
  if (params?.frente_br060 !== undefined) {
    searchParams.append("frente_br060", params.frente_br060.toString());
  }
  
  const queryString = searchParams.toString();
  const url = `${BASE_URL}/api/lotes${queryString ? `?${queryString}` : ""}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  return await response.json();
}
```

---

### `GET /api/lotes/resumo/status`

**Descrição:** Retorna resumo de lotes agrupados por status

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
ResumoLotesStatus
// {
//   total: 136,
//   disponiveis: 120,
//   reservados: 5,
//   vendidos: 10,
//   indisponiveis: 1
// }
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/api/lotes/resumo/status`);
const resumo: ResumoLotesStatus = await response.json();
```

---

### `GET /api/lotes/{lote_id}`

**Descrição:** Busca um lote por ID (UUID) ou número. Tenta ID primeiro, depois número.

**Request:**
```typescript
// Path parameter
lote_id: string // UUID ou número do lote (ex: "001", "136")
```

**Response:**
```typescript
Lote // Inclui setor quando disponível
```

**Exemplos de uso:**
```typescript
// Por ID (UUID)
const loteId = "123e4567-e89b-12d3-a456-426614174000";
const response1 = await fetch(`${BASE_URL}/api/lotes/${loteId}`);
const lote1: Lote = await response1.json();

// Por número
const response2 = await fetch(`${BASE_URL}/api/lotes/001`);
const lote2: Lote = await response2.json();

// Por número sem zeros
const response3 = await fetch(`${BASE_URL}/api/lotes/136`);
const lote3: Lote = await response3.json();
```

---

## Dívidas

### `GET /api/dividas`

**Descrição:** Lista todas as dívidas com filtros opcionais

**Request:**
```typescript
// Query parameters (todos opcionais)
interface GetDividasParams {
  status?: StatusDividaEmpresa; // Filtrar por status
  credor?: string;               // Busca parcial por credor (case-insensitive)
}
```

**Response:**
```typescript
DividaEmpresa[] // Ordenadas por valor_total (maior para menor)
// [
//   {
//     id: "uuid",
//     descricao: "Empréstimo Bradesco",
//     credor: "Bradesco",
//     valor_total: 1523456.78,
//     valor_pago: 0,
//     data_pagamento: null,
//     status: StatusDividaEmpresa.PENDENTE,
//     observacoes: null
//   },
//   ...
// ]
```

**Exemplos de uso:**

```typescript
// Listar todas as dívidas
const response1 = await fetch(`${BASE_URL}/api/dividas`);
const todasDividas: DividaEmpresa[] = await response1.json();

// Filtrar por status
const params1 = new URLSearchParams({ 
  status: StatusDividaEmpresa.PENDENTE 
});
const response2 = await fetch(`${BASE_URL}/api/dividas?${params1}`);
const dividasPendentes: DividaEmpresa[] = await response2.json();

// Buscar por credor
const params2 = new URLSearchParams({ credor: "Bradesco" });
const response3 = await fetch(`${BASE_URL}/api/dividas?${params3}`);
const dividasBradesco: DividaEmpresa[] = await response3.json();

// Combinar filtros
const params3 = new URLSearchParams({
  status: StatusDividaEmpresa.PENDENTE,
  credor: "Caixa"
});
const response4 = await fetch(`${BASE_URL}/api/dividas?${params4}`);
const dividasFiltradas: DividaEmpresa[] = await response4.json();
```

**Função helper:**
```typescript
async function getDividas(params?: GetDividasParams): Promise<DividaEmpresa[]> {
  const searchParams = new URLSearchParams();
  
  if (params?.status) searchParams.append("status", params.status);
  if (params?.credor) searchParams.append("credor", params.credor);
  
  const queryString = searchParams.toString();
  const url = `${BASE_URL}/api/dividas${queryString ? `?${queryString}` : ""}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  return await response.json();
}
```

---

### `GET /api/dividas/resumo/total`

**Descrição:** Retorna resumo financeiro completo de todas as dívidas

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
ResumoDividas
// {
//   valor_total: 5403937.24,
//   valor_pago: 0.0,
//   valor_a_pagar: 5403937.24,
//   total_dividas: 4,
//   dividas_pendentes: 4,
//   dividas_parciais: 0,
//   dividas_pagas: 0,
//   percentual_pago: 0.0
// }
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/api/dividas/resumo/total`);
const resumo: ResumoDividas = await response.json();
```

---

### `GET /api/dividas/{divida_id}`

**Descrição:** Busca uma dívida específica pelo ID (UUID)

**Request:**
```typescript
// Path parameter
divida_id: string // UUID
```

**Response:**
```typescript
DividaEmpresa
```

**Exemplo de uso:**
```typescript
const dividaId = "123e4567-e89b-12d3-a456-426614174000";
const response = await fetch(`${BASE_URL}/api/dividas/${dividaId}`);
const divida: DividaEmpresa = await response.json();
```

---

## Resumo

### `GET /api/resumo/geral`

**Descrição:** Retorna resumo geral completo do sistema

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
ResumoGeral
// {
//   lotes: {
//     total: 136,
//     disponiveis: 120,
//     vendidos: 10,
//     com_agua: 85,
//     percentual_vendido: 7.35
//   },
//   setores: {
//     total: 7
//   },
//   dividas: {
//     valor_total: 5403937.24,
//     valor_pago: 0.0,
//     valor_a_pagar: 5403937.24,
//     total_dividas: 4
//   }
// }
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/api/resumo/geral`);
const resumo: ResumoGeral = await response.json();
```

---

## 📦 Arquivo Completo de Tipos

Crie um arquivo `api-types.ts` com todos os tipos:

```typescript
// api-types.ts

// Enums
export enum StatusLote {
  DISPONIVEL = "disponivel",
  RESERVADO = "reservado",
  VENDIDO = "vendido",
  INDISPONIVEL = "indisponivel"
}

export enum StatusDividaEmpresa {
  PENDENTE = "pendente",
  PARCIALMENTE_PAGA = "parcialmente_paga",
  PAGA = "paga",
  CANCELADA = "cancelada"
}

// Interfaces
export interface Setor {
  id: string;
  nome: string;
  slug: string;
  total_lotes: number;
  lotes_com_agua: number;
  cor: string | null;
  observacoes: string | null;
  caminho_pasta: string | null;
}

export interface Lote {
  id: string;
  numero: string;
  setor_id: string;
  status: StatusLote;
  tem_acesso_agua: boolean;
  frente_br060: boolean;
  area: number | null;
  observacoes: string | null;
  // Campos de venda (estruturados)
  comprador: string | null;
  valor_total_venda: number | null;
  entrada_venda: number | null;
  parcelamento_venda: string | null;
  observacoes_venda: string | null;
  // Relacionamento (sempre incluído)
  setor: Setor | null;
}

export interface DividaEmpresa {
  id: string;
  descricao: string;
  credor: string;
  valor_total: number;
  valor_pago: number;
  data_pagamento: string | null;
  status: StatusDividaEmpresa;
  observacoes: string | null;
}

export interface ResumoLotesStatus {
  total: number;
  disponiveis: number;
  reservados: number;
  vendidos: number;
  indisponiveis: number;
}

export interface ResumoDividas {
  valor_total: number;
  valor_pago: number;
  valor_a_pagar: number;
  total_dividas: number;
  dividas_pendentes: number;
  dividas_parciais: number;
  dividas_pagas: number;
  percentual_pago: number;
}

export interface ResumoGeral {
  lotes: {
    total: number;
    disponiveis: number;
    vendidos: number;
    com_agua: number;
    percentual_vendido: number;
  };
  setores: {
    total: number;
  };
  dividas: {
    valor_total: number;
    valor_pago: number;
    valor_a_pagar: number;
    total_dividas: number;
  };
}

export interface HealthCheck {
  message: string;
  status: "ok";
}

export interface HealthCheckDetailed {
  status: "healthy";
  app: string;
  version: string;
}

// Query Parameters
export interface GetLotesParams {
  setor_id?: string;
  setor_slug?: string;
  numero?: string;
  status?: StatusLote;
  tem_acesso_agua?: boolean;
  frente_br060?: boolean;
}

export interface GetDividasParams {
  status?: StatusDividaEmpresa;
  credor?: string;
}
```

---

## 🔧 Arquivo de API Client

Crie um arquivo `api-client.ts` com funções helper:

```typescript
// api-client.ts
import type {
  Setor,
  Lote,
  DividaEmpresa,
  ResumoLotesStatus,
  ResumoDividas,
  ResumoGeral,
  HealthCheck,
  HealthCheckDetailed,
  GetLotesParams,
  GetDividasParams
} from './api-types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper genérico
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Health Check
export const healthCheck = {
  root: (): Promise<HealthCheck> => fetchAPI('/'),
  detailed: (): Promise<HealthCheckDetailed> => fetchAPI('/health'),
};

// Setores
export const setores = {
  list: (): Promise<Setor[]> => fetchAPI('/api/setores'),
  getBySlug: (slug: string): Promise<Setor> => fetchAPI(`/api/setores/slug/${slug}`),
  getById: (id: string): Promise<Setor> => fetchAPI(`/api/setores/${id}`),
};

// Lotes
export const lotes = {
  list: (params?: GetLotesParams): Promise<Lote[]> => {
    const searchParams = new URLSearchParams();
    if (params?.setor_id) searchParams.append('setor_id', params.setor_id);
    if (params?.setor_slug) searchParams.append('setor_slug', params.setor_slug);
    if (params?.numero) searchParams.append('numero', params.numero);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.tem_acesso_agua !== undefined) {
      searchParams.append('tem_acesso_agua', params.tem_acesso_agua.toString());
    }
    if (params?.frente_br060 !== undefined) {
      searchParams.append('frente_br060', params.frente_br060.toString());
    }
    const queryString = searchParams.toString();
    return fetchAPI(`/api/lotes${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string): Promise<Lote> => fetchAPI(`/api/lotes/${id}`),
  resumoStatus: (): Promise<ResumoLotesStatus> => fetchAPI('/api/lotes/resumo/status'),
};

// Dívidas
export const dividas = {
  list: (params?: GetDividasParams): Promise<DividaEmpresa[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.credor) searchParams.append('credor', params.credor);
    const queryString = searchParams.toString();
    return fetchAPI(`/api/dividas${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string): Promise<DividaEmpresa> => fetchAPI(`/api/dividas/${id}`),
  resumoTotal: (): Promise<ResumoDividas> => fetchAPI('/api/dividas/resumo/total'),
};

// Resumo
export const resumo = {
  geral: (): Promise<ResumoGeral> => fetchAPI('/api/resumo/geral'),
};

// Export default
export default {
  healthCheck,
  setores,
  lotes,
  dividas,
  resumo,
};
```

---

## 📝 Exemplos de Uso no Frontend

### React/Next.js

```typescript
import { useState, useEffect } from 'react';
import { setores, lotes, dividas, resumo } from './api-client';
import type { Setor, Lote, DividaEmpresa, ResumoGeral } from './api-types';

function Dashboard() {
  const [resumoGeral, setResumoGeral] = useState<ResumoGeral | null>(null);

  useEffect(() => {
    resumo.geral().then(setResumoGeral);
  }, []);

  if (!resumoGeral) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total de Lotes: {resumoGeral.lotes.total}</p>
      <p>Lotes Vendidos: {resumoGeral.lotes.vendidos}</p>
      <p>Dívidas Totais: R$ {resumoGeral.dividas.valor_total.toLocaleString('pt-BR')}</p>
    </div>
  );
}
```

### Vue.js

```typescript
import { ref, onMounted } from 'vue';
import { setores, lotes } from './api-client';
import type { Setor, Lote } from './api-types';

export default {
  setup() {
    const setoresList = ref<Setor[]>([]);
    const lotesList = ref<Lote[]>([]);

    onMounted(async () => {
      setoresList.value = await setores.list();
      lotesList.value = await lotes.list({ status: 'vendido' });
    });

    return { setoresList, lotesList };
  },
};
```

---

## ⚠️ Notas Importantes

1. **Decimais**: Valores decimais do backend (Python `Decimal`) são convertidos para `number` no JSON
2. **Datas**: Datas são retornadas como strings ISO (YYYY-MM-DD)
3. **Relacionamentos**: O campo `setor` em `Lote` sempre está presente e completo em todas as respostas
4. **Filtros**: Todos os parâmetros de query são opcionais e podem ser combinados
5. **Erros**: Endpoints retornam 404 quando o recurso não é encontrado, 500 para erros internos

---

## 🔗 URLs de Produção

Atualize a `BASE_URL` conforme o ambiente:

```typescript
const BASE_URL = 
  process.env.NODE_ENV# 📡 API Frontend - Villa Paraíso Backend

Documentação completa da API com tipagens TypeScript para uso no frontend.

## 📋 Índice

- [Tipos Base](#tipos-base)
- [Enums](#enums)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Setores](#setores)
  - [Lotes](#lotes)
  - [Dívidas](#dívidas)
  - [Resumo](#resumo)

---

## Tipos Base

```typescript
// Enums
export enum StatusLote {
  DISPONIVEL = "disponivel",
  RESERVADO = "reservado",
  VENDIDO = "vendido",
  INDISPONIVEL = "indisponivel"
}

export enum StatusDividaEmpresa {
  PENDENTE = "pendente",
  PARCIALMENTE_PAGA = "parcialmente_paga",
  PAGA = "paga",
  CANCELADA = "cancelada"
}

// Setor
export interface Setor {
  id: string;
  nome: string;
  slug: string;
  total_lotes: number;
  lotes_com_agua: number;
  cor: string | null;
  observacoes: string | null;
  caminho_pasta: string | null;
}

// Lote
export interface Lote {
  id: string;
  numero: string;
  setor_id: string;
  status: StatusLote;
  tem_acesso_agua: boolean;
  frente_br060: boolean;
  area: number | null;
  observacoes: string | null;
  // Campos de venda (estruturados)
  comprador: string | null;
  valor_total_venda: number | null;
  entrada_venda: number | null;
  parcelamento_venda: string | null;
  observacoes_venda: string | null;
  // Relacionamento (sempre incluído)
  setor: Setor | null;
}

export interface LoteCreate {
  numero: string;
  setor_id: string;
  status?: StatusLote;
  tem_acesso_agua?: boolean;
  frente_br060?: boolean;
  area?: number | null;
  observacoes?: string | null;
}

export interface LoteUpdate {
  numero?: string;
  setor_id?: string;
  status?: StatusLote;
  tem_acesso_agua?: boolean;
  frente_br060?: boolean;
  area?: number | null;
  observacoes?: string | null;
}

export interface LoteVenda {
  comprador: string;
  valor_total: number;
  forma_pagamento: string;
  entrada?: number;
  parcelamento?: string;
  observacoes_venda?: string | null;
}

// Dívida Empresa
export interface DividaEmpresa {
  id: string;
  descricao: string;
  credor: string;
  valor_total: number; // Decimal convertido para number
  valor_pago: number; // Decimal convertido para number
  data_pagamento: string | null; // ISO date string (YYYY-MM-DD)
  status: StatusDividaEmpresa;
  observacoes: string | null;
}

export interface DividaEmpresaCreate {
  descricao: string;
  credor: string;
  valor_total: number;
  valor_pago?: number;
  data_pagamento?: string | null; // YYYY-MM-DD
  status?: StatusDividaEmpresa;
  observacoes?: string | null;
}

export interface DividaEmpresaUpdate {
  descricao?: string;
  credor?: string;
  valor_total?: number;
  valor_pago?: number;
  data_pagamento?: string | null; // YYYY-MM-DD
  status?: StatusDividaEmpresa;
  observacoes?: string | null;
}

// Resumo de Lotes por Status
export interface ResumoLotesStatus {
  total: number;
  disponiveis: number;
  reservados: number;
  vendidos: number;
  indisponiveis: number;
}

// Resumo Financeiro de Dívidas
export interface ResumoDividas {
  valor_total: number;
  valor_pago: number;
  valor_a_pagar: number;
  total_dividas: number;
  dividas_pendentes: number;
  dividas_parciais: number;
  dividas_pagas: number;
  percentual_pago: number;
}

// Resumo Geral
export interface ResumoGeral {
  lotes: {
    total: number;
    disponiveis: number;
    vendidos: number;
    com_agua: number;
    percentual_vendido: number;
  };
  setores: {
    total: number;
  };
  dividas: {
    valor_total: number;
    valor_pago: number;
    valor_a_pagar: number;
    total_dividas: number;
  };
}

// Health Check
export interface HealthCheck {
  message: string;
  status: "ok";
}

export interface HealthCheckDetailed {
  status: "healthy";
  app: string;
  version: string;
}
```

---

## Endpoints

### Base URL

```typescript
const BASE_URL = "http://localhost:8000"; // ou sua URL de produção
```

---

## Health Check

### `GET /`

**Descrição:** Health check básico da API

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
HealthCheck
// {
//   message: "Villa Paraíso Backend v1.0.0",
//   status: "ok"
// }
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/`);
const data: HealthCheck = await response.json();
```

---

### `GET /health`

**Descrição:** Health check detalhado

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
HealthCheckDetailed
// {
//   status: "healthy",
//   app: "Villa Paraíso Backend",
//   version: "1.0.0"
// }
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/health`);
const data: HealthCheckDetailed = await response.json();
```

---

## Setores

### `GET /api/setores`

**Descrição:** Lista todos os setores com contadores atualizados dinamicamente

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
Setor[]
// [
//   {
//     id: "uuid",
//     nome: "Portal do Cerrado",
//     slug: "setor-portal-do-cerrado",
//     total_lotes: 9,
//     lotes_com_agua: 5,
//     cor: "#F2DACE",
//     observacoes: null,
//     caminho_pasta: null
//   },
//   ...
// ]
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/api/setores`);
const setores: Setor[] = await response.json();
```

---

### `GET /api/setores/slug/{slug}`

**Descrição:** Busca um setor pelo slug

**Request:**
```typescript
// Path parameter
slug: string
// Exemplos: "setor-portal-do-cerrado", "setor-vale-do-pequi"
```

**Response:**
```typescript
Setor
```

**Exemplo de uso:**
```typescript
const slug = "setor-portal-do-cerrado";
const response = await fetch(`${BASE_URL}/api/setores/slug/${slug}`);
const setor: Setor = await response.json();
```

---

### `GET /api/setores/{setor_id}`

**Descrição:** Busca um setor pelo ID (UUID)

**Request:**
```typescript
// Path parameter
setor_id: string // UUID
```

**Response:**
```typescript
Setor
```

**Exemplo de uso:**
```typescript
const setorId = "123e4567-e89b-12d3-a456-426614174000";
const response = await fetch(`${BASE_URL}/api/setores/${setorId}`);
const setor: Setor = await response.json();
```

---

## Lotes

### `GET /api/lotes`

**Descrição:** Lista todos os lotes com filtros opcionais

**Request:**
```typescript
// Query parameters (todos opcionais)
interface GetLotesParams {
  setor_id?: string;        // UUID do setor
  setor_slug?: string;      // Slug do setor
  numero?: string;          // Busca parcial por número
  status?: StatusLote;      // Filtrar por status
  tem_acesso_agua?: boolean; // Filtrar por acesso à água
  frente_br060?: boolean;    // Filtrar por frente BR-060
}
```

**Response:**
```typescript
Lote[] // Array de lotes, cada lote sempre inclui setor completo
// [
//   {
//     id: "uuid",
//     numero: "001",
//     setor_id: "uuid",
//     status: StatusLote.DISPONIVEL,
//     tem_acesso_agua: true,
//     frente_br060: false,
//     area: 500,
//     observacoes: null,
//     comprador: null,
//     valor_total_venda: null,
//     entrada_venda: null,
//     parcelamento_venda: null,
//     observacoes_venda: null,
//     setor: {
//       id: "uuid",
//       nome: "Portal do Cerrado",
//       slug: "setor-portal-do-cerrado",
//       ...
//     }
//   },
//   ...
// ]
```

**Exemplos de uso:**

```typescript
// Listar todos os lotes
const response1 = await fetch(`${BASE_URL}/api/lotes`);
const todosLotes: Lote[] = await response1.json();

// Filtrar por status
const params1 = new URLSearchParams({ status: StatusLote.VENDIDO });
const response2 = await fetch(`${BASE_URL}/api/lotes?${params1}`);
const lotesVendidos: Lote[] = await response2.json();

// Filtrar por setor (slug)
const params2 = new URLSearchParams({ 
  setor_slug: "setor-portal-do-cerrado" 
});
const response3 = await fetch(`${BASE_URL}/api/lotes?${params2}`);
const lotesSetor: Lote[] = await response3.json();

// Múltiplos filtros
const params3 = new URLSearchParams({
  setor_slug: "setor-portal-do-cerrado",
  status: StatusLote.DISPONIVEL,
  tem_acesso_agua: "true"
});
const response4 = await fetch(`${BASE_URL}/api/lotes?${params4}`);
const lotesFiltrados: Lote[] = await response4.json();

// Buscar por número
const params4 = new URLSearchParams({ numero: "136" });
const response5 = await fetch(`${BASE_URL}/api/lotes?${params5}`);
const lotesNumero: Lote[] = await response5.json();
```

**Função helper:**
```typescript
async function getLotes(params?: GetLotesParams): Promise<Lote[]> {
  const searchParams = new URLSearchParams();
  
  if (params?.setor_id) searchParams.append("setor_id", params.setor_id);
  if (params?.setor_slug) searchParams.append("setor_slug", params.setor_slug);
  if (params?.numero) searchParams.append("numero", params.numero);
  if (params?.status) searchParams.append("status", params.status);
  if (params?.tem_acesso_agua !== undefined) {
    searchParams.append("tem_acesso_agua", params.tem_acesso_agua.toString());
  }
  if (params?.frente_br060 !== undefined) {
    searchParams.append("frente_br060", params.frente_br060.toString());
  }
  
  const queryString = searchParams.toString();
  const url = `${BASE_URL}/api/lotes${queryString ? `?${queryString}` : ""}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  return await response.json();
}
```

---

### `GET /api/lotes/resumo/status`

**Descrição:** Retorna resumo de lotes agrupados por status

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
ResumoLotesStatus
// {
//   total: 136,
//   disponiveis: 120,
//   reservados: 5,
//   vendidos: 10,
//   indisponiveis: 1
// }
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/api/lotes/resumo/status`);
const resumo: ResumoLotesStatus = await response.json();
```

---

### `GET /api/lotes/{lote_id}`

**Descrição:** Busca um lote por ID (UUID) ou número. Tenta ID primeiro, depois número.

**Request:**
```typescript
// Path parameter
lote_id: string // UUID ou número do lote (ex: "001", "136")
```

**Response:**
```typescript
Lote // Inclui setor quando disponível
```

**Exemplos de uso:**
```typescript
// Por ID (UUID)
const loteId = "123e4567-e89b-12d3-a456-426614174000";
const response1 = await fetch(`${BASE_URL}/api/lotes/${loteId}`);
const lote1: Lote = await response1.json();

// Por número
const response2 = await fetch(`${BASE_URL}/api/lotes/001`);
const lote2: Lote = await response2.json();

// Por número sem zeros
const response3 = await fetch(`${BASE_URL}/api/lotes/136`);
const lote3: Lote = await response3.json();
```

---

### `POST /api/lotes`

**Descrição:** Cria um novo lote no sistema

**Request:**
```typescript
interface LoteCreate {
  numero: string;
  setor_id: string;
  status?: StatusLote; // Padrão: DISPONIVEL
  tem_acesso_agua?: boolean; // Padrão: false
  frente_br060?: boolean; // Padrão: false
  area?: number | null;
  observacoes?: string | null;
}
```

**Response:**
```typescript
Lote // Lote criado com ID gerado automaticamente
```

**Exemplo de uso:**
```typescript
const novoLote = {
  numero: "999",
  setor_id: "uuid-do-setor",
  status: StatusLote.DISPONIVEL,
  tem_acesso_agua: true,
  frente_br060: false,
  area: 500,
  observacoes: "Lote novo"
};

const response = await fetch(`${BASE_URL}/api/lotes`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(novoLote)
});
const lote: Lote = await response.json();
```

---

### `PUT /api/lotes/{lote_id}`

**Descrição:** Atualiza um lote existente

**Request:**
```typescript
interface LoteUpdate {
  numero?: string;
  setor_id?: string;
  status?: StatusLote;
  tem_acesso_agua?: boolean;
  frente_br060?: boolean;
  area?: number | null;
  observacoes?: string | null;
}
```

**Response:**
```typescript
Lote // Lote atualizado
```

**Exemplo de uso:**
```typescript
const atualizacao = {
  status: StatusLote.RESERVADO,
  observacoes: "Lote reservado"
};

const response = await fetch(`${BASE_URL}/api/lotes/${loteId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(atualizacao)
});
const lote: Lote = await response.json();
```

---

### `DELETE /api/lotes/{lote_id}`

**Descrição:** Deleta um lote do sistema

**Request:**
```typescript
// Path parameter
lote_id: string // UUID do lote
```

**Response:**
```typescript
// Status 204 (No Content) se deletado com sucesso
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/api/lotes/${loteId}`, {
  method: "DELETE"
});
// Status 204 se sucesso
```

---

### `POST /api/lotes/{lote_id}/venda`

**Descrição:** Registra uma venda de lote usando campos estruturados. Atualiza o status para 'vendido' e salva as informações de venda em campos específicos.

**Request:**
```typescript
interface LoteVenda {
  comprador: string;
  valor_total: number;
  forma_pagamento: string;
  entrada?: number;
  parcelamento?: string;
  observacoes_venda?: string | null;
}
```

**Response:**
```typescript
Lote // Lote atualizado com status 'vendido' e campos de venda preenchidos
// Inclui: comprador, valor_total_venda, entrada_venda, parcelamento_venda, observacoes_venda
// Sempre inclui o setor completo
```

**Exemplo de uso:**
```typescript
const venda = {
  comprador: "João Silva",
  valor_total: 150000.00,
  forma_pagamento: "Parcelado",
  entrada: 50000.00,
  parcelamento: "10 parcelas de R$ 10.000,00",
  observacoes_venda: "Venda realizada em 2025"
};

const response = await fetch(`${BASE_URL}/api/lotes/${loteId}/venda`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(venda)
});
const lote: Lote = await response.json();

// Campos de venda disponíveis:
console.log(lote.comprador); // "João Silva"
console.log(lote.valor_total_venda); // 150000.00
console.log(lote.entrada_venda); // 50000.00
console.log(lote.parcelamento_venda); // "10 parcelas de R$ 10.000,00"
console.log(lote.setor?.nome); // Nome do setor (sempre disponível)
```

**Nota:** Os dados de venda são salvos em campos estruturados separados, facilitando consultas e relatórios. O campo `observacoes_venda` é separado das `observacoes` gerais do lote.

---

### `GET /api/lotes/filtros/vendidos`

**Descrição:** Retorna apenas lotes vendidos com filtros opcionais por setor

**Request:**
```typescript
interface GetLotesVendidosParams {
  setor_id?: string;
  setor_slug?: string;
}
```

**Response:**
```typescript
Lote[] // Array de lotes vendidos
```

**Exemplo de uso:**
```typescript
const params = new URLSearchParams({ 
  setor_slug: "setor-portal-do-cerrado" 
});
const response = await fetch(`${BASE_URL}/api/lotes/filtros/vendidos?${params}`);
const lotesVendidos: Lote[] = await response.json();
```

---

### `GET /api/lotes/filtros/disponiveis`

**Descrição:** Retorna apenas lotes disponíveis para venda com filtros opcionais

**Request:**
```typescript
interface GetLotesDisponiveisParams {
  setor_id?: string;
  setor_slug?: string;
  tem_acesso_agua?: boolean;
  frente_br060?: boolean;
}
```

**Response:**
```typescript
Lote[] // Array de lotes disponíveis
```

**Exemplo de uso:**
```typescript
const params = new URLSearchParams({
  setor_slug: "setor-portal-do-cerrado",
  tem_acesso_agua: "true"
});
const response = await fetch(`${BASE_URL}/api/lotes/filtros/disponiveis?${params}`);
const lotesDisponiveis: Lote[] = await response.json();
```

---

## Dívidas

### `GET /api/dividas`

**Descrição:** Lista todas as dívidas com filtros opcionais

**Request:**
```typescript
// Query parameters (todos opcionais)
interface GetDividasParams {
  status?: StatusDividaEmpresa; // Filtrar por status
  credor?: string;               // Busca parcial por credor (case-insensitive)
}
```

**Response:**
```typescript
DividaEmpresa[] // Ordenadas por valor_total (maior para menor)
// [
//   {
//     id: "uuid",
//     descricao: "Empréstimo Bradesco",
//     credor: "Bradesco",
//     valor_total: 1523456.78,
//     valor_pago: 0,
//     data_pagamento: null,
//     status: StatusDividaEmpresa.PENDENTE,
//     observacoes: null
//   },
//   ...
// ]
```

**Exemplos de uso:**

```typescript
// Listar todas as dívidas
const response1 = await fetch(`${BASE_URL}/api/dividas`);
const todasDividas: DividaEmpresa[] = await response1.json();

// Filtrar por status
const params1 = new URLSearchParams({ 
  status: StatusDividaEmpresa.PENDENTE 
});
const response2 = await fetch(`${BASE_URL}/api/dividas?${params1}`);
const dividasPendentes: DividaEmpresa[] = await response2.json();

// Buscar por credor
const params2 = new URLSearchParams({ credor: "Bradesco" });
const response3 = await fetch(`${BASE_URL}/api/dividas?${params3}`);
const dividasBradesco: DividaEmpresa[] = await response3.json();

// Combinar filtros
const params3 = new URLSearchParams({
  status: StatusDividaEmpresa.PENDENTE,
  credor: "Caixa"
});
const response4 = await fetch(`${BASE_URL}/api/dividas?${params4}`);
const dividasFiltradas: DividaEmpresa[] = await response4.json();
```

**Função helper:**
```typescript
async function getDividas(params?: GetDividasParams): Promise<DividaEmpresa[]> {
  const searchParams = new URLSearchParams();
  
  if (params?.status) searchParams.append("status", params.status);
  if (params?.credor) searchParams.append("credor", params.credor);
  
  const queryString = searchParams.toString();
  const url = `${BASE_URL}/api/dividas${queryString ? `?${queryString}` : ""}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  return await response.json();
}
```

---

### `GET /api/dividas/resumo/total`

**Descrição:** Retorna resumo financeiro completo de todas as dívidas

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
ResumoDividas
// {
//   valor_total: 5403937.24,
//   valor_pago: 0.0,
//   valor_a_pagar: 5403937.24,
//   total_dividas: 4,
//   dividas_pendentes: 4,
//   dividas_parciais: 0,
//   dividas_pagas: 0,
//   percentual_pago: 0.0
// }
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/api/dividas/resumo/total`);
const resumo: ResumoDividas = await response.json();
```

---

### `GET /api/dividas/{divida_id}`

**Descrição:** Busca uma dívida específica pelo ID (UUID)

**Request:**
```typescript
// Path parameter
divida_id: string // UUID
```

**Response:**
```typescript
DividaEmpresa
```

**Exemplo de uso:**
```typescript
const dividaId = "123e4567-e89b-12d3-a456-426614174000";
const response = await fetch(`${BASE_URL}/api/dividas/${dividaId}`);
const divida: DividaEmpresa = await response.json();
```

---

### `POST /api/dividas`

**Descrição:** Cria uma nova dívida no sistema

**Request:**
```typescript
interface DividaEmpresaCreate {
  descricao: string;
  credor: string;
  valor_total: number;
  valor_pago?: number; // Padrão: 0.00
  data_pagamento?: string | null; // YYYY-MM-DD
  status?: StatusDividaEmpresa; // Padrão: PENDENTE (determinado automaticamente)
  observacoes?: string | null;
}
```

**Response:**
```typescript
DividaEmpresa // Dívida criada com ID gerado automaticamente
```

**Exemplo de uso:**
```typescript
const novaDivida = {
  descricao: "Empréstimo para investimento",
  credor: "Banco Teste",
  valor_total: 100000.00,
  valor_pago: 0.00,
  status: StatusDividaEmpresa.PENDENTE,
  observacoes: "Dívida de teste"
};

const response = await fetch(`${BASE_URL}/api/dividas`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(novaDivida)
});
const divida: DividaEmpresa = await response.json();
```

**Nota:** O status é determinado automaticamente baseado nos valores se não fornecido:
- `valor_pago == 0` → `PENDENTE`
- `valor_pago >= valor_total` → `PAGA`
- Caso contrário → `PARCIALMENTE_PAGA`

---

### `PUT /api/dividas/{divida_id}`

**Descrição:** Atualiza uma dívida existente

**Request:**
```typescript
interface DividaEmpresaUpdate {
  descricao?: string;
  credor?: string;
  valor_total?: number;
  valor_pago?: number;
  data_pagamento?: string | null; // YYYY-MM-DD
  status?: StatusDividaEmpresa;
  observacoes?: string | null;
}
```

**Response:**
```typescript
DividaEmpresa // Dívida atualizada
```

**Exemplo de uso:**
```typescript
const atualizacao = {
  valor_pago: 50000.00,
  status: StatusDividaEmpresa.PARCIALMENTE_PAGA,
  observacoes: "Dívida parcialmente paga"
};

const response = await fetch(`${BASE_URL}/api/dividas/${dividaId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(atualizacao)
});
const divida: DividaEmpresa = await response.json();
```

**Nota:** O status é atualizado automaticamente baseado nos valores se não fornecido.

---

### `DELETE /api/dividas/{divida_id}`

**Descrição:** Deleta uma dívida do sistema

**Request:**
```typescript
// Path parameter
divida_id: string // UUID da dívida
```

**Response:**
```typescript
// Status 204 (No Content) se deletado com sucesso
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/api/dividas/${dividaId}`, {
  method: "DELETE"
});
// Status 204 se sucesso
```

---

### `GET /api/dividas/filtros/pagas`

**Descrição:** Retorna apenas dívidas pagas

**Request:**
```typescript
interface GetDividasPagasParams {
  credor?: string; // Busca parcial por credor
}
```

**Response:**
```typescript
DividaEmpresa[] // Array de dívidas pagas
```

**Exemplo de uso:**
```typescript
const params = new URLSearchParams({ credor: "Bradesco" });
const response = await fetch(`${BASE_URL}/api/dividas/filtros/pagas?${params}`);
const dividasPagas: DividaEmpresa[] = await response.json();
```

---

### `GET /api/dividas/filtros/nao-pagas`

**Descrição:** Retorna apenas dívidas não pagas (pendentes e parcialmente pagas)

**Request:**
```typescript
interface GetDividasNaoPagasParams {
  credor?: string; // Busca parcial por credor
}
```

**Response:**
```typescript
DividaEmpresa[] // Array de dívidas não pagas
```

**Exemplo de uso:**
```typescript
const params = new URLSearchParams({ credor: "Caixa" });
const response = await fetch(`${BASE_URL}/api/dividas/filtros/nao-pagas?${params}`);
const dividasNaoPagas: DividaEmpresa[] = await response.json();
```

---

### `GET /api/dividas/filtros/pendentes`

**Descrição:** Retorna apenas dívidas pendentes (não pagas)

**Request:**
```typescript
interface GetDividasPendentesParams {
  credor?: string; // Busca parcial por credor
}
```

**Response:**
```typescript
DividaEmpresa[] // Array de dívidas pendentes
```

**Exemplo de uso:**
```typescript
const params = new URLSearchParams({ credor: "Sicoob" });
const response = await fetch(`${BASE_URL}/api/dividas/filtros/pendentes?${params}`);
const dividasPendentes: DividaEmpresa[] = await response.json();
```

---

### `GET /api/dividas/filtros/por-valor`

**Descrição:** Retorna dívidas filtradas por valor (mínimo e/ou máximo)

**Request:**
```typescript
interface GetDividasPorValorParams {
  valor_minimo?: number;
  valor_maximo?: number;
  credor?: string; // Busca parcial por credor
  status?: StatusDividaEmpresa;
}
```

**Response:**
```typescript
DividaEmpresa[] // Array de dívidas que atendem aos critérios
```

**Exemplo de uso:**
```typescript
const params = new URLSearchParams({
  valor_minimo: "100000",
  valor_maximo: "500000",
  status: StatusDividaEmpresa.PENDENTE
});
const response = await fetch(`${BASE_URL}/api/dividas/filtros/por-valor?${params}`);
const dividas: DividaEmpresa[] = await response.json();
```

---

## Resumo

### `GET /api/resumo/geral`

**Descrição:** Retorna resumo geral completo do sistema

**Request:**
```typescript
// Sem parâmetros
```

**Response:**
```typescript
ResumoGeral
// {
//   lotes: {
//     total: 136,
//     disponiveis: 120,
//     vendidos: 10,
//     com_agua: 85,
//     percentual_vendido: 7.35
//   },
//   setores: {
//     total: 7
//   },
//   dividas: {
//     valor_total: 5403937.24,
//     valor_pago: 0.0,
//     valor_a_pagar: 5403937.24,
//     total_dividas: 4
//   }
// }
```

**Exemplo de uso:**
```typescript
const response = await fetch(`${BASE_URL}/api/resumo/geral`);
const resumo: ResumoGeral = await response.json();
```

---

## 📦 Arquivo Completo de Tipos

Crie um arquivo `api-types.ts` com todos os tipos:

```typescript
// api-types.ts

// Enums
export enum StatusLote {
  DISPONIVEL = "disponivel",
  RESERVADO = "reservado",
  VENDIDO = "vendido",
  INDISPONIVEL = "indisponivel"
}

export enum StatusDividaEmpresa {
  PENDENTE = "pendente",
  PARCIALMENTE_PAGA = "parcialmente_paga",
  PAGA = "paga",
  CANCELADA = "cancelada"
}

// Interfaces
export interface Setor {
  id: string;
  nome: string;
  slug: string;
  total_lotes: number;
  lotes_com_agua: number;
  cor: string | null;
  observacoes: string | null;
  caminho_pasta: string | null;
}

export interface Lote {
  id: string;
  numero: string;
  setor_id: string;
  status: StatusLote;
  tem_acesso_agua: boolean;
  frente_br060: boolean;
  area: number | null;
  observacoes: string | null;
  // Campos de venda (estruturados)
  comprador: string | null;
  valor_total_venda: number | null;
  entrada_venda: number | null;
  parcelamento_venda: string | null;
  observacoes_venda: string | null;
  // Relacionamento (sempre incluído)
  setor: Setor | null;
}

export interface LoteCreate {
  numero: string;
  setor_id: string;
  status?: StatusLote;
  tem_acesso_agua?: boolean;
  frente_br060?: boolean;
  area?: number | null;
  observacoes?: string | null;
}

export interface LoteUpdate {
  numero?: string;
  setor_id?: string;
  status?: StatusLote;
  tem_acesso_agua?: boolean;
  frente_br060?: boolean;
  area?: number | null;
  observacoes?: string | null;
}

export interface LoteVenda {
  comprador: string;
  valor_total: number;
  forma_pagamento: string;
  entrada?: number;
  parcelamento?: string;
  observacoes_venda?: string | null;
}

export interface DividaEmpresa {
  id: string;
  descricao: string;
  credor: string;
  valor_total: number;
  valor_pago: number;
  data_pagamento: string | null;
  status: StatusDividaEmpresa;
  observacoes: string | null;
}

export interface DividaEmpresaCreate {
  descricao: string;
  credor: string;
  valor_total: number;
  valor_pago?: number;
  data_pagamento?: string | null;
  status?: StatusDividaEmpresa;
  observacoes?: string | null;
}

export interface DividaEmpresaUpdate {
  descricao?: string;
  credor?: string;
  valor_total?: number;
  valor_pago?: number;
  data_pagamento?: string | null;
  status?: StatusDividaEmpresa;
  observacoes?: string | null;
}

export interface ResumoLotesStatus {
  total: number;
  disponiveis: number;
  reservados: number;
  vendidos: number;
  indisponiveis: number;
}

export interface ResumoDividas {
  valor_total: number;
  valor_pago: number;
  valor_a_pagar: number;
  total_dividas: number;
  dividas_pendentes: number;
  dividas_parciais: number;
  dividas_pagas: number;
  percentual_pago: number;
}

export interface ResumoGeral {
  lotes: {
    total: number;
    disponiveis: number;
    vendidos: number;
    com_agua: number;
    percentual_vendido: number;
  };
  setores: {
    total: number;
  };
  dividas: {
    valor_total: number;
    valor_pago: number;
    valor_a_pagar: number;
    total_dividas: number;
  };
}

export interface HealthCheck {
  message: string;
  status: "ok";
}

export interface HealthCheckDetailed {
  status: "healthy";
  app: string;
  version: string;
}

// Query Parameters
export interface GetLotesParams {
  setor_id?: string;
  setor_slug?: string;
  numero?: string;
  status?: StatusLote;
  tem_acesso_agua?: boolean;
  frente_br060?: boolean;
}

export interface GetDividasParams {
  status?: StatusDividaEmpresa;
  credor?: string;
}

export interface GetLotesVendidosParams {
  setor_id?: string;
  setor_slug?: string;
}

export interface GetLotesDisponiveisParams {
  setor_id?: string;
  setor_slug?: string;
  tem_acesso_agua?: boolean;
  frente_br060?: boolean;
}

export interface GetDividasPagasParams {
  credor?: string;
}

export interface GetDividasNaoPagasParams {
  credor?: string;
}

export interface GetDividasPendentesParams {
  credor?: string;
}

export interface GetDividasPorValorParams {
  valor_minimo?: number;
  valor_maximo?: number;
  credor?: string;
  status?: StatusDividaEmpresa;
}

export interface GetLotesVendidosParams {
  setor_id?: string;
  setor_slug?: string;
}

export interface GetLotesDisponiveisParams {
  setor_id?: string;
  setor_slug?: string;
  tem_acesso_agua?: boolean;
  frente_br060?: boolean;
}

export interface GetDividasPagasParams {
  credor?: string;
}

export interface GetDividasNaoPagasParams {
  credor?: string;
}

export interface GetDividasPendentesParams {
  credor?: string;
}

export interface GetDividasPorValorParams {
  valor_minimo?: number;
  valor_maximo?: number;
  credor?: string;
  status?: StatusDividaEmpresa;
}
```

---

## 🔧 Arquivo de API Client

Crie um arquivo `api-client.ts` com funções helper:

```typescript
// api-client.ts
import type {
  Setor,
  Lote,
  LoteCreate,
  LoteUpdate,
  LoteVenda,
  DividaEmpresa,
  DividaEmpresaCreate,
  DividaEmpresaUpdate,
  ResumoLotesStatus,
  ResumoDividas,
  ResumoGeral,
  HealthCheck,
  HealthCheckDetailed,
  GetLotesParams,
  GetDividasParams,
  GetLotesVendidosParams,
  GetLotesDisponiveisParams,
  GetDividasPagasParams,
  GetDividasNaoPagasParams,
  GetDividasPendentesParams,
  GetDividasPorValorParams
} from './api-types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper genérico
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Health Check
export const healthCheck = {
  root: (): Promise<HealthCheck> => fetchAPI('/'),
  detailed: (): Promise<HealthCheckDetailed> => fetchAPI('/health'),
};

// Setores
export const setores = {
  list: (): Promise<Setor[]> => fetchAPI('/api/setores'),
  getBySlug: (slug: string): Promise<Setor> => fetchAPI(`/api/setores/slug/${slug}`),
  getById: (id: string): Promise<Setor> => fetchAPI(`/api/setores/${id}`),
};

// Lotes
export const lotes = {
  list: (params?: GetLotesParams): Promise<Lote[]> => {
    const searchParams = new URLSearchParams();
    if (params?.setor_id) searchParams.append('setor_id', params.setor_id);
    if (params?.setor_slug) searchParams.append('setor_slug', params.setor_slug);
    if (params?.numero) searchParams.append('numero', params.numero);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.tem_acesso_agua !== undefined) {
      searchParams.append('tem_acesso_agua', params.tem_acesso_agua.toString());
    }
    if (params?.frente_br060 !== undefined) {
      searchParams.append('frente_br060', params.frente_br060.toString());
    }
    const queryString = searchParams.toString();
    return fetchAPI(`/api/lotes${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string): Promise<Lote> => fetchAPI(`/api/lotes/${id}`),
  create: (data: LoteCreate): Promise<Lote> => 
    fetchAPI('/api/lotes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: LoteUpdate): Promise<Lote> => 
    fetchAPI(`/api/lotes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<void> => 
    fetchAPI(`/api/lotes/${id}`, { method: 'DELETE' }),
  registrarVenda: (id: string, data: LoteVenda): Promise<Lote> => 
    fetchAPI(`/api/lotes/${id}/venda`, { method: 'POST', body: JSON.stringify(data) }),
  resumoStatus: (): Promise<ResumoLotesStatus> => fetchAPI('/api/lotes/resumo/status'),
  vendidos: (params?: GetLotesVendidosParams): Promise<Lote[]> => {
    const searchParams = new URLSearchParams();
    if (params?.setor_id) searchParams.append('setor_id', params.setor_id);
    if (params?.setor_slug) searchParams.append('setor_slug', params.setor_slug);
    const queryString = searchParams.toString();
    return fetchAPI(`/api/lotes/filtros/vendidos${queryString ? `?${queryString}` : ''}`);
  },
  disponiveis: (params?: GetLotesDisponiveisParams): Promise<Lote[]> => {
    const searchParams = new URLSearchParams();
    if (params?.setor_id) searchParams.append('setor_id', params.setor_id);
    if (params?.setor_slug) searchParams.append('setor_slug', params.setor_slug);
    if (params?.tem_acesso_agua !== undefined) {
      searchParams.append('tem_acesso_agua', params.tem_acesso_agua.toString());
    }
    if (params?.frente_br060 !== undefined) {
      searchParams.append('frente_br060', params.frente_br060.toString());
    }
    const queryString = searchParams.toString();
    return fetchAPI(`/api/lotes/filtros/disponiveis${queryString ? `?${queryString}` : ''}`);
  },
};

// Dívidas
export const dividas = {
  list: (params?: GetDividasParams): Promise<DividaEmpresa[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.credor) searchParams.append('credor', params.credor);
    const queryString = searchParams.toString();
    return fetchAPI(`/api/dividas${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string): Promise<DividaEmpresa> => fetchAPI(`/api/dividas/${id}`),
  create: (data: DividaEmpresaCreate): Promise<DividaEmpresa> => 
    fetchAPI('/api/dividas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: DividaEmpresaUpdate): Promise<DividaEmpresa> => 
    fetchAPI(`/api/dividas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<void> => 
    fetchAPI(`/api/dividas/${id}`, { method: 'DELETE' }),
  resumoTotal: (): Promise<ResumoDividas> => fetchAPI('/api/dividas/resumo/total'),
  pagas: (params?: GetDividasPagasParams): Promise<DividaEmpresa[]> => {
    const searchParams = new URLSearchParams();
    if (params?.credor) searchParams.append('credor', params.credor);
    const queryString = searchParams.toString();
    return fetchAPI(`/api/dividas/filtros/pagas${queryString ? `?${queryString}` : ''}`);
  },
  naoPagas: (params?: GetDividasNaoPagasParams): Promise<DividaEmpresa[]> => {
    const searchParams = new URLSearchParams();
    if (params?.credor) searchParams.append('credor', params.credor);
    const queryString = searchParams.toString();
    return fetchAPI(`/api/dividas/filtros/nao-pagas${queryString ? `?${queryString}` : ''}`);
  },
  pendentes: (params?: GetDividasPendentesParams): Promise<DividaEmpresa[]> => {
    const searchParams = new URLSearchParams();
    if (params?.credor) searchParams.append('credor', params.credor);
    const queryString = searchParams.toString();
    return fetchAPI(`/api/dividas/filtros/pendentes${queryString ? `?${queryString}` : ''}`);
  },
  porValor: (params?: GetDividasPorValorParams): Promise<DividaEmpresa[]> => {
    const searchParams = new URLSearchParams();
    if (params?.valor_minimo) searchParams.append('valor_minimo', params.valor_minimo.toString());
    if (params?.valor_maximo) searchParams.append('valor_maximo', params.valor_maximo.toString());
    if (params?.credor) searchParams.append('credor', params.credor);
    if (params?.status) searchParams.append('status', params.status);
    const queryString = searchParams.toString();
    return fetchAPI(`/api/dividas/filtros/por-valor${queryString ? `?${queryString}` : ''}`);
  },
};

// Resumo
export const resumo = {
  geral: (): Promise<ResumoGeral> => fetchAPI('/api/resumo/geral'),
};

// Export default
export default {
  healthCheck,
  setores,
  lotes,
  dividas,
  resumo,
};
```

---

## 📝 Exemplos de Uso no Frontend

### React/Next.js

```typescript
import { useState, useEffect } from 'react';
import { setores, lotes, dividas, resumo } from './api-client';
import type { Setor, Lote, DividaEmpresa, ResumoGeral } from './api-types';

function Dashboard() {
  const [resumoGeral, setResumoGeral] = useState<ResumoGeral | null>(null);

  useEffect(() => {
    resumo.geral().then(setResumoGeral);
  }, []);

  if (!resumoGeral) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total de Lotes: {resumoGeral.lotes.total}</p>
      <p>Lotes Vendidos: {resumoGeral.lotes.vendidos}</p>
      <p>Dívidas Totais: R$ {resumoGeral.dividas.valor_total.toLocaleString('pt-BR')}</p>
    </div>
  );
}
```

### Vue.js

```typescript
import { ref, onMounted } from 'vue';
import { setores, lotes } from './api-client';
import type { Setor, Lote } from './api-types';

export default {
  setup() {
    const setoresList = ref<Setor[]>([]);
    const lotesList = ref<Lote[]>([]);

    onMounted(async () => {
      setoresList.value = await setores.list();
      lotesList.value = await lotes.list({ status: 'vendido' });
    });

    return { setoresList, lotesList };
  },
};
```

---

## ⚠️ Notas Importantes

1. **Decimais**: Valores decimais do backend (Python `Decimal`) são convertidos para `number` no JSON
2. **Datas**: Datas são retornadas como strings ISO (YYYY-MM-DD)
3. **Relacionamentos**: O campo `setor` em `Lote` sempre está presente e completo em todas as respostas
4. **Filtros**: Todos os parâmetros de query são opcionais e podem ser combinados
5. **Erros**: Endpoints retornam 404 quando o recurso não é encontrado, 500 para erros internos

---

## 🔗 URLs de Produção

Atualize a `BASE_URL` conforme o ambiente:

```typescript
const BASE_URL = 
  process.env.NODE_ENV === 'production'
    ? 'https://api.villaparaiso.com.br'
    : 'http://localhost:8000';
```
 === 'production'
    ? 'https://api.villaparaiso.com.br'
    : 'http://localhost:8000';
```
