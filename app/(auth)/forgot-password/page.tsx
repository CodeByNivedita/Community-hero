"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { requestPasswordReset } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { Mail, Loader2, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
 const [email, setEmail] = useState("");
 const [loading, setLoading] = useState(false);
 const [submitted, setSubmitted] = useState(false);

 const handleReset = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!email) {
 toast.error("Please enter your email address");
 return;
 }
 
 setLoading(true);
 try {
 await requestPasswordReset(email);
 setSubmitted(true);
 toast.success("Password reset email sent!");
 } catch (error: any) {
 toast.error(error.message || "Failed to send reset email.");
 } finally {
 setLoading(false);
 }
 };

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-white/10"
 >
 <div className="text-center mb-8">
 <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
 <p className="text-primary-foreground dark:text-muted-foreground">
 {submitted 
 ? "Check your email for reset instructions."
 : "Enter your email and we'll send you a link to reset your password."}
 </p>
 </div>

 {!submitted ? (
 <form onSubmit={handleReset} className="space-y-5">
 <div>
 <div className="relative">
 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-muted-foreground h-5 w-5" />
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="Email Address"
 className="w-full bg-white/20 dark:bg-black/30 border border-white/10 text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
 />
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full bg-primary hover:bg-primary text-foreground rounded-xl py-3 font-semibold shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
 >
 {loading ? (
 <Loader2 className="h-5 w-5 animate-spin" />
 ) : (
 <>
 <span>Send Reset Link</span>
 <ArrowRight className="h-4 w-4" />
 </>
 )}
 </button>
 </form>
 ) : (
 <div className="mt-6">
 <Link href="/login">
 <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 font-semibold shadow-lg transition-all flex items-center justify-center space-x-2">
 Back to Login
 </button>
 </Link>
 </div>
 )}

 {!submitted && (
 <div className="mt-8 text-center">
 <p className="text-primary-foreground">
 Remember your password?{" "}
 <Link href="/login" className="text-foreground font-semibold hover:underline">
 Login here
 </Link>
 </p>
 </div>
 )}
 </motion.div>
 );
}
