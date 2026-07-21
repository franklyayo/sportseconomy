import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./talent.module.css";

// Fallback mock data in case DB connection times out
const mockTalents = [
  {
    id: "1", name: "Chinedu Obasi", sport: "Football", position: "Striker", stateOfOrigin: "Lagos", age: 18, height: 185, weight: 78, preferredFoot: "Right", stats: { goals: 24, assists: 8 }, mediaUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "2", name: "Tunde Bakare", sport: "Football", position: "Midfielder", stateOfOrigin: "Ogun", age: 20, height: 178, weight: 72, preferredFoot: "Both", stats: { goals: 5, assists: 15 }, mediaUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "3", name: "Ngozi Okonjo", sport: "Football", position: "Center Back", stateOfOrigin: "Enugu", age: 19, height: 190, weight: 85, preferredFoot: "Right", stats: { tacklesPerGame: 4.5 }, mediaUrl: "https://images.unsplash.com/photo-1518605368461-1eb7b63f2735?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "4", name: "Ibrahim Musa", sport: "Football", position: "Winger", stateOfOrigin: "Kano", age: 17, height: 172, weight: 65, preferredFoot: "Left", stats: { goals: 11, assists: 14 }, mediaUrl: "https://images.unsplash.com/photo-1551280857-2b9bbe5260fc?q=80&w=300&auto=format&fit=crop"
  }
];

export default async function TalentDashboard() {
  let talents = [];
  
  try {
    // Attempt to fetch from Neon Database
    const dbTalents = await prisma.talent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    if (dbTalents.length > 0) {
      talents = dbTalents;
    } else {
      talents = mockTalents;
    }
  } catch (error) {
    console.warn("Database connection failed or timeout, falling back to mock data:", error.message);
    talents = mockTalents;
  }

  return (
    <div className={styles.talentDashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Talent Identification & Discovery</h1>
          <p className={styles.subtitle}>Discover and track grassroots athletes across Nigeria.</p>
        </div>
        <div className={styles.actions}>
          <button className="button-primary">Add Talent</button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Filters Sidebar */}
        <aside className={`${styles.filtersSidebar} card`}>
          <h3 className={styles.filterTitle}>Filters</h3>
          
          <div className={styles.filterGroup}>
            <label>Sport</label>
            <select className={styles.select}>
              <option>Football</option>
              <option>Basketball</option>
              <option>Athletics</option>
              <option>Boxing</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>State of Origin</label>
            <select className={styles.select}>
              <option>All States</option>
              <option>Lagos</option>
              <option>Kano</option>
              <option>Enugu</option>
              <option>Ogun</option>
              <option>Imo</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Age Range</label>
            <div className={styles.rangeInputs}>
              <input type="number" placeholder="Min" defaultValue={15} />
              <span>-</span>
              <input type="number" placeholder="Max" defaultValue={23} />
            </div>
          </div>
          
          <button className={styles.applyBtn}>Apply Filters</button>
        </aside>

        {/* Talents Grid */}
        <div className={styles.talentsGrid}>
          {talents.map(talent => (
            <Link href={`/dashboard/talent/${talent.id}`} key={talent.id} className={`${styles.talentCard} card`}>
              <div className={styles.talentImageContainer}>
                {talent.mediaUrl ? (
                  <Image src={talent.mediaUrl} alt={talent.name} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div className={styles.placeholderImage}>{talent.name.charAt(0)}</div>
                )}
                <div className={styles.sportBadge}>{talent.sport}</div>
              </div>
              <div className={styles.talentInfo}>
                <h3 className={styles.talentName}>{talent.name}</h3>
                <p className={styles.talentDetail}>{talent.position} • {talent.age} yrs • {talent.stateOfOrigin}</p>
                <div className={styles.talentStats}>
                  {talent.stats && Object.entries(talent.stats).map(([key, value]) => (
                    <div key={key} className={styles.statPill}>
                      <span className={styles.statKey}>{key}</span>
                      <span className={styles.statVal}>{value}</span>
                    </div>
                  )).slice(0, 2)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
