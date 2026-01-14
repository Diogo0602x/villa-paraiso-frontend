import type { ApiError } from "@/types"

// Remove trailing /api if present, as endpoints already include /api prefix
// This handles cases where .env has http://localhost:8000/api
const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
const API_BASE_URL = envUrl.replace(/\/api\/?$/, "")

export class ApiException extends Error {
  private _originalMessage: string | string[]

  constructor(
    public statusCode: number,
    message: string | string[],
    public error: string,
  ) {
    const messageStr = Array.isArray(message) ? message.join(", ") : message
    super(messageStr)
    this.name = "ApiException"
    this._originalMessage = message
  }

  getFirstMessage(): string {
    return Array.isArray(this._originalMessage) ? this._originalMessage[0] : this._originalMessage
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const apiError: ApiError = data || {
      statusCode: response.status,
      message: response.statusText,
      error: "Unknown error",
    }
    throw new ApiException(apiError.statusCode, apiError.message, apiError.error)
  }

  return data as T
}

export const api = {
  get: <T>(endpoint: string): Promise<T> => {
    return apiRequest<T>(endpoint, { method: "GET" })
  },

  post: <T>(endpoint: string, data?: unknown): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  patch: <T>(endpoint: string, data?: unknown): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  put: <T>(endpoint: string, data?: unknown): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  delete: <T>(endpoint: string): Promise<T> => {
    return apiRequest<T>(endpoint, { method: "DELETE" })
  },
}
