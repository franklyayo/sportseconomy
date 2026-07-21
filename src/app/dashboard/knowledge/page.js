import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./knowledge.module.css";

// Mock data fallback
const mockResources = [
  {
    id: "1", title: "Advanced High-Intensity Interval Training for Footballers", description: "Learn the core principles of HIIT and how it applies specifically to the stamina demands of professional football.", mediaType: "Video", category: "Training", thumbnailUrl: "https://images.unsplash.com/photo-1518605368461-1eb7b63f2735?q=80&w=600&auto=format&fit=crop", contentUrl: "https://youtube.com/embed/dQw4w9WgXcQ", author: "National Sports Science Board"
  },
  {
    id: "2", title: "2026 Anti-Doping Regulations Handbook", description: "The official guide detailing the updated list of prohibited substances and testing procedures for the new season.", mediaType: "PDF", category: "Compliance", thumbnailUrl: "https://images.unsplash.com/photo-1551280857-2b9bbe5260fc?q=80&w=600&auto=format&fit=crop", contentUrl: "#", author: "WADA & National Anti-Doping Agency"
  },
  {
    id: "3", title: "Pre-Match Nutritional Guide", description: "What to eat 24 hours before a game to maximize performance and avoid fatigue.", mediaType: "Article", category: "Nutrition", thumbnailUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop", contentUrl: "#", author: "Team Dietitians"
  },
  {
    id: "4", title: "Understanding FIBA Rule Changes", description: "A comprehensive breakdown of the new basketball rules introduced for the current calendar year.", mediaType: "Video", category: "Rules", thumbnailUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=600&auto=format&fit=crop", contentUrl: "https://youtube.com/embed/dQw4w9WgXcQ", author: "NBBF Referees Association"
  }
];

export default async function KnowledgeDashboard() {
  let resources = [];
  
  try {
    const dbRes = await prisma.knowledgeResource.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    if (dbRes.length > 0) {
      resources = dbRes;
    } else {
      resources = mockResources;
    }
  } catch (error) {
    console.warn("DB connection failed or timeout, using mock data", error.message);
    resources = mockResources;
  }

  return (
    <div className={styles.knowledgeDashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Knowledge Center</h1>
          <p className={styles.subtitle}>Educational resources, training materials, and official compliance guidelines.</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search resources..." className={styles.searchInput} />
          </div>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Filters Sidebar */}
        <aside className={`${styles.filtersSidebar} card`}>
          <h3 className={styles.filterTitle}>Library Filters</h3>
          
          <div className={styles.filterGroup}>
            <label>Category</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}><input type="radio" name="category" defaultChecked /> All Categories</label>
              <label className={styles.radioLabel}><input type="radio" name="category" /> Training & Drills</label>
              <label className={styles.radioLabel}><input type="radio" name="category" /> Nutrition</label>
              <label className={styles.radioLabel}><input type="radio" name="category" /> Compliance & Anti-Doping</label>
              <label className={styles.radioLabel}><input type="radio" name="category" /> Rules & Regulations</label>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Media Type</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}><input type="checkbox" defaultChecked /> 📹 Videos</label>
              <label className={styles.radioLabel}><input type="checkbox" defaultChecked /> 📄 PDFs & Documents</label>
              <label className={styles.radioLabel}><input type="checkbox" defaultChecked /> 📝 Articles</label>
            </div>
          </div>
        </aside>

        {/* Resources Grid */}
        <div className={styles.resourcesGrid}>
          {resources.map(res => (
            <Link href={`/dashboard/knowledge/${res.id}`} key={res.id} className={`${styles.resourceCard} card`}>
              <div className={styles.thumbnailContainer}>
                {res.thumbnailUrl ? (
                  <Image src={res.thumbnailUrl} alt={res.title} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div className={styles.placeholderThumbnail}>📚</div>
                )}
                <div className={styles.mediaBadge}>
                  {res.mediaType === 'Video' ? '▶ Video' : res.mediaType === 'PDF' ? '📄 PDF' : '📝 Article'}
                </div>
              </div>
              <div className={styles.resourceInfo}>
                <span className={styles.categoryLabel}>{res.category}</span>
                <h3 className={styles.resourceTitle}>{res.title}</h3>
                <p className={styles.authorLabel}>By {res.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
