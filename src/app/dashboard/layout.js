import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";
import styles from "./dashboard.module.css";

export const metadata = {
  title: "Dashboard | Nigeria Sports Platform",
  description: "User dashboard for the one-stop portal.",
};

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoIcon}>N</div>
          <span>NaijaSports</span>
        </div>
        
        <nav className={styles.sidebarNav}>
          <div className={styles.navGroup}>
            <div className={styles.navGroupTitle}>Core Modules</div>
            <Link href="/dashboard" className={`${styles.navItem} ${styles.active}`}>
              <span>📊</span> Overview
            </Link>
            <Link href="/dashboard/talent" className={styles.navItem}>
              <span>🔍</span> Talent Discovery
            </Link>
            <Link href="/dashboard/network" className={styles.navItem}>
              <span>👥</span> Social Network
            </Link>
            <Link href="/dashboard/organizations" className={styles.navItem}>
              <span>🏢</span> Organizations & Federations
            </Link>
            <Link href="/dashboard/events" className={styles.navItem}>
              <span>🏆</span> Events
            </Link>
          </div>
          
          <div className={styles.navGroup}>
            <div className={styles.navGroupTitle}>Services</div>
            <Link href="/dashboard/infrastructure" className={styles.navItem}>
              <span>🏟️</span> Infrastructure Hub
            </Link>
            <Link href="/dashboard/funding" className={styles.navItem}>
              <span>💰</span> Financing
            </Link>
            <Link href="/dashboard/knowledge" className={styles.navItem}>
              <span>📚</span> Knowledge Center
            </Link>
          </div>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>AA</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>Ahmed A.</div>
              <div className={styles.userRole}>Athlete</div>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search athletes, events, or facilities..." />
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.iconBtn}>🔔</button>
            <button className={styles.iconBtn}>⚙️</button>
          </div>
        </header>
        
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
