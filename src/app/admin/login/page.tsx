"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Eye, EyeOff, AlertCircle, Sparkles, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";

type LoginStep = "login" | "forgot-otp";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("login");

  // Login state
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password state
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setForgotError(null);
    setForgotSuccess(null);
    setForgotLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "saisahithikothapalli@gmail.com" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpSentMessage(data.message || "OTP sent to saisahithikothapalli@gmail.com");
      setStep("forgot-otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!otp || otp.length < 6) {
      setForgotError("Please enter the 6-digit OTP.");
      return;
    }
    if (newPass.length < 6) {
      setForgotError("Password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setForgotError("Passwords do not match.");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password reset failed");
      setForgotSuccess("Password reset successfully! You can now log in.");
      setTimeout(() => {
        setStep("login");
        setOtp("");
        setNewPass("");
        setConfirmPass("");
        setForgotSuccess(null);
      }, 2000);
    } catch (err: any) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="luxury-card p-8 space-y-8 bg-[#0F0F15] shadow-luxury-dark border border-white/[0.08]">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20">
                <Sparkles size={22} className="text-accent-violet" />
              </div>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-muted-foreground font-sans tracking-wide">
              Sahithi AI Portfolio CMS
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* ── LOGIN STEP ── */}
            {step === "login" && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans ml-1">Username</label>
                  <div className="relative">
                    <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                      required
                      className="w-full bg-[#181824] border border-white/20 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 text-white placeholder:text-zinc-500 transition-colors"
                      placeholder="Enter username"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-sans ml-1">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      required
                      className="w-full bg-[#181824] border border-white/20 rounded-xl pl-11 pr-12 py-3 text-sm focus:outline-none focus:border-violet-500 text-white placeholder:text-zinc-500 transition-colors"
                      placeholder="Enter password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Access Dashboard</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={forgotLoading}
                  className="w-full text-center text-xs text-zinc-400 hover:text-violet-400 transition-colors pt-1 disabled:opacity-50"
                >
                  {forgotLoading ? "Sending OTP..." : "Forgot password?"}
                </button>
              </motion.form>
            )}

            {/* ── FORGOT — OTP & NEW PASSWORD STEP ── */}
            {step === "forgot-otp" && (
              <motion.form
                key="forgot-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold">
                  <Mail size={16} />
                  <span>OTP Sent to Email</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed bg-violet-500/10 border border-violet-500/20 p-3 rounded-xl">
                  {otpSentMessage || "Direct email sent to saisahithikothapalli@gmail.com with your 6-digit OTP code."}
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full bg-[#181824] border border-white/20 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-violet-500 text-white placeholder:text-zinc-500 transition-colors font-mono tracking-widest text-center"
                    placeholder="123456"
                    autoComplete="one-time-code"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">New Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      required
                      className="w-full bg-[#181824] border border-white/20 rounded-xl pl-11 pr-12 py-3 text-sm focus:outline-none focus:border-violet-500 text-white placeholder:text-zinc-500 transition-colors"
                      placeholder="New password (min 6 chars)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    >
                      {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                    className="w-full bg-[#181824] border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 text-white placeholder:text-zinc-500 transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>

                {forgotError && (
                  <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                    <AlertCircle size={14} />
                    <span>{forgotError}</span>
                  </div>
                )}

                {forgotSuccess && (
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                    <CheckCircle2 size={14} />
                    <span>{forgotSuccess}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setStep("login"); setForgotError(null); }}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ShieldCheck size={16} />}
                    <span>{forgotLoading ? "Resetting..." : "Update Password"}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {step === "login" && (
            <p className="text-center text-xs text-zinc-500">
              Private admin access only.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
