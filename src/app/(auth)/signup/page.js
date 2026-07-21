"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nin: "",
    role: "Athlete"
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
      
      if (!authUrl) {
        throw new Error("Neon Auth URL is not configured in .env");
      }

      // Neon Auth uses GoTrue under the hood
      const response = await fetch(`${authUrl}/v1/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          data: {
            name: formData.name,
            nin: formData.nin,
            role: formData.role
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.message || "Failed to sign up");
      }

      // If verification is enabled, redirect to verify page with email
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);

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
            <h1>Join the Future of Nigerian Sports.</h1>
            <p>Connect with scouts, access elite infrastructure, apply for funding, and showcase your talent to the world.</p>
          </div>
        </div>
      </div>
      
      <div className={styles.authFormSide}>
        <div className={styles.authContainer}>
          <Link href="/" className={styles.logoArea}>
            <div className={styles.logoIcon}>N</div>
            <span>NaijaSports</span>
          </Link>
          
          <h2 className={styles.authTitle}>Create an Account</h2>
          <p className={styles.authSubtitle}>Register to access the unified sports portal.</p>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name"
                name="name" 
                className={styles.formInput} 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>

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
              <label htmlFor="nin">National Identification Number (NIN)</label>
              <input 
                type="text" 
                id="nin"
                name="nin" 
                className={styles.formInput} 
                required 
                minLength={11}
                maxLength={11}
                placeholder="11-digit NIN"
                value={formData.nin}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">Platform Role</label>
              <select 
                id="role"
                name="role" 
                className={styles.formSelect} 
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Athlete">Athlete / Player</option>
                <option value="Fan">Fan / Supporter</option>
                <option value="Scout">Verified Scout / Agent</option>
                <option value="Administrator">Club Administrator</option>
                <option value="Regulator">Government / Regulator</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                name="password" 
                className={styles.formInput} 
                required 
                minLength={6}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={`button-primary ${styles.submitBtn}`} disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className={styles.authLinks}>
            Already have an account? <Link href="/login" className={styles.authLink}>Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
