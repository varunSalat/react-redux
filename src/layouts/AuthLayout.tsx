import { useEffect } from "react"
import { Navigate, Outlet } from "react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { getAccessToken } from "@/lib/storage"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchCurrentUser } from "@/store/slices/authSlice"

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/products" replace />
  }

  return <Outlet />
}

export default AuthLayout
