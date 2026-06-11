import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchProducts, searchProducts } from "@/store/thunks/apiThunks"

interface ProductListPanelProps {
  page: number
  pageSize: number
}

const ProductListPanel = ({ page, pageSize }: ProductListPanelProps) => {
  const dispatch = useAppDispatch()
  const { items, error, searchQuery } = useAppSelector((state) => state.data)

  const retry = () => {
    const pagination = { limit: pageSize, skip: (page - 1) * pageSize }

    if (searchQuery) {
      dispatch(searchProducts({ query: searchQuery, ...pagination }))
    } else {
      dispatch(fetchProducts(pagination))
    }
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-card p-10 text-center shadow-sm">
        <p className="text-destructive">{error}</p>
        <Button className="mt-4" variant="outline" onClick={retry}>
          Try again
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground shadow-sm">
        {searchQuery
          ? `No products match "${searchQuery}".`
          : "No products found."}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Brand</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((product) => (
              <tr key={product.id} className="hover:bg-muted">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="size-10 rounded-md object-cover ring-1 ring-border"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        {product.title}
                      </p>
                      <p className="line-clamp-1 max-w-xs text-xs text-muted-foreground">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-foreground">
                  {product.brand}
                </td>
                <td className="px-4 py-3 capitalize text-foreground">
                  {product.category}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  ${(product.price ?? 0).toFixed(2)}
                  {(product.discountPercentage ?? 0) > 0 && (
                    <span className="ml-1 text-xs text-primary">
                      -{(product.discountPercentage ?? 0).toFixed(0)}%
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {(product.rating ?? 0).toFixed(1)}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {product.stock ?? 0}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/products/${product.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductListPanel
