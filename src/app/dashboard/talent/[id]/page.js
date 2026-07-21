import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "../talent.module.css";

// Fallback mock data
const mockTalents = [
  {
    id: "1", name: "Chinedu Obasi", sport: "Football", position: "Striker", stateOfOrigin: "Lagos", age: 18, height: 185, weight: 78, preferredFoot: "Right", stats: { goals: 24, assists: 8, appearances: 30 }, achievements: ["Top Scorer, U-17 State League", "MVP Lagos Youth Cup 2025"], mediaUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "2", name: "Tunde Bakare", sport: "Football", position: "Midfielder", stateOfOrigin: "Ogun", age: 20, height: 178, weight: 72, preferredFoot: "Both", stats: { goals: 5, assists: 15, passAccuracy: "89%" }, achievements: ["Best Midfielder Ogun State Championship"], mediaUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=300&auto=format&fit=crop"
  }
];

export default async function TalentProfile({ params }) {
  const { id } = await params; // Next 15 specific `await params`
  
  let talent = null;
  
  try {
    talent = await prisma.talent.findUnique({
      where: { id }
    });
  } catch (e) {
    console.warn("DB Error, using mock data", e.message);
  }
  
  if (!talent) {
    talent = mockTalents.find(t => t.id === id) || mockTalents[0];
  }

  return (
    <div className={styles.profileLayout}>
      <Link href="/dashboard/talent" className={styles.backLink}>
        ← Back to Talent Database
      </Link>

      <div className={`${styles.profileHero} card`}>
        <div className={styles.profileAvatar}>
          {talent.mediaUrl ? (
            <Image src={talent.mediaUrl} alt={talent.name} fill style={{ objectFit: 'cover' }} />
          ) : (
            <div className={styles.placeholderImage}>{talent.name.charAt(0)}</div>
          )}
        </div>
        <div className={styles.profileDetails}>
          <h1 className={styles.profileName}>{talent.name}</h1>
          <div className={styles.profileTags}>
            <span className={`${styles.profileTag} ${styles.primaryTag}`}>{talent.sport}</span>
            <span className={styles.profileTag}>{talent.position || "Athlete"}</span>
            <span className={styles.profileTag}>{talent.stateOfOrigin} State</span>
          </div>
          <div className={styles.profileActions}>
            <button className="button-primary">⭐ Add to Watchlist</button>
            <button className={styles.buttonSecondary}>Contact Athlete</button>
            <button className={styles.buttonSecondary}>⬇️ Download Portfolio</button>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={`${styles.sectionBox} card`}>
          <h2 className={styles.sectionTitle}>Physical Attributes</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Age</span>
              <span className={styles.infoValue}>{talent.age} years</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Height</span>
              <span className={styles.infoValue}>{talent.height ? `${talent.height} cm` : 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Weight</span>
              <span className={styles.infoValue}>{talent.weight ? `${talent.weight} kg` : 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Preferred Foot</span>
              <span className={styles.infoValue}>{talent.preferredFoot || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className={`${styles.sectionBox} card`}>
          <h2 className={styles.sectionTitle}>Performance Stats</h2>
          <div className={styles.infoGrid}>
            {talent.stats && Object.entries(talent.stats).map(([key, value]) => (
              <div key={key} className={styles.infoItem}>
                <span className={styles.infoLabel} style={{ textTransform: 'capitalize' }}>{key}</span>
                <span className={styles.infoValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.sectionBox} card`} style={{ gridColumn: '1 / -1' }}>
          <h2 className={styles.sectionTitle}>Key Achievements</h2>
          <div className={styles.achievementsList}>
            {talent.achievements && talent.achievements.length > 0 ? talent.achievements.map((achievement, index) => (
              <div key={index} className={styles.achievementItem}>
                <span className={styles.achievementIcon}>🏅</span>
                <span className={styles.achievementText}>{achievement}</span>
              </div>
            )) : (
              <p style={{ color: 'var(--text-muted)' }}>No major achievements listed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
