import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const modules = [
    {
      title: "Talent Discovery",
      description: "National talent database, scouting tools, and performance tracking for grassroot athletes.",
      icon: "🔍"
    },
    {
      title: "Organizations & Federations",
      description: "Directory and compliance hub for all national sports federations, clubs, and state councils.",
      icon: "🏢"
    },
    {
      title: "Infrastructure Hub",
      description: "Virtual tours, bookings, and availability for stadiums, arenas, and sports facilities nationwide.",
      icon: "🏟️"
    },
    {
      title: "Social Network for Sports",
      description: "Connect athletes, coaches, officials, and fans. The premier sports LinkedIn for Nigeria.",
      icon: "👥"
    },
    {
      title: "Training & Development",
      description: "E-learning, certifications, and capacity building programs for coaches and officials.",
      icon: "🎓"
    },
    {
      title: "Events & Competitions",
      description: "Live scores, calendar of events, and ticketing for national, state, and local competitions.",
      icon: "🏆"
    }
  ];

  return (
    <main className={styles.main}>
      {/* Navbar */}
      <nav className={`${styles.navbar} glass`}>
        <div className={`${styles.container} container`}>
          <div className={styles.navContainer}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>N</div>
              <span>NaijaSports</span>
            </div>
            <div className={styles.navLinks}>
              <Link href="#modules" className={styles.navLink}>Modules</Link>
              <Link href="#stakeholders" className={styles.navLink}>Stakeholders</Link>
              <Link href="#about" className={styles.navLink}>NSC & States</Link>
            </div>
            <Link href="/dashboard" className="button-primary">
              Enter Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <Image 
          src="/images/hero_sports_stadium.png" 
          alt="Nigeria Sports Stadium" 
          fill 
          priority
          className={styles.heroBg}
        />
        <div className={styles.heroOverlay}></div>
        <div className={`${styles.container} container`}>
          <div className={styles.heroContent}>
            <div className={styles.heroTag}>The One-Stop Portal</div>
            <h1 className={styles.heroTitle}>
              Everything <span className="gradient-text">Sports.</span><br />
              Everywhere in Nigeria.
            </h1>
            <p className={styles.heroDescription}>
              A unified digital ecosystem connecting people, institutions, opportunities, and resources to drive sports growth, development, and global competitiveness in Nigeria.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/dashboard" className="button-primary">
                Explore Dashboard
              </Link>
              <Link href="#modules" className={styles.buttonSecondary}>
                View Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Impact Section */}
      <section className={styles.statsSection}>
        <div className={`${styles.container} container`}>
          <div className={styles.statsGrid}>
            <div>
              <div className={`${styles.statValue} gradient-text`}>36+</div>
              <div className={styles.statLabel}>State Ministries</div>
            </div>
            <div>
              <div className={`${styles.statValue} gradient-text`}>1M+</div>
              <div className={styles.statLabel}>Grassroots Talents</div>
            </div>
            <div>
              <div className={`${styles.statValue} gradient-text`}>50+</div>
              <div className={styles.statLabel}>Sports Federations</div>
            </div>
            <div>
              <div className={`${styles.statValue} gradient-text`}>10k+</div>
              <div className={styles.statLabel}>Facilities & Hubs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section id="modules" className={styles.modulesSection}>
        <div className={`${styles.container} container`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>The Platform <span className="gradient-text">Core Modules</span></h2>
            <p className={styles.sectionDescription}>
              Explore the centralized digital infrastructure designed to elevate every aspect of the Nigerian sports ecosystem.
            </p>
          </div>
          
          <div className={styles.modulesGrid}>
            {modules.map((module, index) => (
              <div key={index} className={`${styles.moduleCard} card`}>
                <div className={styles.moduleIcon}>{module.icon}</div>
                <h3 className={styles.moduleTitle}>{module.title}</h3>
                <p className={styles.moduleDescription}>{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`${styles.container} container`}>
          <div className={styles.footerContent}>
            <div className={styles.footerColumn}>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoIcon}>N</div>
                <span>NaijaSports</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.6" }}>
                The one-stop portal for everything sports in Nigeria. Building champions, developing communities.
              </p>
            </div>
            
            <div className={styles.footerColumn}>
              <div className={styles.footerTitle}>Platform</div>
              <Link href="#modules" className={styles.footerLink}>Core Modules</Link>
              <Link href="/dashboard" className={styles.footerLink}>Dashboard</Link>
              <Link href="#" className={styles.footerLink}>Stakeholders</Link>
            </div>

            <div className={styles.footerColumn}>
              <div className={styles.footerTitle}>Legal</div>
              <Link href="#" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="#" className={styles.footerLink}>Terms of Service</Link>
              <Link href="#" className={styles.footerLink}>Compliance</Link>
            </div>

            <div className={styles.footerColumn}>
              <div className={styles.footerTitle}>Contact</div>
              <Link href="#" className={styles.footerLink}>Support</Link>
              <Link href="#" className={styles.footerLink}>Partnerships</Link>
              <Link href="#" className={styles.footerLink}>Media Inquiries</Link>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            &copy; {new Date().getFullYear()} Nigeria Sports Aggregation Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
