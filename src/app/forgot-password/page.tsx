"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, ArrowLeft, CheckCircle } from "lucide-react";
import styles from "../login/auth.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear errors when step changes
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
  }, [step]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send verification code.");
      }

      if (data.code) {
        setCode(data.code);
        setSuccessMessage(`Code sent! (Dev Auto-fill: ${data.code})`);
      } else {
        setSuccessMessage("Verification code sent successfully.");
      }

      setTimeout(() => {
        setStep(2);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Error sending code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Verification code is required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid or expired verification code.");
      }

      setSuccessMessage("Code verified successfully.");
      setTimeout(() => {
        setStep(3);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccessMessage("Password reset successfully.");
      setTimeout(() => {
        setStep(4);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        {/* Top Header Logo */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Brain className={styles.logoIcon} size={32} strokeWidth={2.5} />
            <span>MindUnite</span>
          </div>
          <p className={styles.subtitle}>
            Recover your access and connect with other brain health professionals.
          </p>
        </div>

        {/* Errors & Success Messages */}
        {error && <div className={styles.errorAlert}>{error}</div>}
        {successMessage && (
          <div className={styles.errorAlert} style={{ backgroundColor: "#e6f4ea", borderColor: "#a3cfbb", color: "#0f5132" }}>
            {successMessage}
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <>
            <h2 className={styles.title}>Forgot Password</h2>
            <form onSubmit={handleSendCode}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">
                  Enter your email address
                </label>
                <input
                  type="email"
                  id="email"
                  className={styles.input}
                  placeholder="e.g., sarah@mindunite.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          </>
        )}

        {/* STEP 2: Verify Code */}
        {step === 2 && (
          <>
            <h2 className={styles.title}>Verify Code</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "left", marginBottom: 16 }}>
              A 6-digit verification code has been sent to <strong>{email}</strong>.
            </p>
            <form onSubmit={handleVerifyCode}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="code">
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  id="code"
                  maxLength={6}
                  className={styles.input}
                  placeholder="123456"
                  style={{ letterSpacing: 4, textAlign: "center", fontSize: 16, fontWeight: 700 }}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  disabled={loading}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 16 }}>
              <button
                type="button"
                className={styles.toggleLink}
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Change Email
              </button>
              <button
                type="button"
                className={styles.toggleLink}
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={handleSendCode}
                disabled={loading}
              >
                Resend Code
              </button>
            </div>
          </>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <>
            <h2 className={styles.title}>Create New Password</h2>
            <form onSubmit={handleResetPassword}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="newPassword">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className={styles.input}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={styles.input}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {/* STEP 4: Success Message */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0" }}>
            <CheckCircle size={56} style={{ color: "#198754", marginBottom: 16 }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              Password Reset Done!
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.5 }}>
              Your password has been successfully updated. You can now log in with your new credentials.
            </p>
            <button
              onClick={() => router.push("/login")}
              className={styles.submitBtn}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </div>
        )}

        {/* Bottom Back Link */}
        {step !== 4 && (
          <div className={styles.toggleContainer} style={{ marginTop: 20 }}>
            <Link href="/login" className={styles.toggleLink} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
