export default function MiniLumen() {
  return (
    <div className="ml">
      <style>{`
        .ml {
          background: #FFFAF5;
          color: #1A1A1A;
          font-family: 'DM Sans', -apple-system, sans-serif;
          pointer-events: none;
          user-select: none;
          overflow: hidden;
        }
        .ml img { max-width: 100%; display: block; }

        /* HERO */
        .ml-hero {
          position: relative;
          height: 500px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ml-hero > img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ml-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5));
        }
        .ml-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 40px;
        }
        .ml-hero-logo {
          height: 100px;
          width: auto;
          margin: 0 auto 20px;
        }
        .ml-hero-tagline {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 8px;
        }
        .ml-hero-slogan {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          font-style: italic;
        }
        .ml-hero-cta {
          margin-top: 32px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1A1A1A;
          background: #fff;
          padding: 14px 36px;
          border-radius: 4px;
        }

        /* TICKER */
        .ml-ticker {
          background: #1A1A1A;
          padding: 12px 0;
          overflow: hidden;
        }
        .ml-ticker-track {
          display: flex;
          animation: ml-scroll 40s linear infinite;
          width: max-content;
        }
        .ml-ticker-text {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          white-space: nowrap;
          display: flex;
          align-items: center;
        }
        .ml-ticker-dot {
          width: 4px;
          height: 4px;
          background: #E8866A;
          border-radius: 50%;
          margin: 0 20px;
          flex-shrink: 0;
        }

        @keyframes ml-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* BIG MARQUEE */
        .ml-big-marquee {
          padding: 20px 0;
          overflow: hidden;
        }
        .ml-big-marquee-coral { background: #E8866A; }
        .ml-big-marquee-dark { background: #1A1A1A; }
        .ml-big-marquee-cream { background: #FFF8F0; }
        .ml-big-marquee-blue { background: #1A3FC7; }

        .ml-big-marquee-track {
          display: flex;
          gap: 0;
          animation: ml-scroll 25s linear infinite;
          width: max-content;
        }
        .ml-big-marquee-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 64px;
          font-weight: 800;
          text-transform: uppercase;
          white-space: nowrap;
          letter-spacing: -2px;
          line-height: 1;
          padding: 0 16px;
        }
        .ml-big-marquee-coral .ml-big-marquee-text { color: rgba(255,255,255,0.25); }
        .ml-big-marquee-coral .ml-big-marquee-text .ml-filled { color: #fff; }
        .ml-big-marquee-dark .ml-big-marquee-text { color: rgba(255,255,255,0.08); }
        .ml-big-marquee-dark .ml-big-marquee-text .ml-filled { color: #fff; }
        .ml-big-marquee-dark .ml-big-marquee-text .ml-coral { color: #E8866A; }
        .ml-big-marquee-cream .ml-big-marquee-text { color: rgba(0,0,0,0.04); }
        .ml-big-marquee-cream .ml-big-marquee-text .ml-filled { color: #E8866A; }
        .ml-big-marquee-blue .ml-big-marquee-text { color: rgba(255,255,255,0.15); }
        .ml-big-marquee-blue .ml-big-marquee-text .ml-filled { color: #fff; }
        .ml-big-marquee-sep { color: #E8866A; margin: 0 24px; font-weight: 400; }

        /* SECTION */
        .ml-section {
          padding: 80px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ml-section-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #E8866A;
          margin-bottom: 12px;
        }
        .ml-section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .ml-section-sub {
          font-size: 14px;
          color: #555;
          max-width: 500px;
          line-height: 1.7;
        }

        /* SPREAD */
        .ml-spread {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 400px;
        }
        .ml-spread-reverse { direction: rtl; }
        .ml-spread-reverse > * { direction: ltr; }
        .ml-spread-img {
          overflow: hidden;
        }
        .ml-spread-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ml-spread-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 40px;
          background: #FFFAF5;
        }
        .ml-spread-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #E8866A;
          margin-bottom: 14px;
        }
        .ml-spread-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .ml-spread-body {
          font-size: 14px;
          line-height: 1.8;
          color: #555;
          margin-bottom: 24px;
        }
        .ml-spread-link {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #E8866A;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* PULLQUOTE */
        .ml-pullquote {
          padding: 60px 40px;
          text-align: center;
          background: #FFF8F0;
        }
        .ml-pullquote-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -0.5px;
          max-width: 600px;
          margin: 0 auto;
        }
        .ml-pullquote-text em { color: #E8866A; font-style: italic; }

        /* PRODUCTS */
        .ml-products {
          padding: 60px 40px;
        }
        .ml-products-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 32px;
        }
        .ml-products-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #E8866A;
          margin-bottom: 8px;
        }
        .ml-products-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -1px;
        }
        .ml-products-link {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #E8866A;
        }
        .ml-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        .ml-card {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
        }
        .ml-card-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          background: #f5f0ea;
        }
        .ml-card-info { padding: 12px 16px; }
        .ml-card-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 3px;
        }
        .ml-card-price {
          font-size: 13px;
          color: #555;
          font-weight: 500;
        }
        .ml-card-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 4px;
          color: #fff;
        }
        .ml-badge-best { background: #E8866A; }
        .ml-badge-new { background: #1A3FC7; }

        /* LIFESTYLE BANNER */
        .ml-lifestyle {
          position: relative;
          height: 400px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ml-lifestyle img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ml-lifestyle-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15));
        }
        .ml-lifestyle-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
        }
        .ml-lifestyle-content h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 56px;
          font-weight: 800;
          letter-spacing: -2px;
          line-height: 0.9;
          text-transform: uppercase;
        }
        .ml-lifestyle-content p {
          font-size: 14px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-top: 12px;
        }

        /* PHOTO GRID */
        .ml-photos {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 4px;
        }
        .ml-photos-item {
          overflow: hidden;
          position: relative;
          aspect-ratio: 1;
        }
        .ml-photos-item.ml-tall { grid-row: span 2; aspect-ratio: auto; }
        .ml-photos-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* VALUES */
        .ml-values {
          padding: 60px 40px;
          background: #FFF8F0;
        }
        .ml-values-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          margin-top: 40px;
        }
        .ml-value-icon {
          color: #E8866A;
          margin-bottom: 12px;
          font-size: 24px;
        }
        .ml-value-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .ml-value-desc {
          font-size: 12px;
          line-height: 1.7;
          color: #555;
        }

        /* NEWSLETTER */
        .ml-newsletter {
          padding: 60px 40px;
          background: #1A1A1A;
          text-align: center;
        }
        .ml-newsletter-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
        }
        .ml-newsletter-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 28px;
        }
        .ml-newsletter-form {
          display: flex;
          max-width: 380px;
          margin: 0 auto;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 4px;
          overflow: hidden;
        }
        .ml-newsletter-input {
          flex: 1;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 13px;
        }
        .ml-newsletter-btn {
          padding: 12px 20px;
          background: #E8866A;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: none;
        }

        @media (max-width: 768px) {
          .ml-hero { height: 350px; }
          .ml-hero-logo { height: 70px; }
          .ml-big-marquee-text { font-size: 36px; }
          .ml-section { padding: 48px 24px; }
          .ml-section-title { font-size: 24px; }
          .ml-spread { grid-template-columns: 1fr; min-height: auto; }
          .ml-spread-text { padding: 32px 24px; }
          .ml-spread-title { font-size: 22px; }
          .ml-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .ml-products { padding: 40px 20px; }
          .ml-lifestyle { height: 280px; }
          .ml-lifestyle-content h2 { font-size: 36px; }
          .ml-photos { grid-template-columns: 1fr 1fr; }
          .ml-photos-item.ml-tall { grid-row: span 1; aspect-ratio: 1; }
          .ml-values-grid { grid-template-columns: 1fr; gap: 24px; }
          .ml-values { padding: 40px 24px; }
          .ml-pullquote { padding: 40px 24px; }
          .ml-pullquote-text { font-size: 18px; }
        }
      `}</style>

      {/* HERO */}
      <div className="ml-hero">
        <img src="/portfolio/lumen-welcomed.png" alt="" />
        <div className="ml-hero-overlay" />
        <div className="ml-hero-content">
          <img src="/portfolio/lumen-logo.png" alt="Club Lumen" className="ml-hero-logo" />
          <div className="ml-hero-tagline">The Morning Rave&trade; &mdash; Phoenix, AZ</div>
          <div className="ml-hero-slogan">Energy Is The New Currency</div>
          <div className="ml-hero-cta">Shop the Drop &rarr;</div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ml-ticker">
        <div className="ml-ticker-track">
          {[...Array(3)].map((_, r) =>
            ['Coffee + Music + Community', 'Dance Before Noon', 'Energy Is The New Currency', 'Good Energy Club', 'You Are So Welcomed', 'Morning Rave', 'Phoenix, AZ', 'Sober-Curious', 'Move Your Body'].map((t, i) => (
              <span className="ml-ticker-text" key={`${r}-${i}`}>
                {t}
                <span className="ml-ticker-dot" />
              </span>
            ))
          )}
        </div>
      </div>

      {/* BIG MARQUEE — CORAL */}
      <div className="ml-big-marquee ml-big-marquee-coral">
        <div className="ml-big-marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ml-big-marquee-text">
              <span className="ml-filled">DANCE BEFORE NOON</span> <span className="ml-big-marquee-sep">/</span> <span className="ml-filled">GOOD ENERGY CLUB</span> <span className="ml-big-marquee-sep">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* INTRO */}
      <div className="ml-section">
        <div className="ml-section-label">The Movement</div>
        <h2 className="ml-section-title">More than merch. It's a feeling.</h2>
        <p className="ml-section-sub">Real DJs. Real coffee. Real community. No alcohol necessary. Every piece carries the energy of the dance floor into your everyday life.</p>
      </div>

      {/* SPREAD */}
      <div className="ml-spread">
        <div className="ml-spread-img">
          <img src="/portfolio/lumen-2.png" alt="" />
        </div>
        <div className="ml-spread-text">
          <div className="ml-spread-label">Coffee + Music + Community</div>
          <h2 className="ml-spread-title">You Are So Welcomed</h2>
          <p className="ml-spread-body">Strangers become friends on the dance floor. From the coffee shop to the pool deck, we bring the energy wherever the community gathers.</p>
          <div className="ml-spread-link">Shop Crops & Tanks &rarr;</div>
        </div>
      </div>

      {/* BIG MARQUEE — DARK */}
      <div className="ml-big-marquee ml-big-marquee-dark">
        <div className="ml-big-marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ml-big-marquee-text">
              <span className="ml-coral">MORNING</span> <span className="ml-filled">RAVE</span> <span className="ml-big-marquee-sep">/</span> <span className="ml-coral">CLUB</span> <span className="ml-filled">LUMEN</span> <span className="ml-big-marquee-sep">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* PULLQUOTE */}
      <div className="ml-pullquote">
        <p className="ml-pullquote-text">"The only buzz you need is the bass. <em>Dance before noon.</em> Energy is the new currency."</p>
      </div>

      {/* PRODUCTS */}
      <div className="ml-products">
        <div className="ml-products-header">
          <div>
            <div className="ml-products-label">New Arrivals</div>
            <div className="ml-products-title">The Drop</div>
          </div>
          <span className="ml-products-link">View All &rarr;</span>
        </div>
        <div className="ml-grid">
          <div className="ml-card">
            <img className="ml-card-img" src="/portfolio/lumen-1.png" alt="" />
            <div className="ml-card-info">
              <div className="ml-card-name">Morning Rave Hoodie</div>
              <div className="ml-card-price">$72</div>
            </div>
          </div>
          <div className="ml-card">
            <img className="ml-card-img" src="/portfolio/lumen-3.png" alt="" />
            <div className="ml-card-info">
              <div className="ml-card-name">Good Energy Crewneck</div>
              <div className="ml-card-price">$65</div>
            </div>
          </div>
          <div className="ml-card">
            <img className="ml-card-img" src="/portfolio/lumen-5.png" alt="" />
            <div className="ml-card-info">
              <div className="ml-card-name">Move Your Body Tee</div>
              <div className="ml-card-price">$42</div>
            </div>
          </div>
          <div className="ml-card">
            <img className="ml-card-img" src="/portfolio/lumen-2.png" alt="" />
            <div className="ml-card-info">
              <div className="ml-card-name">Cherry Lips Tank</div>
              <div className="ml-card-price">$38</div>
            </div>
          </div>
          <div className="ml-card">
            <img className="ml-card-img" src="/portfolio/lumen-6.png" alt="" />
            <div className="ml-card-info">
              <div className="ml-card-name">Disco Ball Crop</div>
              <div className="ml-card-price">$36</div>
            </div>
          </div>
          <div className="ml-card">
            <img className="ml-card-img" src="/portfolio/lumen-welcomed.png" alt="" />
            <div className="ml-card-info">
              <div className="ml-card-name">You Are So Welcomed Tee</div>
              <div className="ml-card-price">$42</div>
            </div>
          </div>
        </div>
      </div>

      {/* LIFESTYLE BANNER */}
      <div className="ml-lifestyle">
        <img src="/portfolio/lumen-1.png" alt="" />
        <div className="ml-lifestyle-overlay" />
        <div className="ml-lifestyle-content">
          <h2>Move Your<br />Body</h2>
          <p>Morning Rave &mdash; Phoenix, AZ</p>
        </div>
      </div>

      {/* BIG MARQUEE — CREAM */}
      <div className="ml-big-marquee ml-big-marquee-cream">
        <div className="ml-big-marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ml-big-marquee-text">
              <span className="ml-filled">COFFEE</span> <span className="ml-big-marquee-sep">+</span> <span>MUSIC</span> <span className="ml-big-marquee-sep">+</span> <span className="ml-filled">COMMUNITY</span> <span className="ml-big-marquee-sep">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* SPREAD REVERSE */}
      <div className="ml-spread ml-spread-reverse">
        <div className="ml-spread-text" style={{ background: '#FFF8F0' }}>
          <div className="ml-spread-label">The Culture</div>
          <h2 className="ml-spread-title">Good Energy Club</h2>
          <p className="ml-spread-body">Heavyweight fleece, oversized fit, designed for the morning ravers. Front chest script, full back print. Built for people who move with intention.</p>
          <div className="ml-spread-link">Shop Hoodies &rarr;</div>
        </div>
        <div className="ml-spread-img">
          <img src="/portfolio/lumen-3.png" alt="" />
        </div>
      </div>

      {/* PHOTO GRID */}
      <div className="ml-photos">
        <div className="ml-photos-item ml-tall">
          <img src="/portfolio/lumen-5.png" alt="" />
        </div>
        <div className="ml-photos-item">
          <img src="/portfolio/lumen-2.png" alt="" />
        </div>
        <div className="ml-photos-item">
          <img src="/portfolio/lumen-6.png" alt="" />
        </div>
        <div className="ml-photos-item">
          <img src="/portfolio/lumen-welcomed.png" alt="" />
        </div>
        <div className="ml-photos-item ml-tall">
          <img src="/portfolio/lumen-1.png" alt="" />
        </div>
        <div className="ml-photos-item">
          <img src="/portfolio/lumen-3.png" alt="" />
        </div>
      </div>

      {/* BIG MARQUEE — BLUE */}
      <div className="ml-big-marquee ml-big-marquee-blue">
        <div className="ml-big-marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ml-big-marquee-text">
              <span className="ml-filled">YOU ARE SO WELCOMED</span> <span className="ml-big-marquee-sep">/</span> <span>ENERGY IS THE NEW CURRENCY</span> <span className="ml-big-marquee-sep">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* VALUES */}
      <div className="ml-values">
        <div style={{ textAlign: 'center' }}>
          <div className="ml-section-label">The Vibe</div>
          <h2 className="ml-section-title">What is Club Lumen?</h2>
          <p className="ml-section-sub" style={{ margin: '0 auto' }}>A sober-curious morning rave. Real DJs. Real coffee. Real community.</p>
        </div>
        <div className="ml-values-grid">
          <div>
            <div className="ml-value-icon">&#9749;</div>
            <div className="ml-value-title">Coffee</div>
            <div className="ml-value-desc">Local roasters serving up the good stuff. Espresso, cold brew, matcha. The only buzz you need to dance.</div>
          </div>
          <div>
            <div className="ml-value-icon">&#9835;</div>
            <div className="ml-value-title">Music</div>
            <div className="ml-value-desc">Real DJs spinning real sets. House, disco, funk, feel-good energy that moves your body and soul.</div>
          </div>
          <div>
            <div className="ml-value-icon">&#9734;</div>
            <div className="ml-value-title">Community</div>
            <div className="ml-value-desc">Strangers become friends on the dance floor. A safe space to be yourself, move freely, and connect.</div>
          </div>
        </div>
      </div>

      {/* LIFESTYLE BANNER 2 */}
      <div className="ml-lifestyle">
        <img src="/portfolio/lumen-6.png" alt="" />
        <div className="ml-lifestyle-overlay" />
        <div className="ml-lifestyle-content">
          <h2>Good Energy<br />Only</h2>
          <p>Lumen Energy &mdash; For The Morning Ravers</p>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="ml-newsletter">
        <div className="ml-newsletter-title">Join the Movement</div>
        <div className="ml-newsletter-sub">First access to merch drops, event tickets, and exclusive colorways.</div>
        <div className="ml-newsletter-form">
          <div className="ml-newsletter-input" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Your email</div>
          <div className="ml-newsletter-btn">Subscribe</div>
        </div>
      </div>
    </div>
  );
}
