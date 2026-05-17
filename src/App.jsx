import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
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

      {/* ===== STATUS HERO IMAGE ===== */}
      <section className="full-bleed">
        <img src="/portfolio/status-rack-model.png" alt="" />
      </section>

      {/* ===== INTRO TEXT ===== */}
      <section className="text-block">
        <motion.div {...fade}>
          <h2>Two creators. Two visions.<br />Two brands built from scratch.</h2>
          <p>Here's how it works — told through the stories of Club Lumen and Shift.</p>
        </motion.div>
      </section>

      {/* ===== STEP 01: THEY SEND ===== */}
      <section className="text-block">
        <motion.div {...fade}>
          <span className="step-label">01 — They sent us the vision</span>
        </motion.div>
      </section>

      <section className="side-by-side">
        <motion.div className="story-col" {...fade}>
          <div className="story-tag">Club Lumen</div>
          <p className="story-desc">Started with a brand board — colors, fonts, mood photos, and a name: The Morning Rave.</p>
          <img src="/portfolio/lumen-brandboard.png" alt="Lumen brand board" className="story-img" />
        </motion.div>
        <motion.div className="story-col" {...fade} transition={{ delay: 0.15 }}>
          <div className="story-tag">Shift</div>
          <p className="story-desc">Started with mockups — a logo and product designs in every colorway they could imagine.</p>
          <img src="/portfolio/shift-input-2.png" alt="Shift mockups" className="story-img" />
          <img src="/portfolio/shift-input-3.png" alt="Shift mockups" className="story-img" style={{ marginTop: 4 }} />
        </motion.div>
      </section>

      {/* ===== STEP 02: WE CREATE ===== */}
      <section className="text-block">
        <motion.div {...fade}>
          <span className="step-label">02 — We created the product line</span>
        </motion.div>
      </section>

      <section className="side-by-side">
        <motion.div className="story-col" {...fade}>
          <div className="story-tag">Club Lumen</div>
          <p className="story-desc">Lifestyle photography. Festival energy. Desert sunsets. Every piece styled and shot to feel like the brand.</p>
          <div className="story-grid">
            <img src="/portfolio/lumen-2.png" alt="" />
            <img src="/portfolio/lumen-1.png" alt="" />
            <img src="/portfolio/lumen-3.png" alt="" />
            <img src="/portfolio/lumen-5.png" alt="" />
          </div>
        </motion.div>
        <motion.div className="story-col" {...fade} transition={{ delay: 0.15 }}>
          <div className="story-tag">Shift</div>
          <p className="story-desc">Street photography. NYC energy. Real people in real places wearing the brand like they own it.</p>
          <div className="story-grid">
            <img src="/portfolio/shift-girls.png" alt="" />
            <img src="/portfolio/shift-crosswalk.png" alt="" />
            <img src="/portfolio/shift-subway.png" alt="" />
            <img src="/portfolio/shift-pizza.png" alt="" />
          </div>
        </motion.div>
      </section>

      {/* ===== STATUS FLATLAY ===== */}
      <section className="full-bleed">
        <motion.img src="/portfolio/status-flatlay.png" alt="" {...fade} />
      </section>

      {/* ===== STEP 03: THE STORE ===== */}
      <section className="text-block">
        <motion.div {...fade}>
          <span className="step-label">03 — We built their stores</span>
          <p>Fully custom e-commerce — their branding, their products, checkout, and fulfillment. They send traffic, we handle the rest.</p>
        </motion.div>
      </section>

      <section className="side-by-side side-by-side-browsers">
        <motion.div className="story-col" {...fade}>
          <div className="story-tag">Club Lumen</div>
          <div className="browser-scroll">
            <div className="browser-bar"><span /><span /><span /><div className="browser-url">clublumen-store.vercel.app</div></div>
            <div className="browser-body">
              <img src="/portfolio/lumen-store-full.png" alt="Club Lumen full store" />
            </div>
          </div>
        </motion.div>
        <motion.div className="story-col" {...fade} transition={{ delay: 0.15 }}>
          <div className="story-tag">Shift</div>
          <div className="browser-scroll">
            <div className="browser-bar"><span /><span /><span /><div className="browser-url">shift-store.vercel.app</div></div>
            <div className="browser-body">
              <img src="/portfolio/shift-store-full.png" alt="Shift full store" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== STEP 04: THEY SELL ===== */}
      <section className="text-block">
        <motion.div {...fade}>
          <span className="step-label">04 — They post. Their audience buys.</span>
          <p>Link in bio. TikTok Shop. Go live. We take a percentage — so we only win when they do.</p>
        </motion.div>
      </section>

      {/* ===== STATUS HOODIE ===== */}
      <section className="full-bleed">
        <motion.img src="/portfolio/status-hoodie.png" alt="" {...fade} />
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
