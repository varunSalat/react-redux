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
      <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
        <p className="text-red-600">{error}</p>
        <Button className="mt-4" variant="outline" onClick={retry}>
          Try again
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
        {searchQuery
          ? `No products match "${searchQuery}".`
          : "No products found."}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
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
          <tbody className="divide-y divide-slate-100">
            {items.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="size-10 rounded-md object-cover ring-1 ring-slate-200"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium text-slate-900">
                        {product.title}
                      </p>
                      <p className="line-clamp-1 max-w-xs text-xs text-slate-500">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-slate-700">
                  {product.brand}
                </td>
                <td className="px-4 py-3 capitalize text-slate-700">
                  {product.category}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  ${(product.price ?? 0).toFixed(2)}
                  {(product.discountPercentage ?? 0) > 0 && (
                    <span className="ml-1 text-xs text-emerald-600">
                      -{(product.discountPercentage ?? 0).toFixed(0)}%
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {(product.rating ?? 0).toFixed(1)}
                </td>
                <td className="px-4 py-3 text-slate-700">
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
