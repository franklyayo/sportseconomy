import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./events.module.css";

// Mock data fallback
const mockEvents = [
  {
    id: "1", title: "National U-17 Football Championship", description: "The premier youth football tournament showcasing the best talents across all 36 states.", sport: "Football", location: "Lagos National Stadium", date: new Date("2026-08-15T10:00:00Z"), status: "Upcoming", bannerUrl: "https://images.unsplash.com/photo-1518605368461-1eb7b63f2735?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "2", title: "Abuja Marathon 2026", description: "Annual city marathon drawing thousands of athletes and spectators to the capital city.", sport: "Athletics", location: "Eagle Square, Abuja", date: new Date("2026-09-02T06:00:00Z"), status: "Upcoming", bannerUrl: "https://images.unsplash.com/photo-1551280857-2b9bbe5260fc?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "3", title: "NBBF Premier League Finals", description: "The climax of the national basketball season.", sport: "Basketball", location: "Indoor Sports Hall, Surulere", date: new Date("2026-07-25T18:00:00Z"), status: "Upcoming", bannerUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=600&auto=format&fit=crop"
  }
];

export default async function EventsDashboard() {
  let events = [];
  
  try {
    const dbEvents = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
    
    if (dbEvents.length > 0) {
      events = dbEvents;
    } else {
      events = mockEvents;
    }
  } catch (error) {
    console.warn("DB connection failed or timeout, using mock data", error.message);
    events = mockEvents;
  }

  return (
    <div className={styles.eventsDashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Events & Competitions</h1>
          <p className={styles.subtitle}>Discover and register for upcoming tournaments across Nigeria.</p>
        </div>
        <div className={styles.actions}>
          <button className="button-primary">+ Create Event</button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Filters Sidebar */}
        <aside className={`${styles.filtersSidebar} card`}>
          <h3 className={styles.filterTitle}>Event Filters</h3>
          
          <div className={styles.filterGroup}>
            <label>Sport</label>
            <select className={styles.select}>
              <option>All Sports</option>
              <option>Football</option>
              <option>Basketball</option>
              <option>Athletics</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Location</label>
            <select className={styles.select}>
              <option>Any Location</option>
              <option>Lagos</option>
              <option>Abuja</option>
              <option>Port Harcourt</option>
              <option>Kano</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Status</label>
            <select className={styles.select}>
              <option>Upcoming</option>
              <option>Ongoing</option>
              <option>Completed</option>
            </select>
          </div>
          
          <button className={styles.applyBtn}>Apply Filters</button>
        </aside>

        {/* Events Grid */}
        <div className={styles.eventsGrid}>
          {events.map(event => (
            <Link href={`/dashboard/events/${event.id}`} key={event.id} className={`${styles.eventCard} card`}>
              <div className={styles.eventBannerContainer}>
                {event.bannerUrl ? (
                  <Image src={event.bannerUrl} alt={event.title} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div className={styles.placeholderBanner}>{event.title.charAt(0)}</div>
                )}
                <div className={styles.statusBadge}>{event.status}</div>
              </div>
              <div className={styles.eventInfo}>
                <div className={styles.eventDate}>
                  <span className={styles.dateMonth}>{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className={styles.dateDay}>{new Date(event.date).getDate()}</span>
                </div>
                <div className={styles.eventDetails}>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventLocation}>📍 {event.location}</p>
                  <p className={styles.eventSport}>{event.sport}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
