import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loginUser } from "@/store/slices/authSlice"

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  )

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError("")

    if (!username.trim()) {
      setLocalError("Username is required")
      return
    }

    if (!password.trim()) {
      setLocalError("Password is required")
      return
    }

    await dispatch(loginUser({ username: username.trim(), password })).then(
      (result) => {
        if (loginUser.rejected.match(result)) {
          const errorMsg =
            typeof result.payload === "string" ? result.payload : "Login failed"
          setLocalError(errorMsg)
        } else if (loginUser.fulfilled.match(result)) {
          // Clear form on success
          setUsername("")
          setPassword("")
          navigate("/products")
        }
      }
    )
  }

  return (
    <div
      className={cn("flex w-full max-w-md flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username and password below to login
          </CardDescription>
          {isAuthenticated && (
            <div className="mt-2 rounded-md bg-primary/10 p-3 text-sm text-primary">
              ✓ Login successful!
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
                <FieldDescription className="text-xs text-muted-foreground">
                  Try: emilys
                </FieldDescription>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <FieldDescription className="text-xs text-muted-foreground">
                  Try: emilyspass
                </FieldDescription>
              </Field>

              {(error || localError) && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  ✗ {error || localError}
                </div>
              )}

              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="font-medium hover:underline">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Demo credentials info */}
      <Card className="border-primary/20 bg-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Demo Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div>
            <span className="font-mono font-medium">Username:</span>{" "}
            <span className="font-mono text-primary">
              emilys
            </span>
          </div>
          <div>
            <span className="font-mono font-medium">Password:</span>{" "}
            <span className="font-mono text-primary">
              emilyspass
            </span>
          </div>
          <p className="pt-2 text-primary">
            Using dummyjson.com authentication API
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
