import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Menu, X, Sparkles, Palette, ShoppingBag, BarChart3, Mail, Megaphone } from 'lucide-react';
import './index.css';

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
        <a href="#" className="header-logo">Brands by <span>Status</span></a>
        <nav className="header-nav">
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <a href="#contact" className="header-cta">Start Your Brand</a>
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>
          <X size={28} />
        </button>
        <a href="#work" onClick={() => setMobileOpen(false)}>Work</a>
        <a href="#process" onClick={() => setMobileOpen(false)}>Process</a>
        <a href="#pricing" onClick={() => setMobileOpen(false)}>Pricing</a>
        <a href="#contact" onClick={() => setMobileOpen(false)}>Start Your Brand</a>
      </div>
    </>
  );
}

function Marquee() {
  const items = [
    'Merch Stores', 'AI Photography', 'Dropshipping', 'Brand Design',
    'Lifestyle Mockups', 'Shopify Alternative', 'Creator Merch', 'TikTok Shop',
  ];

  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...Array(3)].map((_, rep) =>
          items.map((item, i) => (
            <span className="marquee-text" key={`${rep}-${i}`}>
              {item} <span className="highlight">/</span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div className="hero-label">Merch Store Creation for Creators</div>
        <h1>Your vision.<br />Your brand.<br />Built by us.</h1>
        <p className="hero-sub">
          You bring the mood board. We build the entire merch empire — AI product photos, dropshipping store, ongoing drops, and marketing. You just show up and sell.
        </p>
        <a href="#contact" className="hero-cta">
          Let's Build Your Store <ArrowRight size={16} />
        </a>
      </motion.div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section section-cream" id="process">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">How It Works</div>
          <div className="section-title">Three steps to your own merch brand</div>
          <p className="section-subtitle">No inventory. No design skills needed. No tech headaches. Just your creative vision.</p>
        </motion.div>

        <div className="how-it-works">
          {[
            {
              num: '1',
              title: 'Share Your Vision',
              desc: 'Send us a mood board, Pinterest inspo, rough sketches, or even just a vibe. We take whatever you have and run with it.',
            },
            {
              num: '2',
              title: 'We Build Everything',
              desc: 'AI-generated lifestyle photography. Product designs. Full e-commerce store. Dropshipping backend. All done for you.',
            },
            {
              num: '3',
              title: 'You Sell & Grow',
              desc: 'Promote to your audience. We handle fulfillment, drops, email marketing, and store updates. You keep selling.',
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="step-number">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioSection() {
  return (
    <section id="work">
      {/* Club Lumen Case */}
      <div className="portfolio-case">
        <div className="case-images">
          <img src="/portfolio/lumen-2.png" alt="Club Lumen Good Energy Hoodie" />
        </div>
        <motion.div
          className="case-content"
          style={{ background: 'var(--cream)' }}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="case-brand">Client: Club Lumen</div>
          <h2 className="case-title">The Morning Rave — Phoenix, AZ</h2>
          <p className="case-desc">
            A sober-curious morning rave needed merch that captured their desert-meets-disco energy. They gave us a brand board. We gave them a full product line with AI-generated lifestyle photography, a complete store, and ongoing drops.
          </p>
          <div className="case-tags">
            <span className="case-tag">9 Products</span>
            <span className="case-tag">AI Photography</span>
            <span className="case-tag">Dropshipping Store</span>
            <span className="case-tag">Email Marketing</span>
          </div>
        </motion.div>
      </div>

      {/* Shift Case */}
      <div className="portfolio-case">
        <div className="case-images">
          <img src="/portfolio/shift-1.png" alt="Shift Streetwear" />
        </div>
        <motion.div
          className="case-content"
          style={{ background: 'var(--warm-gray)' }}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="case-brand">Client: Shift</div>
          <h2 className="case-title">NYC Streetwear, AI-Generated</h2>
          <p className="case-desc">
            A streetwear brand started with clothing mockups and a Pinterest board. We built a custom AI image generator for their specific aesthetic, created an entire lifestyle photography catalog, and launched their dropshipping store.
          </p>
          <div className="case-tags">
            <span className="case-tag">Custom AI Tool</span>
            <span className="case-tag">Streetwear</span>
            <span className="case-tag">Full Store Build</span>
            <span className="case-tag">Product Design</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BeforeAfter() {
  return (
    <section className="before-after">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 20 }}
        >
          <div className="section-label">The Transformation</div>
          <div className="section-title">From mood board to merch empire</div>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            This is what your clients give us vs. what we deliver. The gap is where the magic happens.
          </p>
        </motion.div>

        <div className="before-after-grid">
          <motion.div
            className="before-col"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>What they gave us</h3>
            <img src="/portfolio/lumen-brandboard.png" alt="Club Lumen brand board" style={{ borderRadius: 12 }} />
          </motion.div>

          <div className="arrow-col">
            <ArrowRight size={40} />
          </div>

          <motion.div
            className="after-col"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>What we built</h3>
            <img src="/portfolio/lumen-1.png" alt="Club Lumen finished product" style={{ borderRadius: 12 }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <div className="gallery">
      <img src="/portfolio/lumen-3.png" alt="Morning Rave Hoodie" />
      <img src="/portfolio/shift-2.png" alt="Shift NYC" />
      <img src="/portfolio/lumen-4.png" alt="Move Your Body Tee" />
      <img src="/portfolio/shift-3.png" alt="Shift Coffee Shop" />
      <img src="/portfolio/lumen-5.png" alt="Club Lumen Pool Party" />
      <img src="/portfolio/shift-4.png" alt="Shift Car Meet" />
    </div>
  );
}

function Services() {
  const services = [
    { icon: <Sparkles size={22} />, title: 'AI Product Photography', desc: 'Custom AI-generated lifestyle mockups that look like a real photoshoot. No models, no studio, no limits.' },
    { icon: <Palette size={22} />, title: 'Product Design', desc: 'From concept to print-ready designs. Apparel, accessories, whatever your brand needs.' },
    { icon: <ShoppingBag size={22} />, title: 'Full Store Build', desc: 'Complete e-commerce website with your branding, product pages, and checkout — ready to sell.' },
    { icon: <BarChart3 size={22} />, title: 'Dropshipping Backend', desc: 'No inventory risk. Orders fulfilled automatically. You sell, we ship.' },
    { icon: <Mail size={22} />, title: 'Email & SMS Marketing', desc: 'Klaviyo-powered campaigns. Drop announcements, abandoned carts, welcome flows.' },
    { icon: <Megaphone size={22} />, title: 'Ongoing Merch Drops', desc: 'New designs and seasonal collections. Keep your audience coming back for more.' },
  ];

  return (
    <section className="section" id="services">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">What's Included</div>
          <div className="section-title">Everything you need. Nothing you don't.</div>
          <p className="section-subtitle">We handle the entire stack so you can focus on what you do best — creating content and building your audience.</p>
        </motion.div>

        <div className="services-grid">
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="service-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div style={{ marginBottom: 12, color: 'var(--accent)' }}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="section section-cream" id="pricing">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center' }}
        >
          <div className="section-label">Pricing</div>
          <div className="section-title" style={{ textAlign: 'center' }}>Simple. Transparent. Worth it.</div>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto' }}>
            One setup fee. A small monthly platform cost. And a revenue share that goes down as you sell more.
          </p>
        </motion.div>

        <div className="pricing-cards">
          <motion.div
            className="pricing-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="pricing-tier">Starter</div>
            <div className="pricing-price">$500</div>
            <div className="pricing-desc">Setup fee — perfect for creators who know exactly what they want.</div>
            <ul className="pricing-list">
              <li>Up to 6 products</li>
              <li>AI lifestyle photography</li>
              <li>Full store build</li>
              <li>Dropshipping setup</li>
              <li>1 merch drop included</li>
            </ul>
          </motion.div>

          <motion.div
            className="pricing-card featured"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="pricing-tier">Full Build</div>
            <div className="pricing-price">$1,500</div>
            <div className="pricing-desc">Setup fee — for creators who want the white-glove treatment.</div>
            <ul className="pricing-list">
              <li>Unlimited products</li>
              <li>Custom AI image generator</li>
              <li>Full store + branding</li>
              <li>Email/SMS marketing setup</li>
              <li>Quarterly merch drops</li>
              <li>Strategy consultation</li>
            </ul>
          </motion.div>

          <motion.div
            className="pricing-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="pricing-tier">Ongoing</div>
            <div className="pricing-price">%</div>
            <div className="pricing-desc">Revenue share — the more you sell, the lower the percentage.</div>
            <ul className="pricing-list">
              <li>Monthly platform fee</li>
              <li>Sliding scale rev share</li>
              <li>Ongoing design support</li>
              <li>Store updates & maintenance</li>
              <li>New drops & seasonal designs</li>
              <li>Email campaigns & blasts</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="cta-section" id="contact">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-label">Ready?</div>
        <div className="section-title">You have the audience.<br />Let's give them something to buy.</div>
        <p className="section-subtitle">
          DM us on Instagram or send over your mood board. We'll handle the rest.
        </p>
        <a href="https://www.instagram.com/brandsbystatus/" target="_blank" rel="noopener noreferrer" className="cta-btn">
          Let's Talk <ArrowRight size={16} />
        </a>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">Brands by <span>Status</span></div>
          <p className="footer-desc">Merch store creation for creators and influencers. From vision to sales in days, not months.</p>
        </div>
        <div className="footer-links">
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
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

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <Marquee />
      <HowItWorks />
      <PortfolioSection />
      <BeforeAfter />
      <Gallery />
      <Marquee />
      <Services />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
