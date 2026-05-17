import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, X } from 'lucide-react';
import MiniShift from './showcases/MiniShift';
import MiniLumen from './showcases/MiniLumen';
import './index.css';

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };

const socials = [
  { text: '2.4K', icon: '♥', x: '8%', y: '25%', delay: 0 },
  { text: '@jess NEED this', icon: '💬', x: '82%', y: '32%', delay: 1.2 },
  { text: '$127 sold', icon: '🛒', x: '75%', y: '68%', delay: 2.4 },
  { text: '1,847 views', icon: '👁', x: '10%', y: '62%', delay: 0.8 },
  { text: '+$89', icon: '💰', x: '88%', y: '18%', delay: 1.8 },
  { text: 'Added to cart', icon: '🛍', x: '6%', y: '78%', delay: 3.0 },
];

function FloatingPill({ text, icon, x, y, delay }) {
  return (
    <motion.div
      className="float-pill"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9], y: [10, 0, -5, -15] }}
      transition={{ duration: 4, delay, repeat: Infinity, repeatDelay: 6 }}
    >
      <span className="float-icon">{icon}</span>
      <span>{text}</span>
    </motion.div>
  );
}

function Marquee({ children }) {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="marquee-item">{children}</div>
        ))}
      </div>
    </div>
  );
}

function PhotoStrip({ images, height = '400px' }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
  };

  return (
    <div className="strip-wrap">
      <button className="strip-btn strip-btn-left" onClick={() => scroll(-1)}><ArrowLeft size={18} /></button>
      <div className="strip" ref={ref}>
        {images.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt=""
            className="strip-img"
            style={{ height }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          />
        ))}
      </div>
      <button className="strip-btn strip-btn-right" onClick={() => scroll(1)}><ArrowRight size={18} /></button>
    </div>
  );
}

function BrowserFrame({ children, dark }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="browser-scroll">
        <div className={`browser-bar${dark ? ' browser-bar-dark' : ''}`}>
          <span /><span /><span />
        </div>
        <div className="browser-body">
          {children}
        </div>
        <button className={`browser-expand${dark ? ' browser-expand-dark' : ''}`} onClick={() => setExpanded(true)}>
          Expand to explore ↓
        </button>
      </div>

      {expanded && (
        <div className="browser-fullscreen">
          <button className="browser-close" onClick={() => setExpanded(false)}>
            <X size={24} />
          </button>
          <div className="browser-fullscreen-body">
            {children}
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', handle: '', platform: '', followers: '', vibe: '', link: '' });
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <video src="/portfolio/eastwood-video.mp4" autoPlay muted loop playsInline className="hero-video hero-desktop" />
        <video src="/portfolio/eastwood-video-mobile.mp4" autoPlay muted loop playsInline className="hero-video hero-mobile" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.div {...fade}>
            <p className="hero-eyebrow">Brands By Status</p>
            <h1>You bring the audience.<br />We bring the merch.</h1>
            <a href="#apply" className="btn btn-white">Apply Now <ArrowRight size={16} /></a>
          </motion.div>
        </div>
        {socials.map((s, i) => <FloatingPill key={i} {...s} />)}
      </section>

      {/* ===== MARQUEE ===== */}
      <Marquee>
        <span className="filled">BRANDS BY STATUS</span>
        <span className="sep">&bull;</span>
        <span>MERCH</span>
        <span className="sep">&bull;</span>
        <span>E-COMMERCE</span>
        <span className="sep">&bull;</span>
      </Marquee>

      {/* ===== STEAMING RACK ===== */}
      <section className="contained-img">
        <motion.img src="/portfolio/status-rack.png" alt="" {...fade} />
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="text-block">
        <motion.div {...fade}>
          <h2>We build merch brands for creators.</h2>
          <p style={{ marginTop: 16, color: 'var(--muted)' }}>Product design. Lifestyle photography. A fully custom online store. Fulfillment handled. Starting at $500 – $2,000.</p>
        </motion.div>
      </section>

      {/* ===== 01 — SEND THE VISION ===== */}
      <section className="spread">
        <div className="spread-img">
          <motion.img src="/portfolio/status-hoodie.png" alt="" {...fade} />
        </div>
        <motion.div className="spread-text" {...fade}>
          <div className="spread-label">01</div>
          <h2 className="spread-title">You send us the vision.</h2>
          <p className="spread-body">A mood board. A Pinterest link. Some screenshots. A logo on a napkin. Literally whatever you have — we take it from there.</p>
        </motion.div>
      </section>

      {/* ===== 02 — WE CREATE ===== */}
      <section className="spread spread-reverse">
        <motion.div className="spread-text" {...fade}>
          <div className="spread-label">02</div>
          <h2 className="spread-title">We create the entire product line.</h2>
          <p className="spread-body">Lifestyle photography. Product designs. Everything styled and shot to match your brand. No studio. No models. No limits.</p>
        </motion.div>
        <div className="spread-img">
          <motion.img src="/portfolio/status-newspaper.png" alt="" {...fade} />
        </div>
      </section>

      {/* What we've created — three auto-scrolling rows */}
      <div className="scroll-rows">
        <div className="scroll-rows-label">What we've created</div>
        <div className="scroll-row">
          <div className="scroll-row-track">
            {[
              '/lumen/cherry-lips-tank-lifestyle.png', '/shift/street-crossing.png', '/lumen/good-energy-hoodie-lifestyle.png',
              '/shift/pizza-shop.png', '/lumen/morning-rave-hoodie-lifestyle.png', '/shift/nyc-crosswalk.png',
            ].map((src, i) => <img key={i} src={src} alt="" className="scroll-row-img" />)}
          </div>
        </div>
        <div className="scroll-row">
          <div className="scroll-row-track">
            {[
              '/shift/convertible-pink-red.png', '/lumen/disco-crop-lifestyle.png', '/shift/car-meet.png',
              '/lumen/welcomed-crop-lifestyle.png', '/shift/pool-party.png', '/lumen/move-body-tee-lifestyle.png',
            ].map((src, i) => <img key={i} src={src} alt="" className="scroll-row-img" />)}
          </div>
        </div>
        <div className="scroll-row">
          <div className="scroll-row-track">
            {[
              '/lumen/venue-friends.png', '/shift/coffee-shop.png', '/lumen/pool-party-group.png',
              '/shift/subway.png', '/lumen/coffee-shop-group.png', '/shift/chinatown.jpg',
            ].map((src, i) => <img key={i} src={src} alt="" className="scroll-row-img" />)}
          </div>
        </div>
        <div className="scroll-hint">Swipe to explore <span className="scroll-hint-arrow">→</span></div>
      </div>

      {/* ===== 03 — WE BUILD THE STORE ===== */}
      <section className="text-block text-block-sm">
        <motion.div {...fade}>
          <span className="step-label">03</span>
          <h3 className="step-title">We build your store.</h3>
          <p>A fully custom e-commerce website designed around your brand — your colors, your vibe, your products. Real checkout. Real fulfillment. We handle inventory, shipping, and customer service. You just send traffic and watch it sell.</p>
        </motion.div>
      </section>

      {/* ===== LIVE STORE SHOWCASES ===== */}
      <section className="text-block text-block-xs">
        <motion.div {...fade}>
          <p className="story-intro">Club Lumen wanted a morning rave merch brand — desert disco energy, coffee culture, community vibes.</p>
        </motion.div>
      </section>

      <section className="browser-section">
        <motion.div className="browser-showcase" {...fade}>
          <BrowserFrame>
            <MiniLumen />
          </BrowserFrame>
        </motion.div>
      </section>

      <section className="text-block text-block-xs">
        <motion.div {...fade}>
          <p className="story-intro">Shift wanted NYC streetwear with an edge — forward motion, heavyweight premium, glitch aesthetic.</p>
        </motion.div>
      </section>

      <section className="browser-section">
        <motion.div className="browser-showcase" {...fade}>
          <BrowserFrame dark>
            <MiniShift />
          </BrowserFrame>
        </motion.div>
      </section>

      {/* ===== FULL BLEED — STATUS RACK MODEL ===== */}
      <section className="full-bleed">
        <motion.img src="/portfolio/status-rack-model.png" alt="" {...fade} />
      </section>


      {/* ===== MARQUEE 2 ===== */}
      <Marquee>
        <span>YOU POST</span>
        <span className="sep">&rarr;</span>
        <span className="filled">THEY BUY</span>
        <span className="sep">&rarr;</span>
        <span>WE HANDLE THE REST</span>
        <span className="sep">&rarr;</span>
      </Marquee>

      {/* ===== 04 — YOU POST THEY BUY ===== */}
      <section className="spread spread-reverse">
        <motion.div className="spread-text" {...fade}>
          <div className="spread-label">04</div>
          <h2 className="spread-title">You post. They buy.</h2>
          <p className="spread-body">Link in bio. TikTok Shop. Go live. Your audience finally has somewhere to throw money. We take a percentage — so we only win when you do.</p>
          <a href="#apply" className="spread-link">Apply Now <ArrowRight size={14} /></a>
        </motion.div>
        <div className="spread-img">
          <motion.img src="/portfolio/status-tvs.png" alt="" {...fade} />
        </div>
      </section>

      {/* ===== APPLY ===== */}
      <section className="apply" id="apply">
        <div className="apply-inner">
          <motion.div className="apply-text" {...fade}>
            <h2>We don't work with everyone.</h2>
            <p>We invest our time into your brand and take a cut of sales — so we need creators who actually promote. If that's you, apply below.</p>
          </motion.div>

          {submitted ? (
            <motion.div className="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="success-icon"><Check size={32} /></div>
              <h3>Application received.</h3>
              <p>We'll check your profile and get back within 48 hours.</p>
            </motion.div>
          ) : (
            <motion.form className="form" onSubmit={e => { e.preventDefault(); setSubmitted(true); }} {...fade}>
              <div className="form-row">
                <div className="field">
                  <label>Name</label>
                  <input type="text" placeholder="First & last" required value={form.name} onChange={e => update('name', e.target.value)} />
                </div>
                <div className="field">
                  <label>Handle</label>
                  <input type="text" placeholder="@yourname" required value={form.handle} onChange={e => update('handle', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Platform</label>
                  <select required value={form.platform} onChange={e => update('platform', e.target.value)}>
                    <option value="">Select</option>
                    <option>TikTok</option>
                    <option>Instagram</option>
                    <option>YouTube</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field">
                  <label>Followers</label>
                  <select required value={form.followers} onChange={e => update('followers', e.target.value)}>
                    <option value="">Select</option>
                    <option>10K — 50K</option>
                    <option>50K — 100K</option>
                    <option>100K — 500K</option>
                    <option>500K+</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Describe your vibe</label>
                <input type="text" placeholder="e.g. Desert disco meets morning rave culture" required value={form.vibe} onChange={e => update('vibe', e.target.value)} />
              </div>
              <div className="field">
                <label>Mood board link (optional)</label>
                <input type="text" placeholder="Pinterest, Google Drive, etc." value={form.link} onChange={e => update('link', e.target.value)} />
              </div>
              <button type="submit" className="btn btn-full">Submit Application <ArrowRight size={16} /></button>
            </motion.form>
          )}
        </div>
      </section>

      <footer className="footer">
        <span>Brands by Status</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
