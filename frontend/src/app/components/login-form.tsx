/** @format */

import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Image from "next/image";
import Logo from "@/assets/logo.svg";
import Link from "next/link";
import { DialogClose } from "./ui/dialog";
import { useState } from "react";
import { login } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(formData.email, formData.password);
      console.log("Login successful:", response);

      toast.success("Login successful! Redirecting...");

      // Check if there's a redirect path stored
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } else {
        // Redirect based on user role
        if (response.user.role === 'admin') {
          router.push("/admin");
        } else if (response.user.role === 'instructor') {
          router.push("/instructor/dashboard");
        } else {
          router.push("/student/dashboard");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className={cn("flex sm:w-sm flex-col gap-2", className)} {...props}>
      <Card>
        <CardHeader className="text-center relative">
          <DialogClose
            className="sm:hidden w-fit absolute -top-1 right-2"
            asChild
          >
            <Button
              type="button"
              variant="ghost"
              className="bg-accent rounded-full"
            >
              X
            </Button>
          </DialogClose>
          <div className="mb-2">
            <Image src={Logo} alt="Logo" width={128} height={10} />
          </div>
          <div>
            <CardTitle className="text-lg text-start font-bold">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-start text-xs">
              New to Skillhub?{" "}
              <button className="border-none outline-none underline font-semibold text-xs text-gray-800">
                <Link
                  href="/signup"
                  className="border-none outline-none underline font-semibold text-xs text-gray-800"
                >
                  Sign up here!
                </Link>
              </button>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <div className="grid gap-3">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-3">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-2 my-4 items-center self-start justify-self-start">
                  <Input
                    id="rememberMe"
                    type="checkbox"
                    className="size-3 ml-1"
                  />
                  <Label htmlFor="rememberMe" className="text-gray-700">
                    Remember me
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>

              <div className="flex flex-col">
                <Link href="#" className="underline text-xs font-semibold ">
                  Forgot your password?
                </Link>
                <Link href="#" className="underline text-xs font-semibold ">
                  Didn't receive confirmation instructions?
                </Link>
              </div>

              <div className="after:border-neutral-200 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t dark:after:border-neutral-800">
                <span className="bg-white text-neutral-500 relative z-10 px-2 dark:bg-neutral-950 dark:text-neutral-400">
                  OR
                </span>
              </div>
              <div className="flex flex-col gap-4 ">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full rounded-full"
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="-3 0 262 262"
                    preserveAspectRatio="xMidYMid"
                  >
                    <path
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                      fill="#4285F4"
                    />
                    <path
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                      fill="#34A853"
                    />
                    <path
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                      fill="#FBBC05"
                    />
                    <path
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                      fill="#EB4335"
                    />
                  </svg>
                  <p className="m-auto"> Continue with Google</p>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full rounded-full"
                  disabled={loading}
                >
                  <svg fill="none" viewBox="0 0 24 24" className="">
                    <rect
                      x="2.5"
                      y="2.5"
                      width="19"
                      height="19"
                      rx="9.5"
                      fill="#1877F2"
                    ></rect>
                    <path
                      fill="#fff"
                      d="M16.12 12h-2.636v-1.781c0-.754.368-1.485 1.544-1.485h1.2V6.395s-1.087-.184-2.126-.184c-2.167 0-3.586 1.312-3.586 3.693V12H8.105v2.75h2.41v6.75h2.97v-6.757h2.214L16.115 12h.006Z"
                    ></path>
                  </svg>
                  <p className="m-auto"> Continue with Facebook</p>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full rounded-full"
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 50 50"
                  >
                    <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
                  </svg>
                  <p className="m-auto"> Continue with Twitter</p>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
