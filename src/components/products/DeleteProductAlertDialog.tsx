import { useNavigate } from "react-router"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { errorToast, successToast } from "@/lib/toast"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { deleteProduct } from "@/store/thunks/apiThunks"

interface DeleteProductAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: number
  productTitle: string
}

const DeleteProductAlertDialog = ({
  open,
  onOpenChange,
  productId,
  productTitle,
}: DeleteProductAlertDialogProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { deleteProductLoading } = useAppSelector((state) => state.data)

  const handleDelete = async () => {
    const result = await dispatch(deleteProduct(productId))

    if (deleteProduct.rejected.match(result)) {
      errorToast(
        typeof result.payload === "string"
          ? result.payload
          : "Failed to delete product"
      )
      return
    }

    successToast(`"${productTitle}" was deleted successfully`)
    onOpenChange(false)
    navigate("/products")
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{productTitle}</span>.
            DummyJSON returns a mock response — the product will reappear after
            a page refresh.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProductLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteProductLoading}
            onClick={(e) => {
              e.preventDefault()
              void handleDelete()
            }}
          >
            {deleteProductLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteProductAlertDialog
