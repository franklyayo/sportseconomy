import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "../funding.module.css";
import { ApplyButton } from "@/components/ActionButtons";

// Fallback mock data
const mockFunding = [
  {
    id: "1", title: "National Athlete Scholarship Program 2026", description: "A comprehensive scholarship program aimed at supporting exceptional U-20 athletes with their training, nutrition, and travel expenses for the upcoming calendar year.\n\nThe Ministry of Sports recognizes the financial burden placed on rising stars and their families. This scholarship covers:\n- Annual Training Camp Fees\n- Domestic Flight Travel for Competitions\n- Advanced Nutritional Counseling\n- Monthly Stipend\n\nApplicants must provide official records from a recognized state or national competition.", provider: "Ministry of Sports", fundingType: "Scholarship", amount: "₦2,500,000", deadline: new Date("2026-11-30T23:59:00Z"), eligibleEntities: ["Athletes"], status: "Open"
  }
];

export default async function FundingProfile({ params }) {
  const { id } = await params;
  
  let opp = null;
  
  try {
    opp = await prisma.fundingOpportunity.findUnique({
      where: { id }
    });
  } catch (e) {
    console.warn("DB Error, using mock data", e.message);
  }
  
  if (!opp) {
    opp = mockFunding.find(f => f.id === id) || mockFunding[0];
  }

  const isClosed = opp.status === 'Closed';
  const isUpcoming = opp.status === 'Upcoming';
  const statusClass = isClosed ? styles.statusClosed : (isUpcoming ? styles.statusUpcoming : styles.statusOpen);

  return (
    <div className={styles.profileLayout}>
      <Link href="/dashboard/funding" className={styles.backLink}>
        ← Back to Funding Directory
      </Link>

      <div className={`${styles.fundingHero} card`}>
        <div className={styles.heroContent}>
          <div className={styles.heroStatusRow}>
            <span className={`${styles.statusBadge} ${statusClass}`}>{opp.status}</span>
            <span className={styles.fundingType}>{opp.fundingType}</span>
          </div>
          <h1 className={styles.heroTitle}>{opp.title}</h1>
          <div className={styles.heroProvider}>Provided by {opp.provider}</div>
        </div>
        
        <div className={styles.heroAmountBox}>
          <div className={styles.amountLabel}>Total Funding Value</div>
          <div className={styles.amountValue}>{opp.amount}</div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={`${styles.sectionBox} card`}>
          <h2 className={styles.sectionTitle}>Overview & Details</h2>
          <p className={styles.description}>{opp.description}</p>
        </div>

        <div className={`${styles.sectionBox} card`}>
          <div className={styles.applyBox} style={{ borderColor: isClosed ? 'var(--surface-border)' : 'var(--primary)' }}>
            <div className={styles.applyTitle}>Application Portal</div>
            
            {!isClosed && (
              <p className={styles.deadlineAlert}>
                Closes {new Date(opp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}
              </p>
            )}

            <ApplyButton fundingId={opp.id} isClosed={isClosed} />
          </div>

          <h2 className={styles.sectionTitle}>Eligibility</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Allowed Entities</span>
              <div className={styles.eligibleBadges} style={{marginTop: '0.25rem'}}>
                {opp.eligibleEntities.map((entity, i) => (
                  <span key={i} className={styles.entityBadge}>{entity}</span>
                ))}
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Funding Type</span>
              <span className={styles.infoValue}>{opp.fundingType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
