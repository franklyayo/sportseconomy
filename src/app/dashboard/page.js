import Image from "next/image";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Welcome back, Ahmed</h1>
          <p className={styles.pageSubtitle}>Here is what's happening across Nigeria's sports ecosystem today.</p>
        </div>
        <button className="button-primary">+ Post Update</button>
      </div>

      <div className={styles.overviewGrid}>
        <div className={`${styles.statCard} card`}>
          <div className={styles.statCardIcon}>🏃</div>
          <div>
            <div className={styles.statCardTitle}>Talent Discovery</div>
            <div className={styles.statCardValue}>24 New</div>
          </div>
        </div>
        <div className={`${styles.statCard} card`}>
          <div className={styles.statCardIcon}>🏆</div>
          <div>
            <div className={styles.statCardTitle}>Upcoming Events</div>
            <div className={styles.statCardValue}>8 This Week</div>
          </div>
        </div>
        <div className={`${styles.statCard} card`}>
          <div className={styles.statCardIcon}>🏟️</div>
          <div>
            <div className={styles.statCardTitle}>Available Facilities</div>
            <div className={styles.statCardValue}>142 Hubs</div>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.mainColumn}>
          <div className={`${styles.sectionBox} card`}>
            <h3 className={styles.sectionBoxTitle}>Talent Network Discovery</h3>
            <div className={styles.imageCard}>
              <Image 
                src="/images/talent_discovery.png" 
                alt="Talent Discovery Graph"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.6" }}>
              AI-driven insights are connecting grassroots athletes with national federations. 
              The recent analytics show a 15% increase in scouting efficiency in the South-West zone.
            </p>
          </div>
        </div>

        <div className={styles.sideColumn}>
          <div className={`${styles.sectionBox} card`}>
            <h3 className={styles.sectionBoxTitle}>Social Feed</h3>
            
            <div className={styles.feedItem}>
              <div className={styles.feedAvatar} style={{ background: "linear-gradient(to right, #f59e0b, #ef4444)" }}></div>
              <div className={styles.feedContent}>
                <h4>Athletics Fed. of Nigeria</h4>
                <p>Registration for the National Trials is now open! #RoadToOlympics</p>
              </div>
            </div>
            
            <div className={styles.feedItem}>
              <div className={styles.feedAvatar} style={{ background: "linear-gradient(to right, #3b82f6, #8b5cf6)" }}></div>
              <div className={styles.feedContent}>
                <h4>Lagos Sports Council</h4>
                <p>Teslim Balogun Stadium renovation is complete. Booking is now available.</p>
              </div>
            </div>

            <div className={styles.feedItem}>
              <div className={styles.feedAvatar} style={{ background: "linear-gradient(to right, #10b981, #048b4e)" }}></div>
              <div className={styles.feedContent}>
                <h4>Ministry of Sports Dev.</h4>
                <p>New youth grants available for under-17 community clubs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
