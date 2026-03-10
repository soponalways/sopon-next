"use client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});
type FormData = z.infer<typeof schema>;

const contactInfo = [
  { icon: <Mail className="w-5 h-5" />, label: "Email", value: "soponislam132s@gmail.com", href: "mailto:soponislam132s@gmail.com" },
  { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "Bangladesh 🇧🇩", href: null },
  { icon: <Phone className="w-5 h-5" />, label: "Available", value: "Mon - Sat, 9AM - 6PM", href: null },
];

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        toast("Message sent successfully! I'll get back to you soon. 🎉", "success");
        reset();
      } else {
        toast(result.error || "Failed to send message", "error");
      }
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-base-200/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-mono text-sm mb-3">// GET IN TOUCH</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">Let's Work Together</h2>
          <p className="text-base-content/60 max-w-lg mx-auto">Have a project in mind? Let's build something amazing together.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h3 className="font-display text-2xl font-bold mb-3">Say Hello!</h3>
              <p className="text-base-content/60 leading-relaxed">
                I'm currently available for freelance work, full-time positions, or just a friendly chat about web development.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-base-100 border border-base-300/50 hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 font-mono">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="font-medium hover:text-primary transition-colors">{info.value}</a>
                    ) : (
                      <p className="font-medium">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Status */}
            <div className="p-4 rounded-2xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-success animate-pulse" />
                <span className="font-semibold text-success">Available for new projects</span>
              </div>
              <p className="text-sm text-base-content/60 mt-1">Current response time: within 24 hours</p>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="bg-base-100 rounded-3xl p-8 border border-base-300/50 shadow-xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Your Name</span></label>
                  <input
                    {...register("name")}
                    placeholder="John Doe"
                    className={`input input-bordered rounded-xl w-full focus:input-primary ${errors.name ? "input-error" : ""}`}
                  />
                  {errors.name && <span className="label-text-alt text-error mt-1">{errors.name.message}</span>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Email Address</span></label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="john@example.com"
                    className={`input input-bordered rounded-xl w-full focus:input-primary ${errors.email ? "input-error" : ""}`}
                  />
                  {errors.email && <span className="label-text-alt text-error mt-1">{errors.email.message}</span>}
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Subject</span></label>
                <input
                  {...register("subject")}
                  placeholder="Project inquiry..."
                  className={`input input-bordered rounded-xl w-full focus:input-primary ${errors.subject ? "input-error" : ""}`}
                />
                {errors.subject && <span className="label-text-alt text-error mt-1">{errors.subject.message}</span>}
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Message</span></label>
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Tell me about your project..."
                  className={`textarea textarea-bordered rounded-xl w-full focus:textarea-primary resize-none ${errors.message ? "textarea-error" : ""}`}
                />
                {errors.message && <span className="label-text-alt text-error mt-1">{errors.message.message}</span>}
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full rounded-xl gap-2 text-base shadow-lg hover:shadow-primary/30 transition-all duration-300">
                {loading ? (
                  <><span className="loading loading-spinner loading-sm" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
