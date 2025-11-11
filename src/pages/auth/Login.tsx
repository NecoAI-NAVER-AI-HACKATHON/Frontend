// src/pages/auth/Login.tsx
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthService, type LoginPayload } from "@/lib/services/authService";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: LoginPayload) => {
    try {
      const user = await AuthService.login(values);
      if (user.token) {
        localStorage.setItem("access_token", user.token);
      }

      navigate("/workspaces");
    } catch (err: any) {
      alert(err.message ?? "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Full-page purple background (no right gradient) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#3a2a8a] via-[#4a369c] to-[#2f2268]" />

      {/* Content */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* LEFT: copy shifted to the left */}
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
              Sign in to build, run & monitor your{" "}
              <span className="text-sky-300">AI workflows</span>.
            </h2>
            <p className="mt-3 max-w-md text-white/80">
              Access your flows, execution history, credentials, and team
              workspace.
            </p>

            <div className="mt-10 grid max-w-md grid-cols-2 gap-4">
              <button className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/10">
                Documentation
              </button>
              <button className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/10">
                Status Page
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: login card on top of purple */}
        <div className="flex items-center justify-center px-6 py-14">
          <div className="w-full max-w-md rounded-3xl bg-white/75 p-8 shadow-xl ring-1 ring-black/5 backdrop-blur-md dark:bg-zinc-900/60 dark:ring-white/10">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Log In to <span className="text-indigo-600">NecoAI</span>
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Welcome back. Please enter your details.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Your Email
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Your Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className="h-11 rounded-xl bg-white ring-1 ring-zinc-200 focus-visible:ring-2 dark:bg-zinc-900/50 dark:ring-zinc-800"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700"
                  />
                  Remember
                </label>
                <button
                  type="button"
                  className="text-zinc-500 underline-offset-4 hover:underline"
                >
                  Forgotten?
                </button>
              </div>

              <Button
                type="submit"
                className="mt-2 h-11 w-full rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Log In"}
              </Button>

              <div className="my-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-xs text-zinc-500">or</span>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              </div>
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

            <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Don’t have an account?{" "}
              <Link to="/register" className="text-indigo-600 hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
