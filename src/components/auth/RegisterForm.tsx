import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
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
import { errorToast, successToast } from "@/lib/toast"
import { registerUser } from "@/store/slices/authSlice"

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [age, setAge] = useState("")
  const [localError, setLocalError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError("")
    setSuccessMessage("")

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !age.trim()
    ) {
      const message = "All fields are required"
      setLocalError(message)
      errorToast(message)
      return
    }

    const ageValue = Number(age)
    if (Number.isNaN(ageValue) || ageValue <= 0) {
      const message = "Please enter a valid age"
      setLocalError(message)
      errorToast(message)
      return
    }

    await dispatch(
      registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        age: ageValue,
      })
    ).then((result) => {
      if (registerUser.rejected.match(result)) {
        const errorMsg =
          typeof result.payload === "string"
            ? result.payload
            : "Registration failed"
        setLocalError(errorMsg)
        errorToast(errorMsg)
      } else if (registerUser.fulfilled.match(result)) {
        const message =
          "Registration successful. Please login with your new credentials."
        successToast(message)
        setFirstName("")
        setLastName("")
        setUsername("")
        setEmail("")
        setPassword("")
        setAge("")
        navigate("/login")
      }
    })
  }

  return (
    <div
      className={cn("flex w-full max-w-md flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Register a new user using the dummyjson users API.
          </CardDescription>
          {successMessage && (
            <div className="mt-2 rounded-md bg-primary/10 p-3 text-sm text-primary">
              ✓ {successMessage}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="age">Age</FieldLabel>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={loading}
                  required
                  className="[&::-moz-appearance:textfield] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  min={1}
                />
              </Field>

              {(error || localError) && (
                <Field className="sm:col-span-2">
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    ✗ {error || localError}
                  </div>
                </Field>
              )}

              <Field className="sm:col-span-2">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Registering..." : "Register"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium hover:underline">
                    Login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Register with dummyjson</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div>
            <span className="font-mono font-medium">API:</span>{" "}
            <span className="font-mono text-primary">
              POST https://dummyjson.com/users/add
            </span>
          </div>
          <div>
            <span className="font-mono font-medium">Required:</span>{" "}
            <span className="font-mono text-primary">
              firstName, lastName, username, email, password, age
            </span>
          </div>
          <p className="pt-2 text-primary">
            On success the API returns the created user object.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
