import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import dataReducer from "./slices/dataSlice"
import { authMiddleware } from "./middleware/auth"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }).concat(authMiddleware),
  devTools: import.meta.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
