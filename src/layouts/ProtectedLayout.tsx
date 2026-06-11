import { useEffect } from "react"
import { Link, Navigate, Outlet, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchCurrentUser, logoutUser } from "@/store/slices/authSlice"

const ProtectedLayout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, authInitializing } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate("/login", { replace: true })
  }

  if (authInitializing) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-32" />
          </div>
        </nav>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="h-40 w-full rounded-3xl" />
        </main>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex shrink-0 items-center">
                <span className="text-xl font-bold text-indigo-600">Store</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/products"
                  className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Products
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden items-center gap-3 sm:flex">
                  <img
                    src={user.image}
                    alt={user.username}
                    className="size-8 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default ProtectedLayout
