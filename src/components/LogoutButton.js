"use client";

import { useRouter } from "next/navigation";
import styles from "../app/dashboard/dashboard.module.css";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = (e) => {
    e.preventDefault();
    // Clear localStorage
    localStorage.removeItem('neon_access_token');
    localStorage.removeItem('neon_refresh_token');
    
    // Clear the session cookie
    document.cookie = "neon_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Redirect to home
    router.push("/");
  };

  return (
    <button onClick={handleLogout} className={styles.logoutBtn} style={{ cursor: "pointer", border: "none", background: "none" }}>
      Sign Out
    </button>
  );
}
