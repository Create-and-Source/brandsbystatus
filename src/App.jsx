import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
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
        <span>PHOTOGRAPHY</span>
        <span className="sep">&bull;</span>
        <span>E-COMMERCE</span>
        <span className="sep">&bull;</span>
      </Marquee>

      {/* ===== FULL BLEED — STATUS RACK ===== */}
      <section className="full-bleed">
        <motion.img src="/portfolio/status-rack-model.png" alt="" {...fade} />
      </section>

      {/* ===== INTRO ===== */}
      <section className="text-block">
        <motion.div {...fade}>
          <h2>Two creators. Two visions.<br />Two brands built from scratch.</h2>
        </motion.div>
      </section>

      {/* ===== STEP 01 — THEY SEND ===== */}
      <section className="text-block text-block-sm">
        <motion.div {...fade}>
          <span className="step-label">01</span>
          <h3 className="step-title">They sent us the vision.</h3>
        </motion.div>
      </section>

      {/* Club Lumen — brand board spread */}
      <section className="spread">
        <div className="spread-img">
          <motion.img src="/portfolio/lumen-brandboard.png" alt="" {...fade} />
        </div>
        <motion.div className="spread-text" {...fade}>
          <div className="spread-label">Club Lumen</div>
          <h2 className="spread-title">Started with a brand board.</h2>
          <p className="spread-body">Colors, fonts, mood photos, and a name — The Morning Rave. A desert disco brand for festival culture.</p>
        </motion.div>
      </section>

      {/* Shift — mockups spread */}
      <section className="spread spread-reverse">
        <motion.div className="spread-text" {...fade}>
          <div className="spread-label">Shift</div>
          <h2 className="spread-title">Started with mockups.</h2>
          <p className="spread-body">A logo and product designs in every colorway they could imagine. Life Keeps Moving — a streetwear brand built around forward motion.</p>
        </motion.div>
        <div className="spread-img">
          <motion.img src="/portfolio/shift-input-2.png" alt="" {...fade} />
        </div>
      </section>

      {/* ===== STEP 02 — WE CREATE ===== */}
      <section className="text-block text-block-sm">
        <motion.div {...fade}>
          <span className="step-label">02</span>
          <h3 className="step-title">We created the entire product line.</h3>
          <p>Lifestyle photography. Product designs. Everything styled and shot to match the brand.</p>
        </motion.div>
      </section>

      {/* Horizontal scroll — Lumen photos */}
      <div className="strip-section">
        <div className="strip-label">Club Lumen</div>
        <PhotoStrip
          images={[
            '/portfolio/lumen-2.png',
            '/portfolio/lumen-1.png',
            '/portfolio/lumen-5.png',
            '/portfolio/lumen-3.png',
            '/portfolio/lumen-6.png',
            '/portfolio/lumen-welcomed.png',
          ]}
        />
      </div>

      {/* Horizontal scroll — Shift photos */}
      <div className="strip-section">
        <div className="strip-label">Shift</div>
        <PhotoStrip
          images={[
            '/portfolio/shift-girls.png',
            '/portfolio/shift-crosswalk.png',
            '/portfolio/shift-subway.png',
            '/portfolio/shift-pizza.png',
            '/portfolio/shift-4.png',
            '/portfolio/shift-5.png',
          ]}
        />
      </div>

      {/* ===== STATUS FLATLAY ===== */}
      <section className="full-bleed">
        <motion.img src="/portfolio/status-flatlay.png" alt="" {...fade} />
      </section>

      {/* ===== PHOTO GRID — masonry ===== */}
      <section className="photo-grid">
        <div className="photo-grid-item tall">
          <img src="/portfolio/shift-crosswalk.png" alt="" loading="lazy" />
        </div>
        <div className="photo-grid-item">
          <img src="/portfolio/lumen-2.png" alt="" loading="lazy" />
        </div>
        <div className="photo-grid-item">
          <img src="/portfolio/shift-pizza.png" alt="" loading="lazy" />
        </div>
        <div className="photo-grid-item">
          <img src="/portfolio/lumen-3.png" alt="" loading="lazy" />
        </div>
        <div className="photo-grid-item tall">
          <img src="/portfolio/lumen-5.png" alt="" loading="lazy" />
        </div>
        <div className="photo-grid-item">
          <img src="/portfolio/shift-subway.png" alt="" loading="lazy" />
        </div>
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

      {/* ===== STEP 04 ===== */}
      <section className="spread">
        <div className="spread-img">
          <motion.img src="/portfolio/status-hoodie.png" alt="" {...fade} />
        </div>
        <motion.div className="spread-text" {...fade}>
          <div className="spread-label">04</div>
          <h2 className="spread-title">You post. They buy.</h2>
          <p className="spread-body">Link in bio. TikTok Shop. Go live. Your audience finally has somewhere to throw money. We take a percentage — so we only win when you do.</p>
          <a href="#apply" className="spread-link">Apply Now <ArrowRight size={14} /></a>
        </motion.div>
      </section>

      {/* ===== STATUS TVs ===== */}
      <section className="full-bleed">
        <motion.img src="/portfolio/status-tvs.png" alt="" {...fade} />
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
