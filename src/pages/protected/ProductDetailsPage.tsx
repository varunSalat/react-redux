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
      <div className="rounded-3xl border border-destructive/30 bg-card p-10 text-center shadow-sm">
        <p className="text-destructive">Invalid product ID.</p>
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
      <div className="rounded-3xl border border-destructive/30 bg-card p-10 text-center shadow-sm">
        <p className="text-destructive">{detailsError}</p>
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
      <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground shadow-sm">
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
      <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-sm lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-muted">
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
                      ? "border-primary"
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
            <p className="text-sm font-medium tracking-[0.24em] text-muted-foreground uppercase">
              {product.brand} · {product.category}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {product.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">SKU: {product.sku}</p>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-foreground">
              ${discountedPrice.toFixed(2)}
            </span>
            {(product.discountPercentage ?? 0) > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                  {(product.discountPercentage ?? 0).toFixed(0)}% off
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              Rating {(product.rating ?? 0).toFixed(1)}
            </span>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              {product.stock ?? 0} in stock
            </span>
            <span className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">
              {product.availabilityStatus}
            </span>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border px-2 py-1 text-xs capitalize text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Separator />

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Weight</dt>
              <dd className="font-medium text-foreground">{product.weight} g</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Dimensions</dt>
              <dd className="font-medium text-foreground">
                {product.dimensions.width} × {product.dimensions.height} ×{" "}
                {product.dimensions.depth} cm
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Min. order</dt>
              <dd className="font-medium text-foreground">
                {product.minimumOrderQuantity} units
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Barcode</dt>
              <dd className="font-medium text-foreground">
                {product.meta.barcode}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Warranty</dt>
              <dd className="font-medium text-foreground">
                {product.warrantyInformation}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Shipping</dt>
              <dd className="font-medium text-foreground">
                {product.shippingInformation}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Return policy</dt>
              <dd className="font-medium text-foreground">
                {product.returnPolicy}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">
            Reviews ({product.reviews.length})
          </h2>
          <div className="mt-4 space-y-4">
            {product.reviews.map((review, index) => (
              <div
                key={`${review.reviewerEmail}-${index}`}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">
                    {review.reviewerName}
                  </p>
                  <span className="text-sm text-primary">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                <p className="mt-1 text-xs text-muted-foreground">
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
