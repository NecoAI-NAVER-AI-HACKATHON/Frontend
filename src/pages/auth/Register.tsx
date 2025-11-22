// src/pages/auth/Register.tsx
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/lib/services/authService";
import { useUser } from "@/contexts/UserContext";

const schema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Minimum 6 characters"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const { fetchUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    try {
      await AuthService.register(values);
      // Token is stored in localStorage by AuthService.register()
      
      // Try to fetch user profile after successful registration
      // Don't fail registration if profile fetch fails (500 error)
      try {
        await fetchUser();
      } catch (profileError: any) {
        // If profile fetch fails (e.g., 500 error), still allow registration to proceed
        // The UserContext will try again on mount
        console.warn("Failed to fetch user profile after registration, but registration was successful:", profileError);
        if (profileError.response?.status !== 500) {
          // Only show error if it's not a server error (500)
          toast.warning("Account created, but could not load profile", {
            description: "You can still access the app.",
          });
        }
      }

      toast.success("Account created successfully!", {
        description: "Welcome! Redirecting to your workspaces...",
      });

      // Small delay to show the success toast before navigation
      setTimeout(() => {
        navigate("/workspaces");
      }, 500);
    } catch (err: any) {
      toast.error("Registration failed", {
        description: err.message ?? "Unable to create account. Please try again.",
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Full-page purple background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#3a2a8a] via-[#4a369c] to-[#2f2268]" />

      {/* Content */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* LEFT copy (aligned left) */}
        <div className="flex items-center text-white">
          <div className="w-full pl-8 pr-6 py-14 md:pl-16 lg:pl-24">
            <div className="mb-8 flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-10 h-10" />
              <div>
                <p className="text-lg font-semibold tracking-wide">NecoAI</p>
                <p className="text-xs text-white/70">Automate smarter</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold leading-tight md:text-4xl">
              Create your account to build{" "}
              <span className="text-sky-300">AI workflows</span> faster.
            </h2>
            <p className="mt-3 max-w-md text-white/80">
              Spin up flows, manage credentials, and collaborate with your team.
            </p>

            <div className="mt-10 grid max-w-md grid-cols-2 gap-4">
              <button className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/10">
                Pricing & Plans
              </button>
              <button className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/10">
                Docs
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: registration form card */}
        <div className="flex items-center justify-center px-6 py-14">
          <div className="w-full max-w-md rounded-3xl bg-white/75 p-8 shadow-xl ring-1 ring-black/5 backdrop-blur-md dark:bg-zinc-900/60 dark:ring-white/10">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Sign Up for <span className="text-indigo-600">NecoAI</span>
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Start automating in minutes. It’s quick and easy.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-11 rounded-xl bg-white ring-1 ring-zinc-200 focus-visible:ring-2 dark:bg-zinc-900/50 dark:ring-zinc-800"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••••"
                  autoComplete="new-password"
                  className="h-11 rounded-xl bg-white ring-1 ring-zinc-200 focus-visible:ring-2 dark:bg-zinc-900/50 dark:ring-zinc-800"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••••"
                  autoComplete="new-password"
                  className="h-11 rounded-xl bg-white ring-1 ring-zinc-200 focus-visible:ring-2 dark:bg-zinc-900/50 dark:ring-zinc-800"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* CTA */}
              <Button
                type="submit"
                className="mt-2 h-11 w-full rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </Button>

              {/* Divider without square */}
              <div className="my-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-xs text-zinc-500">or</span>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* Google */}
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl"
                onClick={() =>
                  (window.location.href = AuthService.googleSignInUrl())
                }
              >
                <span className="mr-2">G</span> Continue with Google
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
