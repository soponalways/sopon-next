"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, Code2 } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await signIn.email({ email: data.email, password: data.password });
      console.log({ result });
      // toast("Welcome back! 🎉", "success");
      // router.push("/admin");
      if (result?.error) {
        toast(result.error.message || "Login failed", "error");
      } else {
        toast("Welcome back! 🎉", "success");
        router.push("/admin");
      }
    } catch {
      toast("Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-base-100/80 backdrop-blur-xl rounded-3xl p-8 border border-base-300/50 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">Sopon.dev</span>
            </Link>
            <h1 className="font-display text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-base-content/60">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Email</span></label>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@example.com"
                className={`input input-bordered rounded-xl w-full focus:input-primary ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <span className="label-text-alt text-error mt-1">{errors.email.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Password</span></label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered rounded-xl w-full pr-12 focus:input-primary ${errors.password ? "input-error" : ""}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <span className="label-text-alt text-error mt-1">{errors.password.message}</span>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full rounded-xl gap-2 text-base shadow-lg hover:shadow-primary/30 transition-all duration-300">
              {loading ? (
                <><span className="loading loading-spinner loading-sm" /> Signing in...</>
              ) : (
                <><LogIn className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-base-content/60">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">Create one</Link>
            </p>
          </div>

          <Link href="/" className="block text-center text-sm text-base-content/40 hover:text-base-content/60 mt-4 transition-colors">
            ← Back to portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
