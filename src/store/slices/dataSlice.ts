/**
 * Data slice for product list and details
 */

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import {
  fetchProducts,
  searchProducts,
  addProduct,
  fetchProductById,
  updateProduct,
  deleteProduct,
  type Product,
  type ProductDetail,
  type ProductsResponse,
} from "@/store/thunks/apiThunks"

export type { Product, ProductDetail }

export interface DataState {
  items: Product[]
  loading: boolean
  error: string | null
  currentItem: ProductDetail | null
  searchQuery: string
  total: number
  skip: number
  limit: number
  addProductLoading: boolean
  detailsLoading: boolean
  detailsError: string | null
  updateProductLoading: boolean
  deleteProductLoading: boolean
}

const initialState: DataState = {
  items: [],
  loading: false,
  error: null,
  currentItem: null,
  searchQuery: "",
  total: 0,
  skip: 0,
  limit: 10,
  addProductLoading: false,
  detailsLoading: false,
  detailsError: null,
  updateProductLoading: false,
  deleteProductLoading: false,
}

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentItem: (state) => {
      state.currentItem = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<ProductsResponse>) => {
          state.loading = false
          state.items = action.payload.products
          state.total = action.payload.total
          state.skip = action.payload.skip
          state.limit = action.payload.limit
          state.searchQuery = ""
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        searchProducts.fulfilled,
        (
          state,
          action: PayloadAction<ProductsResponse & { query: string }>
        ) => {
          state.loading = false
          state.items = action.payload.products
          state.total = action.payload.total
          state.skip = action.payload.skip
          state.limit = action.payload.limit
          state.searchQuery = action.payload.query
        }
      )
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(addProduct.pending, (state) => {
        state.addProductLoading = true
        state.error = null
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.addProductLoading = false
        state.items = [action.payload, ...state.items].slice(0, state.limit)
        state.total += 1
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.addProductLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(fetchProductById.pending, (state) => {
        state.detailsLoading = true
        state.detailsError = null
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<ProductDetail>) => {
          state.detailsLoading = false
          state.currentItem = action.payload
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailsLoading = false
        state.detailsError = action.payload as string
        state.currentItem = null
      })

    builder
      .addCase(updateProduct.pending, (state) => {
        state.updateProductLoading = true
        state.detailsError = null
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<ProductDetail>) => {
          state.updateProductLoading = false
          state.currentItem = {
            ...state.currentItem,
            ...action.payload,
          } as ProductDetail
          state.items = state.items.map((item) =>
            item.id === action.payload.id
              ? normalizeListItem(action.payload)
              : item
          )
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateProductLoading = false
        state.detailsError = action.payload as string
      })

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.deleteProductLoading = true
        state.detailsError = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteProductLoading = false
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        )
        state.total = Math.max(0, state.total - 1)
        state.currentItem = null
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteProductLoading = false
        state.detailsError = action.payload as string
      })
  },
})

function normalizeListItem(product: ProductDetail): Product {
  return {
    id: product.id,
    title: product.title,
    description: product.description ?? "",
    category: product.category ?? "",
    price: product.price ?? 0,
    discountPercentage: product.discountPercentage ?? 0,
    rating: product.rating ?? 0,
    stock: product.stock ?? 0,
    brand: product.brand ?? "",
    thumbnail: product.thumbnail ?? "",
  }
}

export const { clearError, clearCurrentItem } = dataSlice.actions
export default dataSlice.reducer
