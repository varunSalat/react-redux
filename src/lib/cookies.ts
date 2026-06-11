const COOKIE_PATH = "/"
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

const buildCookieOptions = () => {
  const options = [
    `path=${COOKIE_PATH}`,
    `max-age=${COOKIE_MAX_AGE_SECONDS}`,
    "samesite=strict",
  ]

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    options.push("secure")
  }

  return options.join("; ")
}

export function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ${buildCookieOptions()}`
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${encodeURIComponent(name)}=`))

  if (!cookie) return null
  return decodeURIComponent(cookie.split("=").slice(1).join("="))
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${encodeURIComponent(name)}=; path=${COOKIE_PATH}; max-age=0; samesite=strict`
}
