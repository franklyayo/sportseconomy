import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./network.module.css";

// Mock data fallback
const mockPosts = [
  {
    id: "1", content: "Just completed an intense 3-week high altitude training camp in Jos. Feeling stronger and faster than ever! 🏃🏾‍♂️💨 Next stop: National Trials.\n\n#RoadToGold #AthleticsNigeria", authorName: "Emmanuel Chidiebere", authorRole: "Track & Field Athlete", authorAvatar: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=150&auto=format&fit=crop", mediaUrl: "https://images.unsplash.com/photo-1551280857-2b9bbe5260fc?q=80&w=800&auto=format&fit=crop", likes: 342, commentsCount: 45, createdAt: new Date(Date.now() - 3600000 * 2) // 2 hours ago
  },
  {
    id: "2", content: "We are currently scouting for U-17 defensive midfielders for our upcoming European tour. Must have excellent vision and stamina. Drop a link to your highlight reel below! 👇⚽", authorName: "Kano Pillars Academy", authorRole: "Verified Scout", authorAvatar: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=150&auto=format&fit=crop", mediaUrl: null, likes: 1205, commentsCount: 312, createdAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    id: "3", content: "Honored to receive the Grassroots Development Award from the Ministry of Sports today. Thank you to everyone who has supported our local basketball clinics in Port Harcourt! 🏀🇳🇬", authorName: "Coach Sarah", authorRole: "Basketball Coach", authorAvatar: "https://images.unsplash.com/photo-1518605368461-1eb7b63f2735?q=80&w=150&auto=format&fit=crop", mediaUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop", likes: 890, commentsCount: 56, createdAt: new Date(Date.now() - 3600000 * 24)
  }
];

export default async function NetworkDashboard() {
  let posts = [];
  
  try {
    const dbPosts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    if (dbPosts.length > 0) {
      posts = dbPosts;
    } else {
      posts = mockPosts;
    }
  } catch (error) {
    console.warn("DB connection failed or timeout, using mock data", error.message);
    posts = mockPosts;
  }

  // Format timestamp helper
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };

  return (
    <div className={styles.networkDashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Social Network</h1>
          <p className={styles.subtitle}>Connect with athletes, scouts, and fans across the nation.</p>
        </div>
      </div>

      <div className={styles.mainLayout}>
        
        {/* Main Feed Column */}
        <div className={styles.feedColumn}>
          
          {/* Composer Box */}
          <div className={`${styles.composerBox} card`}>
            <div className={styles.composerHeader}>
              <div className={styles.currentUserAvatar}>AA</div>
              <input 
                type="text" 
                placeholder="Share an update, video, or achievement..." 
                className={styles.composerInput}
              />
            </div>
            <div className={styles.composerActions}>
              <div className={styles.composerTools}>
                <button className={styles.toolBtn}>📷 Media</button>
                <button className={styles.toolBtn}>🏅 Achievement</button>
                <button className={styles.toolBtn}>📊 Poll</button>
              </div>
              <button className="button-primary" style={{padding: '0.5rem 1.5rem'}}>Post</button>
            </div>
          </div>

          <div className={styles.feedDivider}>
            <hr />
            <span>Recent Updates</span>
            <hr />
          </div>

          {/* Posts List */}
          <div className={styles.postsList}>
            {posts.map(post => (
              <div key={post.id} className={`${styles.postCard} card`}>
                <div className={styles.postHeader}>
                  <div className={styles.authorAvatar}>
                    {post.authorAvatar ? (
                      <Image src={post.authorAvatar} alt={post.authorName} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className={styles.placeholderAvatar}>{post.authorName.charAt(0)}</div>
                    )}
                  </div>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorNameRow}>
                      <span className={styles.authorName}>{post.authorName}</span>
                      {post.authorRole.includes('Scout') || post.authorRole.includes('Coach') ? (
                        <span className={styles.verifiedBadge}>✓</span>
                      ) : null}
                    </div>
                    <div className={styles.authorRole}>{post.authorRole} • {formatTimeAgo(post.createdAt)}</div>
                  </div>
                  <button className={styles.optionsBtn}>⋮</button>
                </div>

                <div className={styles.postContent}>
                  {post.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                {post.mediaUrl && (
                  <div className={styles.postMedia}>
                    <Image src={post.mediaUrl} alt="Post media" fill style={{ objectFit: 'cover' }} />
                  </div>
                )}

                <div className={styles.postStats}>
                  <span>👍 {post.likes}</span>
                  <span>{post.commentsCount} comments</span>
                </div>

                <div className={styles.postActions}>
                  <button className={styles.actionBtn}>👍 Like</button>
                  <button className={styles.actionBtn}>💬 Comment</button>
                  <button className={styles.actionBtn}>🔁 Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Suggestions */}
        <aside className={styles.sidebarColumn}>
          <div className={`${styles.suggestionBox} card`}>
            <h3 className={styles.suggestionTitle}>Trending Athletes</h3>
            
            <div className={styles.suggestionItem}>
              <div className={styles.suggAvatar}>OA</div>
              <div className={styles.suggInfo}>
                <div className={styles.suggName}>Oluwafemi Adebayo</div>
                <div className={styles.suggRole}>U-17 Footballer</div>
              </div>
              <button className={styles.connectBtn}>+ Follow</button>
            </div>
            
            <div className={styles.suggestionItem}>
              <div className={styles.suggAvatar}>CN</div>
              <div className={styles.suggInfo}>
                <div className={styles.suggName}>Chika Nnamdi</div>
                <div className={styles.suggRole}>Sprinter (100m)</div>
              </div>
              <button className={styles.connectBtn}>+ Follow</button>
            </div>
            
            <div className={styles.viewAllBtn}>View all recommendations →</div>
          </div>

          <div className={`${styles.suggestionBox} card`} style={{marginTop: '1.5rem'}}>
            <h3 className={styles.suggestionTitle}>Top Scouts to Follow</h3>
            
            <div className={styles.suggestionItem}>
              <div className={styles.suggAvatar}>MS</div>
              <div className={styles.suggInfo}>
                <div className={styles.suggName}>Mark Smith <span className={styles.verifiedBadge}>✓</span></div>
                <div className={styles.suggRole}>Euro Talent Agency</div>
              </div>
              <button className={styles.connectBtn}>+ Follow</button>
            </div>
            
            <div className={styles.suggestionItem}>
              <div className={styles.suggAvatar}>EA</div>
              <div className={styles.suggInfo}>
                <div className={styles.suggName}>Enyimba FC Scouts</div>
                <div className={styles.suggRole}>Domestic Club</div>
              </div>
              <button className={styles.connectBtn}>+ Follow</button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
