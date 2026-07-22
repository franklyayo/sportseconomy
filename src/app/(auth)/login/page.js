"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
      
      const response = await fetch(`${authUrl}/sign-in/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error("Failed to parse JSON response:", text);
        data = { msg: "Invalid response from authentication server." };
      }

      if (!response.ok) {
        throw new Error(data.error_description || data.msg || data.message || `Invalid credentials (HTTP ${response.status})`);
      }

      // Extract token safely based on Better Auth's payload structure
      const token = data.token || (data.session && data.session.token) || "";
      
      // Here you would typically save the token to a secure cookie via a Next.js API route
      // For demonstration, we will save to localStorage and redirect
      localStorage.setItem('neon_access_token', token);
      
      // Set a cookie so the middleware can read it
      document.cookie = `neon_session=${token}; path=/; max-age=86400; SameSite=Lax`;
      
      // We simulate setting a session cookie by hitting an internal route, but for now just redirect
      router.push("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authLayout}>
      <div className={styles.authImageSide}>
        <div className={styles.imageOverlay}>
          <div className={styles.heroText}>
            <h1>Welcome Back.</h1>
            <p>Access your dashboard to connect with the Nigerian sports ecosystem.</p>
          </div>
        </div>
      </div>
      
      <div className={styles.authFormSide}>
        <div className={styles.authContainer}>
          <Link href="/" className={styles.logoArea}>
            <div className={styles.logoIcon}>N</div>
            <span>NaijaSports</span>
          </Link>
          
          <h2 className={styles.authTitle}>Sign In</h2>
          <p className={styles.authSubtitle}>Enter your credentials to access your account.</p>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email" 
                className={styles.formInput} 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                name="password" 
                className={styles.formInput} 
                required 
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div style={{textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1.5rem'}}>
              <a href="#" className={styles.authLink} style={{fontSize: '0.875rem', fontWeight: 500}}>Forgot Password?</a>
            </div>

            <button type="submit" className={`button-primary ${styles.submitBtn}`} disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className={styles.authLinks}>
            Don't have an account? <Link href="/signup" className={styles.authLink}>Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
