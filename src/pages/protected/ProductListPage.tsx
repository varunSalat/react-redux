import { Suspense, lazy, useEffect, useRef, useState } from "react"
import AddProductDialog from "@/components/products/AddProductDialog"
import ProductListSkeleton from "@/components/products/ProductListSkeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchProducts, searchProducts } from "@/store/thunks/apiThunks"

const PAGE_SIZE = 10

const ProductListPanel = lazy(
  () => import("@/components/products/ProductListPanel")
)

const ProductListPage = () => {
  const dispatch = useAppDispatch()
  const { items, loading, searchQuery, total, skip, limit } = useAppSelector(
    (state) => state.data
  )
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }, [page])

  useEffect(() => {
    const trimmed = query.trim()
    const pagination = { limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }

    if (!trimmed) {
      dispatch(fetchProducts(pagination))
      return
    }

    const timeout = setTimeout(() => {
      dispatch(searchProducts({ query: trimmed, ...pagination }))
    }, 300)

    return () => clearTimeout(timeout)
  }, [query, page, dispatch])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const currentPage = Math.floor(skip / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const rangeStart = total === 0 ? 0 : skip + 1
  const rangeEnd = Math.min(skip + items.length, total)

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return
    setPage(nextPage)
  }

  return (
    <div className="space-y-6">
      <div
        ref={topRef}
        className="scroll-mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium tracking-[0.24em] text-muted-foreground uppercase">
              Product list
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Explore store products
            </h1>
            {loading && items.length === 0 ? (
              <Skeleton className="mt-2 h-4 w-48" />
            ) : (
              <>
                {!loading && total > 0 && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchQuery
                      ? `Showing ${rangeStart}-${rangeEnd} of ${total} results for "${searchQuery}"`
                      : `Showing ${rangeStart}-${rangeEnd} of ${total} products`}
                  </p>
                )}
                {!loading && total === 0 && searchQuery && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    No results for "{searchQuery}"
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex w-full flex-col gap-3 sm:max-w-md sm:flex-row sm:items-center">
            <Input
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              aria-label="Search products"
            />
            <Button
              className="shrink-0"
              onClick={() => setAddDialogOpen(true)}
            >
              Add product
            </Button>
          </div>
        </div>
      </div>

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5 shadow-sm">
            <p className="text-sm font-medium text-primary">Total records</p>
            <p className="mt-1 text-3xl font-semibold text-foreground">
              {total.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-primary/80">
              {searchQuery
                ? `Matching "${searchQuery}"`
                : "All products in catalog"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Current page</p>
            <p className="mt-1 text-3xl font-semibold text-foreground">
              {currentPage}
              <span className="text-lg text-muted-foreground"> / {totalPages}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {limit} records per page
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Showing now</p>
            <p className="mt-1 text-3xl font-semibold text-foreground">
              {items.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {total > 0
                ? `Records ${rangeStart}-${rangeEnd} of ${total}`
                : "No records on this page"}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <ProductListSkeleton count={PAGE_SIZE} />
      ) : (
        <Suspense fallback={<ProductListSkeleton count={PAGE_SIZE} />}>
          <ProductListPanel page={page} pageSize={PAGE_SIZE} />
        </Suspense>
      )}

      {total > limit && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-border bg-card px-6 py-4 shadow-sm sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={loading || page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={loading || page >= totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AddProductDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  )
}

export default ProductListPage
