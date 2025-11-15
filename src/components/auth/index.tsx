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
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Removed email, password, and error states
  // Removed handleEmailSignIn function

  const handleGoogleSignIn = async () => {
    // setError(null) // This line was removed
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      // User signed in successfully with Google
      console.log("User signed in with Google!")
    } catch (err: any) {
      // setError(err.message) // This line was removed
      console.error("Error signing in with Google:", err.message)
    }
  }


  return (
    <div className="flex justify-center items-center h-screen w-full" {...props}>
      <Card className="w-full max-w-sm transform-none">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Removed error display */}
          <form> {/* Removed onSubmit handler */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  // Removed value and onChange
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  // Removed value and onChange
                />
              </Field>
              <Field>
                <Button type="button" className="w-full">Login</Button> {/* Changed to type="button" */}
                <Button variant="outline" type="button" onClick={handleGoogleSignIn} className="w-full mt-2"> {/* Add onClick handler for Google */}
                  Login with Google
                </Button>
                <FieldDescription className="text-center mt-4">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
