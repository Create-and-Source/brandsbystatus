import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Menu, X, Heart, MessageCircle, Send, Bookmark, ShoppingBag, Camera, Zap, TrendingUp, ChevronDown, Check } from 'lucide-react';
import './index.css';

/* ===== SOCIAL FLOATING ELEMENTS ===== */
function FloatingLike({ style, delay = 0 }) {
  return (
    <motion.div
      className="floating-social"
      style={style}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Heart size={14} fill="#E1306C" stroke="#E1306C" />
      <span>2.4K</span>
    </motion.div>
  );
}

function FloatingComment({ text, user, style, delay = 0 }) {
  return (
    <motion.div
      className="floating-comment"
      style={style}
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <strong>@{user}</strong> {text}
    </motion.div>
  );
}

function FloatingNotif({ text, style, delay = 0 }) {
  return (
    <motion.div
      className="floating-notif"
      style={style}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <ShoppingBag size={12} /> {text}
    </motion.div>
  );
}

/* ===== HEADER ===== */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="header-logo">BBS<span>.</span></a>
        <nav className="header-nav">
          <a href="#work">Work</a>
          <a href="#how">How</a>
          <a href="#apply">Apply</a>
        </nav>
        <a href="#apply" className="header-cta">Apply Now</a>
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </header>
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>
          <X size={28} />
        </button>
        <a href="#work" onClick={() => setMobileOpen(false)}>Work</a>
        <a href="#how" onClick={() => setMobileOpen(false)}>How</a>
        <a href="#apply" onClick={() => setMobileOpen(false)}>Apply</a>
      </div>
    </>
  );
}

/* ===== HERO ===== */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-img-wrap">
        <video
          src="/portfolio/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
        />
        <div className="hero-img-overlay" />
        <FloatingLike style={{ top: '15%', right: '8%' }} delay={1} />
        <FloatingComment user="jess" text="NEED this hoodie 🔥" style={{ bottom: '28%', left: '5%' }} delay={1.5} />
        <FloatingNotif text="3 orders just now" style={{ top: '30%', left: '8%' }} delay={2} />
        <FloatingComment user="marcus" text="link?? 👀" style={{ top: '45%', right: '5%' }} delay={2.3} />
        <motion.div
          className="hero-ig-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="ig-actions">
            <Heart size={22} /> <MessageCircle size={22} /> <Send size={22} />
          </div>
          <Bookmark size={22} />
        </motion.div>
      </div>
      <motion.div
        className="hero-text"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h1>You bring the audience.<br /><span className="accent">We bring the merch.</span></h1>
        <p className="hero-sub">Your followers are already asking "where'd you get that?" — let's give them an answer.</p>
        <a href="#apply" className="hero-cta">
          Apply Now <ArrowRight size={16} />
        </a>
      </motion.div>
      <motion.div className="scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}

/* ===== TICKER ===== */
function Ticker({ items, variant = 'dark' }) {
  return (
    <div className={`ticker ticker-${variant}`}>
      <div className="ticker-track">
        {[...Array(4)].map((_, rep) =>
          items.map((item, i) => (
            <span className="ticker-item" key={`${rep}-${i}`}>{item} <span className="ticker-dot">/</span></span>
          ))
        )}
      </div>
    </div>
  );
}

/* ===== SOCIAL PROOF STRIP ===== */
function SocialProof() {
  return (
    <motion.section className="social-proof" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
      <div className="proof-item">
        <div className="proof-number">0</div>
        <div className="proof-label">inventory needed</div>
      </div>
      <div className="proof-divider" />
      <div className="proof-item">
        <div className="proof-number">100%</div>
        <div className="proof-label">done for you</div>
      </div>
      <div className="proof-divider" />
      <div className="proof-item">
        <div className="proof-number">$0</div>
        <div className="proof-label">upfront product cost</div>
      </div>
    </motion.section>
  );
}

/* ===== THE PITCH ===== */
function ThePitch() {
  return (
    <section className="section pitch">
      <motion.div className="container" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <p className="pitch-text">
          You already have the <span className="highlight">followers</span>. The <span className="highlight">engagement</span>. The <span className="highlight">community</span>. You just don't have a store yet.
        </p>
        <p className="pitch-sub">We fix that.</p>
      </motion.div>
    </section>
  );
}

/* ===== HOW IT WORKS ===== */
function HowItWorks() {
  const steps = [
    { icon: <Camera size={24} />, title: 'Send us your vibe', desc: 'A mood board. A Pinterest link. A napkin sketch. Whatever you got — we take it from there.' },
    { icon: <Zap size={24} />, title: 'We build the whole thing', desc: 'Product photos. Store. Checkout. Fulfillment. Your brand, your look — we handle the backend.' },
    { icon: <TrendingUp size={24} />, title: 'You post, they buy', desc: 'Link in bio. TikTok Shop. Go live. Your audience finally has something to throw money at.' },
  ];

  return (
    <section className="section section-warm" id="how">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="section-label">Dead simple</div>
          <h2 className="section-title">Your only job is being you.</h2>
        </motion.div>
        <div className="steps-row">
          {steps.map((s, i) => (
            <motion.div key={i} className="step-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
              <div className="step-num">0{i + 1}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== DEAL SECTION ===== */
function TheDeal() {
  return (
    <section className="section the-deal">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center' }}>
          <div className="section-label">The deal</div>
          <h2 className="section-title">We bet on you. Literally.</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            We don't charge a flat monthly fee. We take a percentage of sales — which means if you don't sell, we don't eat. That's how confident we are in what we build. But it also means we only work with creators who actually <em>promote</em>.
          </p>
        </motion.div>
        <div className="deal-cards">
          <motion.div className="deal-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="deal-emoji">🤝</div>
            <h3>We build it</h3>
            <p>Product designs, photography, full store, fulfillment — the entire operation, done.</p>
          </motion.div>
          <motion.div className="deal-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="deal-emoji">📱</div>
            <h3>You promote it</h3>
            <p>Go live. Post stories. Put the link in bio. Talk about your brand. This is the non-negotiable.</p>
          </motion.div>
          <motion.div className="deal-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="deal-emoji">📈</div>
            <h3>We both win</h3>
            <p>More sales = lower percentage for us. We're incentivized to help you grow, not just charge you.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ===== PORTFOLIO — IG STYLE ===== */
function PortfolioPost({ img, brand, caption, likes, comments, delay = 0 }) {
  return (
    <motion.div className="ig-post" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay }}>
      <div className="ig-post-header">
        <div className="ig-avatar" />
        <div>
          <div className="ig-handle">@{brand}</div>
          <div className="ig-location">Built by BBS</div>
        </div>
      </div>
      <div className="ig-post-img"><img src={img} alt={brand} /></div>
      <div className="ig-post-actions">
        <div className="ig-actions"><Heart size={20} /> <MessageCircle size={20} /> <Send size={20} /></div>
        <Bookmark size={20} />
      </div>
      <div className="ig-post-info">
        <div className="ig-likes">{likes} likes</div>
        <div className="ig-caption"><strong>@{brand}</strong> {caption}</div>
        <div className="ig-comments">View all {comments} comments</div>
      </div>
    </motion.div>
  );
}

function Portfolio() {
  return (
    <section className="section" id="work">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="section-label">The proof</div>
          <h2 className="section-title">Mood boards in. Merch empires out.</h2>
          <p className="section-sub">Real brands we built from scratch. Real stores generating real revenue.</p>
        </motion.div>
        <div className="portfolio-grid">
          <PortfolioPost img="/portfolio/lumen-2.png" brand="clublumen" caption="Good Energy Club hoodie just dropped 🎧☀️ link in bio" likes="4,821" comments="347" />
          <PortfolioPost img="/portfolio/shift-girls.png" brand="wearshift" caption="Palm trees & hoodies. The vibes are immaculate 🌴" likes="6,203" comments="512" delay={0.15} />
          <PortfolioPost img="/portfolio/lumen-1.png" brand="clublumen" caption="Cherry lips tank is back in stock 💋 morning rave essentials" likes="3,147" comments="289" delay={0.3} />
        </div>
      </div>
    </section>
  );
}

/* ===== BEFORE / AFTER ===== */
function BeforeAfter() {
  return (
    <section className="section section-warm">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">The glow up</div>
          <h2 className="section-title">They sent a Pinterest board.<br />We sent back a brand.</h2>
        </motion.div>
        <div className="ba-row">
          <motion.div className="ba-card" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="ba-label">What they gave us</div>
            <img src="/portfolio/lumen-brandboard.png" alt="Brand board" />
            <p className="ba-caption">A mood board and a dream</p>
          </motion.div>
          <div className="ba-arrow"><ArrowRight size={32} /></div>
          <motion.div className="ba-card" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="ba-label ba-label-after">What we delivered</div>
            <img src="/portfolio/lumen-5.png" alt="Finished brand" />
            <p className="ba-caption">A whole merch line with lifestyle photos</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ===== MINI GALLERY ===== */
function MiniGallery() {
  return (
    <div className="mini-gallery">
      {['/portfolio/lumen-3.png', '/portfolio/shift-crosswalk.png', '/portfolio/lumen-4.png', '/portfolio/shift-subway.png'].map((src, i) => (
        <motion.div key={i} className="mini-gallery-item" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
          <img src={src} alt="" />
          <div className="mini-gallery-overlay"><Heart size={16} fill="white" stroke="white" /></div>
        </motion.div>
      ))}
    </div>
  );
}

/* ===== APPLICATION FORM ===== */
function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', handle: '', platform: '', followers: '', vibe: '', link: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <section className="section section-dark" id="apply">
      <div className="container" style={{ maxWidth: 640 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label" style={{ color: 'var(--accent)' }}>Apply</div>
          <h2 className="section-title" style={{ color: 'white' }}>We don't work with everyone.</h2>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.5)', margin: '0 auto' }}>
            We invest our time and skills into your brand — so we need to know you'll actually promote it. Fill this out and we'll be in touch.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            className="form-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="success-icon"><Check size={32} /></div>
            <h3>Application received.</h3>
            <p>We'll check out your profile and get back to you within 48 hours. If the vibe is right, we move fast.</p>
          </motion.div>
        ) : (
          <motion.form
            className="apply-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="form-row">
              <div className="form-group">
                <label>Your name</label>
                <input type="text" placeholder="First & last" required value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Main handle</label>
                <input type="text" placeholder="@yourname" required value={form.handle} onChange={e => update('handle', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Primary platform</label>
                <select required value={form.platform} onChange={e => update('platform', e.target.value)}>
                  <option value="">Select one</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitch">Twitch</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Follower count</label>
                <select required value={form.followers} onChange={e => update('followers', e.target.value)}>
                  <option value="">Select range</option>
                  <option value="10k-50k">10K — 50K</option>
                  <option value="50k-100k">50K — 100K</option>
                  <option value="100k-500k">100K — 500K</option>
                  <option value="500k-1m">500K — 1M</option>
                  <option value="1m+">1M+</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Describe your vibe in one sentence</label>
              <input type="text" placeholder="e.g. Desert disco meets morning coffee culture" required value={form.vibe} onChange={e => update('vibe', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Link to a mood board, Pinterest, or inspo (optional)</label>
              <input type="text" placeholder="Pinterest, Google Drive, or website link" value={form.link} onChange={e => update('link', e.target.value)} />
            </div>
            <button type="submit" className="form-submit">
              Submit Application <ArrowRight size={16} />
            </button>
            <p className="form-fine">We review every application. If it's a fit, you'll hear from us within 48 hours.</p>
          </motion.form>
        )}
      </div>
    </section>
  );
}

/* ===== CTA ===== */
function CTA() {
  return (
    <section className="cta">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <h2>Stop leaving money<br />in the comments.</h2>
        <p>Every "where'd you get that??" is a sale you're not making.</p>
        <a href="#apply" className="cta-btn">Apply Now <ArrowRight size={16} /></a>
      </motion.div>
    </section>
  );
}

/* ===== FOOTER ===== */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-logo">BBS<span>.</span></div>
          <p className="footer-desc">Merch stores for creators who are done leaving money on the table.</p>
        </div>
        <div className="footer-links">
          <a href="#work">Work</a>
          <a href="#how">How</a>
          <a href="#apply">Apply</a>
          <a href="https://www.instagram.com/brandsbystatus/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Brands by Status LLC</span>
        <span>Scottsdale, AZ</span>
      </div>
    </footer>
  );
}

/* ===== APP ===== */
export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <Ticker items={['You bring the audience', 'We bring the merch', 'No inventory', 'No risk', 'All vibes']} />
      <SocialProof />
      <ThePitch />
      <HowItWorks />
      <TheDeal />
      <Ticker items={['Lifestyle photos', 'Dropshipping', 'TikTok Shop', 'Link in bio', 'Merch drops', 'Email blasts']} variant="light" />
      <Portfolio />
      <BeforeAfter />
      <MiniGallery />
      <ApplicationForm />
      <CTA />
      <Footer />
    </>
  );
}
