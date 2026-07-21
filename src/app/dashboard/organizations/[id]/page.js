import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "../organizations.module.css";

// Fallback mock data
const mockOrganizations = [
  {
    id: "1", name: "Nigeria Football Federation (NFF)", orgType: "National Federation", sport: "Football", complianceMetrics: ["NSC Certified", "Audit Passed", "FIFA Compliant"], establishedYear: 1945, headquarters: "Package B, MKO Abiola National Stadium, Abuja", contactEmail: "info@thenff.com", website: "https://thenff.com", logoUrl: "https://images.unsplash.com/photo-1518605368461-1eb7b63f2735?q=80&w=200&auto=format&fit=crop"
  }
];

export default async function OrganizationProfile({ params }) {
  const { id } = await params;
  
  let org = null;
  
  try {
    org = await prisma.organization.findUnique({
      where: { id }
    });
  } catch (e) {
    console.warn("DB Error, using mock data", e.message);
  }
  
  if (!org) {
    org = mockOrganizations.find(o => o.id === id) || mockOrganizations[0];
  }

  return (
    <div className={styles.profileLayout}>
      <Link href="/dashboard/organizations" className={styles.backLink}>
        ← Back to Directory
      </Link>

      <div className={`${styles.profileHero} card`}>
        <div className={styles.profileAvatar}>
          {org.logoUrl ? (
            <Image src={org.logoUrl} alt={org.name} fill style={{ objectFit: 'cover' }} />
          ) : (
            <div className={styles.placeholderLogo}>{org.name.charAt(0)}</div>
          )}
        </div>
        <div className={styles.profileDetails}>
          <h1 className={styles.profileName}>{org.name}</h1>
          <div className={styles.profileTags}>
            <span className={styles.profileTag}>{org.orgType}</span>
            <span className={styles.profileTag}>{org.sport}</span>
          </div>
          
          <div className={styles.complianceTags} style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
            {org.complianceMetrics.map((metric, i) => (
              <span 
                key={i} 
                className={`${styles.complianceBadge} ${metric.includes('Pending') ? styles.badgeWarning : styles.badgeSuccess}`}
              >
                {metric.includes('Certified') || metric.includes('Passed') || metric.includes('Compliant') ? '✓ ' : '⏳ '}
                {metric}
              </span>
            ))}
          </div>

          <div className={styles.profileActions}>
            <button className="button-primary">Contact Organization</button>
            <button className="button-secondary">View Affiliated Talents</button>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={`${styles.sectionBox} card`}>
          <h2 className={styles.sectionTitle}>Organization Details</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Established</span>
              <span className={styles.infoValue}>{org.establishedYear || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Headquarters</span>
              <span className={styles.infoValue}>{org.headquarters || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email Address</span>
              <span className={styles.infoValue}>{org.contactEmail || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Website</span>
              <span className={styles.infoValue}>
                {org.website ? <a href={org.website} target="_blank" rel="noreferrer" style={{color: 'var(--primary)'}}>{org.website}</a> : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className={`${styles.sectionBox} card`}>
          <h2 className={styles.sectionTitle}>Governance & Audits</h2>
          
          <div className={styles.auditItem}>
            <div className={styles.auditHeader}>
              <span className={styles.auditTitle}>Annual Financial Audit</span>
              <span className={styles.auditDate}>Oct 2025</span>
            </div>
            <span className={styles.auditDesc}>Passed by Ministry of Sports</span>
          </div>

          <div className={styles.auditItem}>
            <div className={styles.auditHeader}>
              <span className={styles.auditTitle}>Electoral Review</span>
              <span className={styles.auditDate}>Jan 2026</span>
            </div>
            <span className={styles.auditDesc}>NSC Certified Elections</span>
          </div>
        </div>
      </div>
    </div>
  );
}
