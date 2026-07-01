"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain } from "lucide-react";
import { loginUser, clearAuthError } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import styles from "./auth.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser, error } = useSelector((state: RootState) => state.auth);

  // Clear errors on load
  useEffect(() => {
    dispatch(clearAuthError());
    setValidationError(null);
  }, [dispatch]);

  // Redirect if logged in
  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email || !password) {
      setValidationError("All fields are required.");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Brain className={styles.logoIcon} size={32} strokeWidth={2.5} />
            <span>MindUnite</span>
          </div>
          <p className={styles.subtitle}>
            The networking platform for brain health professionals and students.
          </p>
        </div>

        <h2 className={styles.title}>Welcome Back</h2>

        {(validationError || error) && (
          <div className={styles.errorAlert}>
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="e.g., sarah@mindunite.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Secure Login
          </button>
        </form>

        <div className={styles.toggleContainer}>
          New to MindUnite?
          <Link href="/register" className={styles.toggleLink}>
            Join now
          </Link>
        </div>
      </div>
    </div>
  );
}
