const ACCESS_TOKEN_KEY = "accessToken"
const REFRESH_TOKEN_KEY = "refreshToken"
const AUTH_USER_KEY = "authUser"

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function getStoredUser<T>(): T | null {
  const value = localStorage.getItem(AUTH_USER_KEY)
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function setStoredUser(user: unknown) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export function persistAuthSession({
  accessToken,
  refreshToken,
  user,
}: {
  accessToken: string
  refreshToken: string
  user?: unknown
}) {
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
  if (user) setStoredUser(user)
}

/** One-time migration from cookie-based auth to localStorage */
export function migrateAuthFromCookies() {
  if (typeof document === "undefined") return

  const readCookie = (name: string) => {
    const cookie = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${encodeURIComponent(name)}=`))
    if (!cookie) return null
    return decodeURIComponent(cookie.split("=").slice(1).join("="))
  }

  if (!getAccessToken()) {
    const accessToken = readCookie("accessToken")
    const refreshToken = readCookie("refreshToken")
    const authUser = readCookie("authUser")

    if (accessToken && refreshToken) {
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)
      if (authUser) localStorage.setItem(AUTH_USER_KEY, authUser)
    }
  }
}
