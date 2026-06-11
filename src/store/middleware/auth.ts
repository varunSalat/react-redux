/**
 * Redux Middleware for Authentication Token Management
 * Persists JWT tokens to localStorage per assignment requirements
 */

import { clearAuthStorage, persistAuthSession } from "@/lib/storage"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action)
  const state = store.getState()

  if (
    (action.type === "auth/loginUser/fulfilled" ||
      action.type === "auth/refreshAuthToken/fulfilled") &&
    state.auth.accessToken &&
    state.auth.refreshToken
  ) {
    persistAuthSession({
      accessToken: state.auth.accessToken,
      refreshToken: state.auth.refreshToken,
      user: state.auth.user,
    })
  }

  if (
    action.type === "auth/fetchCurrentUser/fulfilled" &&
    state.auth.user
  ) {
    persistAuthSession({
      accessToken: state.auth.accessToken!,
      refreshToken: state.auth.refreshToken!,
      user: state.auth.user,
    })
  }

  if (
    action.type === "auth/fetchCurrentUser/rejected" ||
    action.type === "auth/logoutUser/fulfilled"
  ) {
    clearAuthStorage()
  }

  return result
}

export default authMiddleware
