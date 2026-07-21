import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "../knowledge.module.css";

// Fallback mock data
const mockResources = [
  {
    id: "1", title: "Advanced High-Intensity Interval Training for Footballers", description: "Learn the core principles of HIIT and how it applies specifically to the stamina demands of professional football.\n\nIn this comprehensive breakdown, we explore:\n- The science behind VO2 max improvement.\n- Position-specific sprint drills for wingers vs center backs.\n- Recovery protocols to prevent muscular injuries during peak season.\n\nEnsure you consult with your team physiotherapist before integrating these advanced loads into your weekly micro-cycle.", mediaType: "Video", category: "Training", thumbnailUrl: "https://images.unsplash.com/photo-1518605368461-1eb7b63f2735?q=80&w=1200&auto=format&fit=crop", contentUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1", author: "National Sports Science Board"
  }
];

export default async function ResourceViewer({ params }) {
  const { id } = await params;
  
  let resource = null;
  
  try {
    resource = await prisma.knowledgeResource.findUnique({
      where: { id }
    });
  } catch (e) {
    console.warn("DB Error, using mock data", e.message);
  }
  
  if (!resource) {
    resource = mockResources.find(r => r.id === id) || mockResources[0];
  }

  const isVideo = resource.mediaType === 'Video';
  const isDocument = resource.mediaType === 'PDF' || resource.mediaType === 'Article';

  return (
    <div className={styles.viewerLayout}>
      <Link href="/dashboard/knowledge" className={styles.backLink}>
        ← Back to Library
      </Link>

      <div className={styles.viewerHeader}>
        <span className={styles.viewerCategory}>{resource.category}</span>
        <h1 className={styles.viewerTitle}>{resource.title}</h1>
        <div className={styles.viewerMeta}>
          <span>By {resource.author}</span>
          <span>•</span>
          <span>{resource.mediaType}</span>
        </div>
      </div>

      <div className={styles.mediaContainer}>
        {isVideo ? (
          <div className={styles.videoWrapper}>
            {/* Mock video iframe */}
            <iframe 
              className={styles.videoIframe}
              src="https://www.youtube.com/embed/M7lc1UVf-VE" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        ) : (
          <div className={styles.documentArea}>
            <div className={styles.docIcon}>{resource.mediaType === 'PDF' ? '📄' : '📝'}</div>
            <h2>{resource.title}</h2>
            <p style={{color: 'var(--text-muted)'}}>{resource.mediaType} Document</p>
            <button className={`button-primary ${styles.downloadBtn}`}>
              {resource.mediaType === 'PDF' ? 'Download PDF' : 'Read Full Article'}
            </button>
          </div>
        )}
      </div>

      <div className={`${styles.descriptionBox} card`}>
        <h3 style={{marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700}}>About this Resource</h3>
        <p style={{whiteSpace: 'pre-line', color: 'var(--text-muted)'}}>{resource.description}</p>
      </div>
    </div>
  );
}
