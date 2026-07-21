import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "../infrastructure.module.css";
import { BookButton } from "@/components/ActionButtons";

// Fallback mock data
const mockFacilities = [
  {
    id: "1", name: "Godswill Akpabio International Stadium", description: "A state-of-the-art multi-purpose sports complex known for its stunning architecture. Modeled after the Allianz Arena, it serves as the home ground for the Nigerian Super Eagles and Akwa United.\n\nThe facility features bulletproof VVIP areas, world-class dressing rooms, and a digital floodlight system suitable for high-definition broadcasting.", facilityType: "Stadium", location: "Uyo, Akwa Ibom", capacity: 30000, condition: "World Class", amenities: ["Floodlights", "VIP Suites", "Athletics Track", "Medical Center", "Media Tribune", "Helipad"], imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop", bookingAvailable: false
  }
];

export default async function FacilityProfile({ params }) {
  const { id } = await params;
  
  let facility = null;
  
  try {
    facility = await prisma.facility.findUnique({
      where: { id }
    });
  } catch (e) {
    console.warn("DB Error, using mock data", e.message);
  }
  
  if (!facility) {
    facility = mockFacilities.find(f => f.id === id) || mockFacilities[0];
  }

  return (
    <div className={styles.profileLayout}>
      <Link href="/dashboard/infrastructure" className={styles.backLink}>
        ← Back to Infrastructure Hub
      </Link>

      <div className={styles.facilityHero}>
        {facility.imageUrl ? (
          <Image src={facility.imageUrl} alt={facility.name} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div className={styles.placeholderImage} style={{width: '100%', height: '100%'}}>🏟️</div>
        )}
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroTopRow}>
            {facility.bookingAvailable ? (
              <span className={styles.heroStatus}>Available for Booking</span>
            ) : (
              <span className={styles.heroStatus} style={{backgroundColor: '#ef4444'}}>Currently Unavailable</span>
            )}
            <span className={styles.heroCondition}>{facility.condition}</span>
          </div>
          <h1 className={styles.heroTitle}>{facility.name}</h1>
          <div className={styles.heroLocation}>
            <span>📍 {facility.location}</span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={`${styles.sectionBox} card`}>
          <h2 className={styles.sectionTitle}>Facility Overview</h2>
          <p className={styles.description}>{facility.description}</p>

          <h2 className={styles.sectionTitle} style={{marginTop: '2.5rem'}}>Amenities & Features</h2>
          <div className={styles.amenitiesGrid}>
            {facility.amenities && facility.amenities.map((amenity, idx) => (
              <div key={idx} className={styles.amenityItem}>✓ {amenity}</div>
            ))}
          </div>
        </div>

        <div className={`${styles.sectionBox} card`}>
          <div className={styles.bookingBox} style={{ borderColor: isAvailable ? 'var(--primary)' : 'var(--surface-border)' }}>
            <div className={styles.bookingTitle}>{isAvailable ? 'Available for Booking' : 'Currently Unavailable'}</div>
            <p className={styles.bookingDesc}>
              {isAvailable 
                ? 'This facility is currently open for team training, official matches, and corporate events.'
                : 'This facility is currently closed for maintenance or fully booked for the season.'}
            </p>
            <BookButton facilityId={facility.id} isAvailable={isAvailable} />
          </div>

          <h2 className={styles.sectionTitle}>Specifications</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Facility Type</span>
              <span className={styles.infoValue}>{facility.facilityType}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Capacity</span>
              <span className={styles.infoValue}>{facility.capacity ? facility.capacity.toLocaleString() : 'N/A'}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Location / State</span>
              <span className={styles.infoValue}>{facility.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
