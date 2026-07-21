import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./organizations.module.css";

// Mock data fallback
const mockOrganizations = [
  {
    id: "1", name: "Nigeria Football Federation (NFF)", orgType: "National Federation", sport: "Football", complianceMetrics: ["NSC Certified", "Audit Passed"], establishedYear: 1945, headquarters: "Abuja", logoUrl: "https://images.unsplash.com/photo-1518605368461-1eb7b63f2735?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "2", name: "Lagos State Sports Commission", orgType: "State Council", sport: "All", complianceMetrics: ["NSC Certified"], establishedYear: 2017, headquarters: "Surulere, Lagos", logoUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "3", name: "Nigeria Basketball Federation (NBBF)", orgType: "National Federation", sport: "Basketball", complianceMetrics: ["Audit Pending"], establishedYear: 1964, headquarters: "Abuja", logoUrl: null
  },
  {
    id: "4", name: "Kano Pillars FC", orgType: "Club", sport: "Football", complianceMetrics: ["League Cleared"], establishedYear: 1990, headquarters: "Kano", logoUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=200&auto=format&fit=crop"
  }
];

export default async function OrganizationsDashboard() {
  let organizations = [];
  
  try {
    const dbOrgs = await prisma.organization.findMany({
      orderBy: { name: 'asc' },
    });
    
    if (dbOrgs.length > 0) {
      organizations = dbOrgs;
    } else {
      organizations = mockOrganizations;
    }
  } catch (error) {
    console.warn("DB connection failed or timeout, using mock data", error.message);
    organizations = mockOrganizations;
  }

  return (
    <div className={styles.orgDashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Organizations & Federations</h1>
          <p className={styles.subtitle}>Directory and compliance hub for Nigerian sporting bodies.</p>
        </div>
        <div className={styles.actions}>
          <button className="button-primary">+ Register Organization</button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Filters Sidebar */}
        <aside className={`${styles.filtersSidebar} card`}>
          <h3 className={styles.filterTitle}>Directory Filters</h3>
          
          <div className={styles.filterGroup}>
            <label>Organization Type</label>
            <select className={styles.select}>
              <option>All Types</option>
              <option>National Federation</option>
              <option>State Council</option>
              <option>Club</option>
              <option>Association</option>
            </select>
          </div>

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
            <label>Compliance Status</label>
            <select className={styles.select}>
              <option>Any</option>
              <option>NSC Certified</option>
              <option>Audit Passed</option>
              <option>Action Required</option>
            </select>
          </div>
          
          <button className={styles.applyBtn}>Apply Filters</button>
        </aside>

        {/* Organizations List */}
        <div className={styles.orgList}>
          {organizations.map(org => (
            <Link href={`/dashboard/organizations/${org.id}`} key={org.id} className={`${styles.orgCard} card`}>
              <div className={styles.orgLogoContainer}>
                {org.logoUrl ? (
                  <Image src={org.logoUrl} alt={org.name} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div className={styles.placeholderLogo}>{org.name.charAt(0)}</div>
                )}
              </div>
              <div className={styles.orgInfo}>
                <h3 className={styles.orgName}>{org.name}</h3>
                <p className={styles.orgDetail}>{org.orgType} • {org.sport} • {org.headquarters}</p>
                
                <div className={styles.complianceTags}>
                  {org.complianceMetrics.map((metric, i) => (
                    <span 
                      key={i} 
                      className={`${styles.complianceBadge} ${metric.includes('Pending') ? styles.badgeWarning : styles.badgeSuccess}`}
                    >
                      {metric.includes('Certified') || metric.includes('Passed') ? '✓ ' : '⏳ '}
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.orgAction}>
                <span className={styles.viewProfile}>View Profile →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
