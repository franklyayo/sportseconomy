import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./infrastructure.module.css";

// Mock data fallback
const mockFacilities = [
  {
    id: "1", name: "Godswill Akpabio International Stadium", description: "A state-of-the-art multi-purpose sports complex known for its stunning architecture.", facilityType: "Stadium", location: "Uyo, Akwa Ibom", capacity: 30000, condition: "World Class", amenities: ["Floodlights", "VIP Suites", "Athletics Track"], imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop", bookingAvailable: false
  },
  {
    id: "2", name: "Teslim Balogun Stadium", facilityType: "Stadium", location: "Surulere, Lagos", capacity: 24325, condition: "Needs Renovation", amenities: ["Artificial Turf", "Locker Rooms"], imageUrl: "https://images.unsplash.com/photo-1518605368461-1eb7b63f2735?q=80&w=600&auto=format&fit=crop", bookingAvailable: true
  },
  {
    id: "3", name: "Remo Stars Stadium", facilityType: "Stadium", location: "Ikenne, Ogun", capacity: 5000, condition: "Excellent", amenities: ["Natural Grass", "Media Center", "Gymnasium"], imageUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=600&auto=format&fit=crop", bookingAvailable: true
  },
  {
    id: "4", name: "National Stadium Surulere (Indoor)", facilityType: "Indoor Arena", location: "Surulere, Lagos", capacity: 3000, condition: "Poor", amenities: ["Hardwood Floor"], imageUrl: null, bookingAvailable: false
  }
];

export default async function InfrastructureDashboard() {
  let facilities = [];
  
  try {
    const dbFacilities = await prisma.facility.findMany({
      orderBy: { name: 'asc' },
    });
    
    if (dbFacilities.length > 0) {
      facilities = dbFacilities;
    } else {
      facilities = mockFacilities;
    }
  } catch (error) {
    console.warn("DB connection failed or timeout, using mock data", error.message);
    facilities = mockFacilities;
  }

  return (
    <div className={styles.infraDashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Infrastructure Hub</h1>
          <p className={styles.subtitle}>Directory of stadiums, training grounds, and sports facilities.</p>
        </div>
        <div className={styles.actions}>
          <button className="button-primary">+ Add Facility</button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Filters Sidebar */}
        <aside className={`${styles.filtersSidebar} card`}>
          <h3 className={styles.filterTitle}>Directory Filters</h3>
          
          <div className={styles.filterGroup}>
            <label>Facility Type</label>
            <select className={styles.select}>
              <option>All Types</option>
              <option>Stadium</option>
              <option>Training Pitch</option>
              <option>Indoor Arena</option>
              <option>Gymnasium</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>State</label>
            <select className={styles.select}>
              <option>Any Location</option>
              <option>Lagos</option>
              <option>Akwa Ibom</option>
              <option>Abuja</option>
              <option>Ogun</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Availability</label>
            <select className={styles.select}>
              <option>Any Status</option>
              <option>Available for Booking</option>
              <option>Currently Unavailable</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Condition</label>
            <select className={styles.select}>
              <option>Any Condition</option>
              <option>World Class</option>
              <option>Excellent</option>
              <option>Needs Renovation</option>
            </select>
          </div>
          
          <button className={styles.applyBtn}>Apply Filters</button>
        </aside>

        {/* Facilities Grid */}
        <div className={styles.facilitiesGrid}>
          {facilities.map(facility => (
            <Link href={`/dashboard/infrastructure/${facility.id}`} key={facility.id} className={`${styles.facilityCard} card`}>
              <div className={styles.facilityImageContainer}>
                {facility.imageUrl ? (
                  <Image src={facility.imageUrl} alt={facility.name} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div className={styles.placeholderImage}>🏟️</div>
                )}
                {facility.bookingAvailable ? (
                  <div className={styles.badgeAvailable}>Available</div>
                ) : (
                  <div className={styles.badgeUnavailable}>Unavailable</div>
                )}
              </div>
              <div className={styles.facilityInfo}>
                <h3 className={styles.facilityName}>{facility.name}</h3>
                <p className={styles.facilityLocation}>📍 {facility.location}</p>
                
                <div className={styles.facilityMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Type</span>
                    <span className={styles.metaValue}>{facility.facilityType}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Capacity</span>
                    <span className={styles.metaValue}>{facility.capacity ? facility.capacity.toLocaleString() : 'N/A'}</span>
                  </div>
                </div>

                <div className={styles.conditionSection}>
                  <span className={`${styles.conditionBadge} ${
                    facility.condition.includes('Renovation') || facility.condition === 'Poor' 
                      ? styles.conditionPoor 
                      : facility.condition === 'World Class' ? styles.conditionWorldClass : styles.conditionGood
                  }`}>
                    {facility.condition}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
