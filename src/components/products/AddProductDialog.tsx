import { useState } from "react"
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
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { errorToast, successToast } from "@/lib/toast"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addProduct } from "@/store/thunks/apiThunks"

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const initialForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  stock: "",
  discountPercentage: "",
  thumbnail: "",
}

const AddProductDialog = ({ open, onOpenChange }: AddProductDialogProps) => {
  const dispatch = useAppDispatch()
  const { addProductLoading } = useAppSelector((state) => state.data)
  const [form, setForm] = useState(initialForm)

  const resetForm = () => setForm(initialForm)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
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
    const discountPercentage = form.discountPercentage
      ? Number(form.discountPercentage)
      : 0

    if (Number.isNaN(price) || price <= 0) {
      errorToast("Please enter a valid price")
      return
    }

    if (Number.isNaN(stock) || stock < 0) {
      errorToast("Please enter a valid stock quantity")
      return
    }

    if (
      form.discountPercentage &&
      (Number.isNaN(discountPercentage) ||
        discountPercentage < 0 ||
        discountPercentage > 100)
    ) {
      errorToast("Discount must be between 0 and 100")
      return
    }

    const result = await dispatch(
      addProduct({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        brand: form.brand.trim(),
        price,
        stock,
        discountPercentage,
        ...(form.thumbnail.trim() && { thumbnail: form.thumbnail.trim() }),
      })
    )

    if (addProduct.rejected.match(result)) {
      errorToast(
        typeof result.payload === "string"
          ? result.payload
          : "Failed to add product"
      )
      return
    }

    successToast(`"${form.title.trim()}" was added successfully`)
    resetForm()
    onOpenChange(false)
  }

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add product</DialogTitle>
          <DialogDescription>
            Create a new product. DummyJSON will return a mock response with a
            generated ID.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="BMW Pencil"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                id="description"
                placeholder="Product description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="9.99"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="stock">Stock</FieldLabel>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="10"
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Input
                  id="category"
                  placeholder="beauty"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="brand">Brand</FieldLabel>
                <Input
                  id="brand"
                  placeholder="Essence"
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="discountPercentage">
                  Discount (%)
                </FieldLabel>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="7.17"
                  value={form.discountPercentage}
                  onChange={(e) =>
                    updateField("discountPercentage", e.target.value)
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="thumbnail">Thumbnail URL</FieldLabel>
                <Input
                  id="thumbnail"
                  type="url"
                  placeholder="https://..."
                  value={form.thumbnail}
                  onChange={(e) => updateField("thumbnail", e.target.value)}
                />
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={addProductLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addProductLoading}>
              {addProductLoading ? "Adding..." : "Add product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddProductDialog
