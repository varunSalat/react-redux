import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
} from "@/lib/storage"

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  authInitializing: boolean
}

const initialState: AuthState = {
  user: getStoredUser<User>(),
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  loading: false,
  error: null,
  isAuthenticated: Boolean(getAccessToken() && getRefreshToken()),
  authInitializing: Boolean(getAccessToken()),
}

// Async thunk for login - uses dummyjson.com API
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      if (!credentials.username || !credentials.password) {
        throw new Error("Username and password are required")
      }

      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          expiresInMins: 30,
        }),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()

      return {
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          image: data.image,
        },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      )
    }
  }
)

export const refreshAuthToken = createAsyncThunk(
  "auth/refreshAuthToken",
  async (_, { rejectWithValue }) => {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      return rejectWithValue("No refresh token found")
    }

    try {
      const response = await fetch("https://dummyjson.com/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to refresh token")
      }

      const data = await response.json()

      return {
        accessToken: data.accessToken as string,
        refreshToken: data.refreshToken as string,
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to refresh token"
      )
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue, dispatch }) => {
    let token = getAccessToken()

    if (!token) {
      return rejectWithValue("No access token found")
    }

    const fetchMe = async (accessToken: string) => {
      const response = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      })

      return response
    }

    try {
      let response = await fetchMe(token)

      if (response.status === 401) {
        const refreshResult = await dispatch(refreshAuthToken())
        if (refreshAuthToken.fulfilled.match(refreshResult)) {
          token = refreshResult.payload.accessToken
          response = await fetchMe(token)
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch user")
      }

      const data = await response.json()

      return {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      } as User
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch user"
      )
    }
  }
)

// Async thunk for logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return null
})

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    data: {
      username: string
      email: string
      password: string
      firstName: string
      lastName: string
      age: number
    },
    { rejectWithValue }
  ) => {
    try {
      if (
        !data.username ||
        !data.email ||
        !data.password ||
        !data.firstName ||
        !data.lastName ||
        !data.age
      ) {
        throw new Error("All fields are required")
      }

      const response = await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      const user = await response.json()
      return user
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Registration failed"
      )
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.authInitializing = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.authInitializing = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.authInitializing = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.error = action.payload as string
        clearAuthStorage()
      })

    builder
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        clearAuthStorage()
      })

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Logout user
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.authInitializing = false
      state.error = null
    })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
