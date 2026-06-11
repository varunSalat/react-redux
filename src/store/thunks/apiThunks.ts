/**
 * Redux Thunks for async API operations
 */

import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiClient } from "@/lib/api"

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  thumbnail: string
}

export interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface ProductDetail extends Product {
  tags: string[]
  sku: string
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: ProductReview[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
  }
  images: string[]
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface PaginationParams {
  limit?: number
  skip?: number
}

export interface AddProductPayload {
  title: string
  description: string
  price: number
  category: string
  brand: string
  stock: number
  discountPercentage?: number
  thumbnail?: string
}

export interface UpdateProductPayload {
  title?: string
  description?: string
  price?: number
  category?: string
  brand?: string
  stock?: number
  discountPercentage?: number
}

const PRODUCT_SELECT =
  "id,title,description,category,price,discountPercentage,rating,stock,brand,thumbnail"

const DEFAULT_THUMBNAIL =
  "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"

export function normalizeProduct(
  product: Partial<Product> & Pick<Product, "id" | "title">
): Product {
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
    thumbnail: product.thumbnail ?? DEFAULT_THUMBNAIL,
  }
}

export const fetchProducts = createAsyncThunk(
  "data/fetchProducts",
  async (
    { limit = 10, skip = 0 }: PaginationParams = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await apiClient.get<ProductsResponse>(
        `/products?limit=${limit}&skip=${skip}&select=${PRODUCT_SELECT}`
      )
      return data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch products"
      )
    }
  }
)

export const searchProducts = createAsyncThunk(
  "data/searchProducts",
  async (
    { query, limit = 10, skip = 0 }: PaginationParams & { query: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiClient.get<ProductsResponse>(
        `/products/search?q=${encodeURIComponent(query.trim())}&limit=${limit}&skip=${skip}&select=${PRODUCT_SELECT}`
      )
      return { ...data, query: query.trim() }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to search products"
      )
    }
  }
)

export const addProduct = createAsyncThunk(
  "data/addProduct",
  async (payload: AddProductPayload, { rejectWithValue }) => {
    try {
      const data = await apiClient.post<Partial<Product>>("/products/add", payload)
      return normalizeProduct({ ...payload, ...data, id: data.id!, title: data.title ?? payload.title })
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add product"
      )
    }
  }
)

export const fetchProductById = createAsyncThunk(
  "data/fetchProductById",
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await apiClient.get<ProductDetail>(`/products/${id}`)
      return data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch product"
      )
    }
  }
)

export const updateProduct = createAsyncThunk(
  "data/updateProduct",
  async (
    { id, ...payload }: UpdateProductPayload & { id: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiClient.put<ProductDetail>(`/products/${id}`, payload)
      return data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update product"
      )
    }
  }
)

export interface DeleteProductResponse {
  id: number
  title: string
  isDeleted: boolean
  deletedOn?: string
}

export const deleteProduct = createAsyncThunk(
  "data/deleteProduct",
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await apiClient.delete<DeleteProductResponse>(
        `/products/${id}`
      )
      return data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete product"
      )
    }
  }
)
