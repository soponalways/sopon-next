"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus, Code2 } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await signUp.email({ name: data.name, email: data.email, password: data.password });
      if (result.error) {
        toast(result.error.message || "Registration failed", "error");
      } else {
        toast("Account created! Welcome! 🎉", "success");
        router.push("/");
      }
    } catch {
      toast("Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
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
            <h1 className="font-display text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-base-content/60">Join to explore the portfolio</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Full Name</span></label>
              <input {...register("name")} placeholder="John Doe"
                className={`input input-bordered rounded-xl w-full ${errors.name ? "input-error" : ""}`}
              />
              {errors.name && <span className="label-text-alt text-error mt-1">{errors.name.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Email</span></label>
              <input {...register("email")} type="email" placeholder="john@example.com"
                className={`input input-bordered rounded-xl w-full ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <span className="label-text-alt text-error mt-1">{errors.email.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Password</span></label>
              <div className="relative">
                <input {...register("password")} type={showPass ? "text" : "password"} placeholder="••••••••"
                  className={`input input-bordered rounded-xl w-full pr-12 ${errors.password ? "input-error" : ""}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <span className="label-text-alt text-error mt-1">{errors.password.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Confirm Password</span></label>
              <input {...register("confirmPassword")} type="password" placeholder="••••••••"
                className={`input input-bordered rounded-xl w-full ${errors.confirmPassword ? "input-error" : ""}`}
              />
              {errors.confirmPassword && <span className="label-text-alt text-error mt-1">{errors.confirmPassword.message}</span>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full rounded-xl gap-2 text-base shadow-lg">
              {loading ? <><span className="loading loading-spinner loading-sm" /> Creating...</> : <><UserPlus className="w-4 h-4" /> Create Account</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-base-content/60">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
