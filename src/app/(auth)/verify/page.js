"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../auth.module.css";

function VerifyForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
      
      const response = await fetch(`${authUrl}/v1/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "signup",
          email,
          token: code
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.message || "Invalid verification code");
      }

      setSuccess("Email verified successfully! Redirecting to login...");
      
      // Save token logic would go here, or just redirect to login to force fresh session
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <Link href="/" className={styles.logoArea}>
        <div className={styles.logoIcon}>N</div>
        <span>NaijaSports</span>
      </Link>
      
      <h2 className={styles.authTitle}>Verify Your Email</h2>
      <p className={styles.authSubtitle}>
        We sent a verification code to <strong>{email}</strong>. Please enter it below.
      </p>

      {error && <div className={styles.errorMsg}>{error}</div>}
      {success && <div className={styles.successMsg}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="code">Verification Code</label>
          <input 
            type="text" 
            id="code"
            className={styles.formInput} 
            required 
            placeholder="e.g. 123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <button type="submit" className={`button-primary ${styles.submitBtn}`} disabled={isLoading || !email}>
          {isLoading ? "Verifying..." : "Verify Account"}
        </button>
      </form>

      <div className={styles.authLinks}>
        Didn't receive the code? <button style={{background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>Resend</button>
      </div>
    </div>
  );
}

export default function Verify() {
  return (
    <div className={styles.authLayout}>
      <div className={styles.authImageSide}>
        <div className={styles.imageOverlay}>
          <div className={styles.heroText}>
            <h1>Secure your account.</h1>
            <p>Verification ensures the integrity of the platform and protects athletes from fraudulent scouts.</p>
          </div>
        </div>
      </div>
      
      <div className={styles.authFormSide}>
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyForm />
        </Suspense>
      </div>
    </div>
  );
}
