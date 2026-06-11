import { useEffect, type ReactNode } from "react"
import { Navigate, Outlet } from "react-router"
import { ModeToggle } from "@/components/mode-toggle"
import { Skeleton } from "@/components/ui/skeleton"
import { getAccessToken } from "@/lib/storage"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchCurrentUser } from "@/store/slices/authSlice"

const AuthShell = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-screen bg-muted">
    <div className="absolute top-4 right-4 z-10">
      <ModeToggle />
    </div>
    {children}
  </div>
)

const AuthLayout = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, authInitializing } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (getAccessToken()) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch])

  if (authInitializing) {
    return (
      <AuthShell>
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </AuthShell>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/products" replace />
  }

  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  )
}

export default AuthLayout
