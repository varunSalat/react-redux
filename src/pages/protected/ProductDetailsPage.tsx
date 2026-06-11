import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import DeleteProductAlertDialog from "@/components/products/DeleteProductAlertDialog"
import EditProductDialog from "@/components/products/EditProductDialog"
import ProductDetailsSkeleton from "@/components/products/ProductDetailsSkeleton"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { clearCurrentItem } from "@/store/slices/dataSlice"
import { fetchProductById } from "@/store/thunks/apiThunks"

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { currentItem, detailsLoading, detailsError } = useAppSelector(
    (state) => state.data
  )
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const productId = Number(id)

  useEffect(() => {
    if (!Number.isFinite(productId) || productId <= 0) return

    dispatch(fetchProductById(productId))

    return () => {
      dispatch(clearCurrentItem())
    }
  }, [dispatch, productId])

  useEffect(() => {
    if (currentItem) {
      setActiveImage(currentItem.images?.[0] ?? currentItem.thumbnail)
    }
  }, [currentItem])

  const retry = () => {
    if (Number.isFinite(productId) && productId > 0) {
      dispatch(fetchProductById(productId))
    }
  }

  if (!Number.isFinite(productId) || productId <= 0) {
    return (
      <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
        <p className="text-red-600">Invalid product ID.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/products">Back to products</Link>
        </Button>
      </div>
    )
  }

  if (detailsLoading) {
    return <ProductDetailsSkeleton />
  }

  if (detailsError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
        <p className="text-red-600">{detailsError}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" onClick={retry}>
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link to="/products">Back to products</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!currentItem) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
        <p>Product not found.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/products">Back to products</Link>
        </Button>
      </div>
    )
  }

  const product = currentItem
  const images =
    product.images?.length > 0
      ? product.images
      : product.thumbnail
        ? [product.thumbnail]
        : []
  const discountedPrice =
    (product.discountPercentage ?? 0) > 0
      ? product.price * (1 - (product.discountPercentage ?? 0) / 100)
      : product.price

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline" size="sm">
          <Link to="/products">← Back to products</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            Edit product
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            Delete product
          </Button>
        </div>
      </div>
      <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img
              src={activeImage ?? product.thumbnail}
              alt={product.title}
              className="aspect-square w-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`shrink-0 overflow-hidden rounded-lg border-2 ${
                    activeImage === image
                      ? "border-indigo-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="size-16 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium tracking-[0.24em] text-slate-500 uppercase">
              {product.brand} · {product.category}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {product.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">SKU: {product.sku}</p>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-slate-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {(product.discountPercentage ?? 0) > 0 && (
              <>
                <span className="text-lg text-slate-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-medium text-emerald-700">
                  {(product.discountPercentage ?? 0).toFixed(0)}% off
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              Rating {(product.rating ?? 0).toFixed(1)}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {product.stock ?? 0} in stock
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
              {product.availabilityStatus}
            </span>
          </div>

          <p className="text-slate-600">{product.description}</p>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs capitalize text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Separator />

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Weight</dt>
              <dd className="font-medium text-slate-900">{product.weight} g</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Dimensions</dt>
              <dd className="font-medium text-slate-900">
                {product.dimensions.width} × {product.dimensions.height} ×{" "}
                {product.dimensions.depth} cm
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Min. order</dt>
              <dd className="font-medium text-slate-900">
                {product.minimumOrderQuantity} units
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Barcode</dt>
              <dd className="font-medium text-slate-900">
                {product.meta.barcode}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Warranty</dt>
              <dd className="font-medium text-slate-900">
                {product.warrantyInformation}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Shipping</dt>
              <dd className="font-medium text-slate-900">
                {product.shippingInformation}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-slate-500">Return policy</dt>
              <dd className="font-medium text-slate-900">
                {product.returnPolicy}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Reviews ({product.reviews.length})
          </h2>
          <div className="mt-4 space-y-4">
            {product.reviews.map((review, index) => (
              <div
                key={`${review.reviewerEmail}-${index}`}
                className="rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-slate-900">
                    {review.reviewerName}
                  </p>
                  <span className="text-sm text-amber-600">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <EditProductDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        product={product}
      />
      <DeleteProductAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        productId={product.id}
        productTitle={product.title}
      />
    </div>
  )
}
export default ProductDetailsPage
