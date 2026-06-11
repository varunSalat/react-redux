import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { errorToast, successToast } from "@/lib/toast"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateProduct, type ProductDetail } from "@/store/thunks/apiThunks"

interface EditProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductDetail
}

const EditProductDialog = ({
  open,
  onOpenChange,
  product,
}: EditProductDialogProps) => {
  const dispatch = useAppDispatch()
  const { updateProductLoading } = useAppSelector((state) => state.data)
  const [form, setForm] = useState({
    title: product.title,
    description: product.description,
    price: String(product.price),
    category: product.category,
    brand: product.brand,
    stock: String(product.stock),
    discountPercentage: String(product.discountPercentage ?? 0),
  })

  useEffect(() => {
    if (open) {
      setForm({
        title: product.title,
        description: product.description,
        price: String(product.price),
        category: product.category,
        brand: product.brand,
        stock: String(product.stock),
        discountPercentage: String(product.discountPercentage ?? 0),
      })
    }
  }, [open, product])

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.category.trim() ||
      !form.brand.trim() ||
      !form.price.trim() ||
      !form.stock.trim()
    ) {
      errorToast("Please fill in all required fields")
      return
    }

    const price = Number(form.price)
    const stock = Number(form.stock)
    const discountPercentage = Number(form.discountPercentage)

    if (Number.isNaN(price) || price <= 0) {
      errorToast("Please enter a valid price")
      return
    }

    if (Number.isNaN(stock) || stock < 0) {
      errorToast("Please enter a valid stock quantity")
      return
    }

    if (
      Number.isNaN(discountPercentage) ||
      discountPercentage < 0 ||
      discountPercentage > 100
    ) {
      errorToast("Discount must be between 0 and 100")
      return
    }

    const result = await dispatch(
      updateProduct({
        id: product.id,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        brand: form.brand.trim(),
        price,
        stock,
        discountPercentage,
      })
    )

    if (updateProduct.rejected.match(result)) {
      errorToast(
        typeof result.payload === "string"
          ? result.payload
          : "Failed to update product"
      )
      return
    }

    successToast(`"${form.title.trim()}" was updated successfully`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Update product details. Changes are mocked by DummyJSON and will not
            persist after refresh.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="edit-title">Title</FieldLabel>
              <Input
                id="edit-title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-description">Description</FieldLabel>
              <Input
                id="edit-description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="edit-price">Price</FieldLabel>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-stock">Stock</FieldLabel>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="edit-category">Category</FieldLabel>
                <Input
                  id="edit-category"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-brand">Brand</FieldLabel>
                <Input
                  id="edit-brand"
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="edit-discount">Discount (%)</FieldLabel>
              <Input
                id="edit-discount"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.discountPercentage}
                onChange={(e) =>
                  updateField("discountPercentage", e.target.value)
                }
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateProductLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateProductLoading}>
              {updateProductLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProductDialog
