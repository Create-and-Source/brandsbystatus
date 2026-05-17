import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import './index.css';

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

/* Floating social elements */
const socials = [
  { text: '2.4K', icon: '♥', x: '8%', y: '25%', delay: 0 },
  { text: '@jess NEED this', icon: '💬', x: '85%', y: '35%', delay: 1.2 },
  { text: '$127 sold', icon: '🛒', x: '78%', y: '70%', delay: 2.4 },
  { text: '1,847 views', icon: '👁', x: '12%', y: '65%', delay: 0.8 },
  { text: '+$89', icon: '💰', x: '90%', y: '20%', delay: 1.8 },
  { text: 'Added to cart', icon: '🛍', x: '5%', y: '80%', delay: 3.0 },
];

function FloatingElement({ text, icon, x, y, delay }) {
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
        <video src="/portfolio/eastwood-video.mp4" autoPlay muted loop playsInline className="hero-video" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.div {...fade}>
            <h1>You bring the audience.<br />We bring the merch.</h1>
            <a href="#apply" className="btn">Apply Now <ArrowRight size={16} /></a>
          </motion.div>
        </div>
        {socials.map((s, i) => <FloatingElement key={i} {...s} />)}
      </section>

      {/* ===== STEP 1: THEY SEND ===== */}
      <section className="step">
        <motion.div className="step-text" {...fade}>
          <div className="step-num">01</div>
          <h2>You send us the vision.</h2>
          <p>A mood board. A Pinterest link. Some screenshots. Literally whatever you have — we take it from there.</p>
        </motion.div>
        <div className="collage collage-inputs">
          <motion.img src="/portfolio/lumen-brandboard.png" alt="" className="c1" {...fade} />
          <motion.img src="/portfolio/shift-input-1.jpeg" alt="" className="c2" {...fade} transition={{ delay: 0.1 }} />
          <motion.img src="/portfolio/shift-input-2.png" alt="" className="c3" {...fade} transition={{ delay: 0.2 }} />
        </div>
      </section>

      {/* ===== STEP 2: WE CREATE ===== */}
      <section className="step step-alt">
        <div className="collage collage-photos">
          <motion.img src="/portfolio/lumen-2.png" alt="" className="c1" {...fade} />
          <motion.img src="/portfolio/shift-girls.png" alt="" className="c2" {...fade} transition={{ delay: 0.1 }} />
          <motion.img src="/portfolio/lumen-1.png" alt="" className="c3" {...fade} transition={{ delay: 0.15 }} />
          <motion.img src="/portfolio/shift-crosswalk.png" alt="" className="c4" {...fade} transition={{ delay: 0.2 }} />
          <motion.img src="/portfolio/lumen-3.png" alt="" className="c5" {...fade} transition={{ delay: 0.1 }} />
          <motion.img src="/portfolio/shift-subway.png" alt="" className="c6" {...fade} transition={{ delay: 0.25 }} />
        </div>
        <motion.div className="step-text" {...fade}>
          <div className="step-num">02</div>
          <h2>We create the entire product line.</h2>
          <p>Lifestyle photography. Product designs. Everything styled and shot to match your brand. No studio. No models. No limits.</p>
        </motion.div>
      </section>

      {/* ===== STEP 3: THE STORE ===== */}
      <section className="step">
        <motion.div className="step-text" {...fade}>
          <div className="step-num">03</div>
          <h2>We build your store.</h2>
          <p>Fully custom e-commerce with your branding, your products, checkout, and fulfillment. You send traffic — we handle the rest.</p>
        </motion.div>
        <div className="collage collage-stores">
          <motion.div className="browser" {...fade}>
            <div className="browser-bar"><span /><span /><span /></div>
            <img src="/portfolio/lumen-store-hero.png" alt="Club Lumen Store" />
          </motion.div>
          <motion.div className="browser browser-offset" {...fade} transition={{ delay: 0.15 }}>
            <div className="browser-bar"><span /><span /><span /></div>
            <img src="/portfolio/shift-store-hero.png" alt="Shift Store" />
          </motion.div>
        </div>
      </section>

      {/* ===== STEP 4: THEY SELL ===== */}
      <section className="step step-alt">
        <div className="collage collage-lifestyle">
          <motion.img src="/portfolio/lumen-5.png" alt="" className="c1" {...fade} />
          <motion.img src="/portfolio/shift-4.png" alt="" className="c2" {...fade} transition={{ delay: 0.1 }} />
          <motion.img src="/portfolio/lumen-welcomed.png" alt="" className="c3" {...fade} transition={{ delay: 0.15 }} />
          <motion.img src="/portfolio/shift-5.png" alt="" className="c4" {...fade} transition={{ delay: 0.2 }} />
        </div>
        <motion.div className="step-text" {...fade}>
          <div className="step-num">04</div>
          <h2>You post. They buy.</h2>
          <p>Link in bio. TikTok Shop. Go live. Your audience finally has somewhere to throw money. We take a percentage — so we only win when you do.</p>
        </motion.div>
      </section>

      {/* ===== STATUS IMAGE ===== */}
      <section className="showcase">
        <motion.img src="/portfolio/status-rack.png" alt="Status" {...fade} />
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

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <span>Brands by Status</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
