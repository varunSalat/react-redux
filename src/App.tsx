import { Routes, Route, Navigate } from "react-router"

// Layouts
import AuthLayout from "./layouts/AuthLayout"
import ProtectedLayout from "./layouts/ProtectedLayout"

// Pages

import ProductListPage from "./pages/protected/ProductListPage"
import ProductDetailsPage from "./pages/protected/ProductDetailsPage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"

const App = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
      </Route>

      {/* Catch all route - redirects to products */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
