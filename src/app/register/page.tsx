"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain } from "lucide-react";
import { registerUser, clearAuthError } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import styles from "../login/auth.module.css";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser, error } = useSelector((state: RootState) => state.auth);

  // Clear errors on mount
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

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setValidationError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    dispatch(registerUser({ firstName, lastName, email, password }));
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

        <h2 className={styles.title}>Create Account</h2>

        {(validationError || error) && (
          <div className={styles.errorAlert}>
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className={styles.input}
                placeholder="Sarah"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className={styles.input}
                placeholder="Rahman"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="sarah@mindunite.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password (min 6 chars)
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
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Agree & Join
          </button>
        </form>

        <div className={styles.toggleContainer}>
          Already on MindUnite?
          <Link href="/login" className={styles.toggleLink}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
