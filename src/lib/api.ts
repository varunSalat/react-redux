import { getAccessToken } from "@/lib/storage"

const BASE_URL = "https://dummyjson.com"

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json()
    if (data && typeof data.message === "string") return data.message
  } catch {
    // ignore parse errors
  }
  return `Request failed (${response.status})`
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken()
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response.json()
}

export const apiClient = {
  get<T>(path: string): Promise<T> {
    return request<T>(path)
  },

  post<T>(path: string, data: unknown): Promise<T> {
    return request<T>(path, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  put<T>(path: string, data: unknown): Promise<T> {
    return request<T>(path, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete<T>(path: string): Promise<T> {
    return request<T>(path, { method: "DELETE" })
  },
}
