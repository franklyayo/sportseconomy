import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./funding.module.css";

// Mock data fallback
const mockFunding = [
  {
    id: "1", title: "National Athlete Scholarship Program 2026", description: "A comprehensive scholarship program aimed at supporting exceptional U-20 athletes with their training, nutrition, and travel expenses for the upcoming calendar year.", provider: "Ministry of Sports", fundingType: "Scholarship", amount: "₦2,500,000", deadline: new Date("2026-11-30T23:59:00Z"), eligibleEntities: ["Athletes"], status: "Open"
  },
  {
    id: "2", title: "Grassroots Football Club Development Grant", provider: "NFF & Corporate Sponsors", fundingType: "Grant", amount: "Up to ₦10,000,000", deadline: new Date("2026-09-15T23:59:00Z"), eligibleEntities: ["Clubs"], status: "Open"
  },
  {
    id: "3", title: "Elite Athlete Brand Sponsorship", provider: "Global Sports Apparel Brand", fundingType: "Sponsorship", amount: "Tiered (₦1M - ₦5M) + Gear", deadline: new Date("2026-12-31T23:59:00Z"), eligibleEntities: ["Athletes"], status: "Upcoming"
  },
  {
    id: "4", title: "State Federation Equipment Subsidy", provider: "National Sports Commission", fundingType: "Grant", amount: "₦15,000,000", deadline: new Date("2026-05-30T23:59:00Z"), eligibleEntities: ["Federations"], status: "Closed"
  }
];

export default async function FundingDashboard() {
  let opportunities = [];
  
  try {
    const dbOpps = await prisma.fundingOpportunity.findMany({
      orderBy: { deadline: 'asc' },
    });
    
    if (dbOpps.length > 0) {
      opportunities = dbOpps;
    } else {
      opportunities = mockFunding;
    }
  } catch (error) {
    console.warn("DB connection failed or timeout, using mock data", error.message);
    opportunities = mockFunding;
  }

  return (
    <div className={styles.fundingDashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Financing & Funding</h1>
          <p className={styles.subtitle}>Discover grants, scholarships, and sponsorships for your sports career or organization.</p>
        </div>
        <div className={styles.actions}>
          <button className="button-primary">+ Post Opportunity</button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Filters Sidebar */}
        <aside className={`${styles.filtersSidebar} card`}>
          <h3 className={styles.filterTitle}>Funding Filters</h3>
          
          <div className={styles.filterGroup}>
            <label>Funding Type</label>
            <select className={styles.select}>
              <option>All Types</option>
              <option>Grant</option>
              <option>Scholarship</option>
              <option>Sponsorship</option>
              <option>Investment</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Eligible Entity</label>
            <select className={styles.select}>
              <option>Who are you?</option>
              <option>Individual Athlete</option>
              <option>Sports Club</option>
              <option>Federation / Council</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Status</label>
            <select className={styles.select}>
              <option>Open Applications</option>
              <option>Upcoming</option>
              <option>Closed</option>
            </select>
          </div>
          
          <button className={styles.applyBtn}>Apply Filters</button>
        </aside>

        {/* Funding Board */}
        <div className={styles.fundingBoard}>
          {opportunities.map(opp => {
            const isClosed = opp.status === 'Closed';
            const isUpcoming = opp.status === 'Upcoming';
            const statusClass = isClosed ? styles.statusClosed : (isUpcoming ? styles.statusUpcoming : styles.statusOpen);
            
            return (
              <Link href={`/dashboard/funding/${opp.id}`} key={opp.id} className={`${styles.fundingCard} card`}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.statusBadge} ${statusClass}`}>{opp.status}</span>
                  <span className={styles.fundingType}>{opp.fundingType}</span>
                </div>
                
                <h3 className={styles.oppTitle}>{opp.title}</h3>
                <p className={styles.provider}>By {opp.provider}</p>
                
                <div className={styles.amountBox}>
                  <span className={styles.amountLabel}>Total Funding Available</span>
                  <span className={styles.amountValue}>{opp.amount}</span>
                </div>
                
                <div className={styles.cardFooter}>
                  <div className={styles.deadlineInfo}>
                    <span className={styles.deadlineLabel}>Deadline</span>
                    <span className={styles.deadlineValue}>{new Date(opp.deadline).toLocaleDateString('en-GB')}</span>
                  </div>
                  
                  <div className={styles.eligibleBadges}>
                    {opp.eligibleEntities.map((entity, i) => (
                      <span key={i} className={styles.entityBadge}>{entity}</span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
