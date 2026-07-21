import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "../events.module.css";
import { RegisterButton } from "@/components/ActionButtons";

// Fallback mock data
const mockEvents = [
  {
    id: "1", title: "National U-17 Football Championship", description: "The premier youth football tournament showcasing the best talents across all 36 states. Organized by the NFF, this tournament serves as the primary selection grounds for the national youth team.\n\nScouts from major European and domestic clubs will be in attendance.", sport: "Football", location: "Lagos National Stadium, Surulere", date: new Date("2026-08-15T10:00:00Z"), endDate: new Date("2026-08-22T18:00:00Z"), status: "Upcoming", bannerUrl: "https://images.unsplash.com/photo-1518605368461-1eb7b63f2735?q=80&w=1200&auto=format&fit=crop", participantsLimit: 36
  }
];

export default async function EventProfile({ params }) {
  const { id } = await params;
  
  let event = null;
  
  try {
    event = await prisma.event.findUnique({
      where: { id }
    });
  } catch (e) {
    console.warn("DB Error, using mock data", e.message);
  }
  
  if (!event) {
    event = mockEvents.find(e => e.id === id) || mockEvents[0];
  }

  return (
    <div className={styles.profileLayout}>
      <Link href="/dashboard/events" className={styles.backLink}>
        ← Back to Events Calendar
      </Link>

      <div className={styles.eventHero}>
        {event.bannerUrl && (
          <Image src={event.bannerUrl} alt={event.title} fill style={{ objectFit: 'cover' }} />
        )}
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.heroStatus}>{event.status}</span>
          <h1 className={styles.heroTitle}>{event.title}</h1>
          <div className={styles.heroMeta}>
            <span>📍 {event.location}</span>
            <span>🏅 {event.sport}</span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={`${styles.sectionBox} card`}>
          <h2 className={styles.sectionTitle}>Event Overview</h2>
          <p className={styles.description}>{event.description}</p>
        </div>

        <div className={`${styles.sectionBox} card`}>
          <div className={styles.registerBox}>
            <div className={styles.priceTitle}>Free Registration</div>
            <RegisterButton eventId={event.id} />
            <p style={{marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
              {event.participantsLimit ? `Limited to ${event.participantsLimit} slots.` : 'Open registration.'}
            </p>
          </div>

          <h2 className={styles.sectionTitle}>Event Details</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Start Date</span>
              <span className={styles.infoValue}>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            {event.endDate && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>End Date</span>
                <span className={styles.infoValue}>{new Date(event.endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Venue</span>
              <span className={styles.infoValue}>{event.location}</span>
            </div>
          </div>
          
          <div style={{marginTop: '2rem'}}>
            <h2 className={styles.sectionTitle}>Organizer</h2>
            <div className={styles.organizerBox}>
              <div className={styles.orgAvatar}>N</div>
              <div>
                <div className={styles.orgName}>Official Federation</div>
                <div style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>Verified Account ✓</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
