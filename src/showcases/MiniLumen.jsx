export default function MiniLumen() {
  return (
    <div className="ml">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

        .ml {
          background: #FFFAF5;
          color: #1A1A1A;
          font-family: 'DM Sans', -apple-system, sans-serif;
          pointer-events: none;
          user-select: none;
          overflow: hidden;
        }
        .ml * { margin: 0; padding: 0; box-sizing: border-box; }
        .ml img { max-width: 100%; display: block; }

        /* HERO */
        .ml-hero {
          position: relative;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .ml-hero-bg {
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
          max-width: 700px;
        }
        .ml-hero-logo {
          height: 100px;
          width: auto;
          margin: 0 auto 24px;
        }
        .ml-hero-tagline {
          font-size: 14px;
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
          margin-top: 40px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1A1A1A;
          background: #fff;
          padding: 16px 44px;
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
          animation: ml-marquee 40s linear infinite;
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

        @keyframes ml-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* BIG MARQUEE */
        .ml-bigm {
          padding: 20px 0;
          overflow: hidden;
        }
        .ml-bigm-coral { background: #E8866A; }
        .ml-bigm-dark { background: #1A1A1A; }
        .ml-bigm-cream { background: #FFF8F0; }
        .ml-bigm-blue { background: #1A3FC7; }
        .ml-bigm-track {
          display: flex;
          animation: ml-marquee 25s linear infinite;
          width: max-content;
        }
        .ml-bigm-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(48px, 8vw, 80px);
          font-weight: 800;
          text-transform: uppercase;
          white-space: nowrap;
          letter-spacing: -2px;
          line-height: 1;
          padding: 0 16px;
        }
        .ml-bigm-coral .ml-bigm-text { color: rgba(255,255,255,0.25); }
        .ml-bigm-coral .ml-bigm-text .ml-f { color: #fff; }
        .ml-bigm-dark .ml-bigm-text { color: rgba(255,255,255,0.08); }
        .ml-bigm-dark .ml-bigm-text .ml-f { color: #fff; }
        .ml-bigm-dark .ml-bigm-text .ml-c { color: #E8866A; }
        .ml-bigm-cream .ml-bigm-text { color: rgba(0,0,0,0.04); }
        .ml-bigm-cream .ml-bigm-text .ml-f { color: #E8866A; }
        .ml-bigm-blue .ml-bigm-text { color: rgba(255,255,255,0.15); }
        .ml-bigm-blue .ml-bigm-text .ml-f { color: #fff; }
        .ml-bigm-sep { color: #E8866A; margin: 0 24px; font-weight: 400; }

        /* SECTION */
        .ml-section {
          padding: 80px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ml-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #E8866A;
          margin-bottom: 12px;
        }
        .ml-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .ml-sub {
          font-size: 15px;
          color: #555;
          max-width: 550px;
          line-height: 1.7;
        }

        /* SPREAD */
        .ml-spread {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 500px;
        }
        .ml-spread-rev { direction: rtl; }
        .ml-spread-rev > * { direction: ltr; }
        .ml-spread-img {
          overflow: hidden;
          position: relative;
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
          padding: 60px 48px;
          background: #FFFAF5;
        }
        .ml-spread-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #E8866A;
          margin-bottom: 16px;
        }
        .ml-spread-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(24px, 4vw, 40px);
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .ml-spread-body {
          font-size: 14px;
          line-height: 1.8;
          color: #555;
          margin-bottom: 32px;
        }
        .ml-spread-link {
          font-size: 13px;
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
          padding: 80px 40px;
          text-align: center;
          background: #FFF8F0;
        }
        .ml-pullquote-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(20px, 4vw, 36px);
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -1px;
          max-width: 700px;
          margin: 0 auto;
        }
        .ml-pullquote-text em { color: #E8866A; font-style: italic; }

        /* PRODUCTS */
        .ml-products {
          padding: 80px 40px;
          background: #FFFAF5;
        }
        .ml-products-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 48px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .ml-products-link {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #E8866A;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ml-pgrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .ml-pcard {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
        }
        .ml-pcard-img {
          aspect-ratio: 3/4;
          overflow: hidden;
          background: #f5f0ea;
        }
        .ml-pcard-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ml-pcard-info { padding: 16px 20px; }
        .ml-pcard-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .ml-pcard-price {
          font-size: 14px;
          color: #555;
          font-weight: 500;
        }

        /* LIFESTYLE BANNER */
        .ml-banner {
          position: relative;
          height: 500px;
          min-height: 400px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ml-banner-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ml-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15));
        }
        .ml-banner-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
          padding: 0 40px;
        }
        .ml-banner-content h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(48px, 10vw, 100px);
          font-weight: 800;
          letter-spacing: -3px;
          line-height: 0.9;
          text-transform: uppercase;
        }
        .ml-banner-content p {
          font-size: 16px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-top: 16px;
        }

        /* PHOTO GRID */
        .ml-photogrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }
        .ml-pg-item {
          overflow: hidden;
          position: relative;
          aspect-ratio: 1;
        }
        .ml-pg-item.ml-tall { grid-row: span 2; aspect-ratio: auto; }
        .ml-pg-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ml-pg-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.4);
          opacity: 0;
        }
        .ml-pg-overlay span {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* VALUES */
        .ml-values {
          padding: 80px 40px;
          background: #FFF8F0;
        }
        .ml-values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 60px;
          margin-top: 60px;
        }
        .ml-val-icon { color: #E8866A; margin-bottom: 16px; font-size: 28px; }
        .ml-val-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .ml-val-desc {
          font-size: 13px;
          line-height: 1.8;
          color: #555;
        }

        /* NEWSLETTER */
        .ml-newsletter {
          padding: 80px 40px;
          background: #1A1A1A;
          text-align: center;
        }
        .ml-newsletter-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }
        .ml-newsletter-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 36px;
        }
        .ml-newsletter-form {
          display: flex;
          max-width: 460px;
          margin: 0 auto;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 4px;
          overflow: hidden;
        }
        .ml-newsletter-input {
          flex: 1;
          padding: 14px 20px;
          color: rgba(255,255,255,0.3);
          font-size: 14px;
        }
        .ml-newsletter-btn {
          padding: 14px 28px;
          background: #E8866A;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .ml-hero { min-height: 360px; }
          .ml-hero-logo { height: 70px; }
          .ml-section { padding: 48px 24px; }
          .ml-bigm-text { font-size: 36px !important; }
          .ml-spread { grid-template-columns: 1fr; min-height: auto; }
          .ml-spread-text { padding: 40px 24px; }
          .ml-spread-img { min-height: 300px; }
          .ml-pgrid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .ml-products { padding: 48px 20px; }
          .ml-banner { height: 350px; min-height: 280px; }
          .ml-photogrid { grid-template-columns: 1fr 1fr; }
          .ml-pg-item.ml-tall { grid-row: span 1; aspect-ratio: 1; }
          .ml-values-grid { grid-template-columns: 1fr; gap: 32px; }
          .ml-values { padding: 48px 24px; }
          .ml-pullquote { padding: 48px 24px; }
        }
      `}</style>

      {/* HERO */}
      <div className="ml-hero">
        <img className="ml-hero-bg" src="/lumen/hero-wide.png" alt="" />
        <div className="ml-hero-overlay" />
        <div className="ml-hero-content">
          <img src="/lumen/lumen-logo-v2.png" alt="Club Lumen" className="ml-hero-logo" />
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
      <div className="ml-bigm ml-bigm-coral">
        <div className="ml-bigm-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ml-bigm-text">
              <span className="ml-f">DANCE BEFORE NOON</span> <span className="ml-bigm-sep">/</span> <span className="ml-f">GOOD ENERGY CLUB</span> <span className="ml-bigm-sep">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* INTRO */}
      <div className="ml-section">
        <div className="ml-label">The Movement</div>
        <h2 className="ml-title" style={{ maxWidth: 700 }}>More than merch. It's a feeling.</h2>
        <p className="ml-sub" style={{ textAlign: 'center' }}>Real DJs. Real coffee. Real community. No alcohol necessary. Every piece carries the energy of the dance floor into your everyday life.</p>
      </div>

      {/* SPREAD — Coffee Shop */}
      <div className="ml-spread">
        <div className="ml-spread-img">
          <img src="/lumen/coffee-shop-group.png" alt="" />
        </div>
        <div className="ml-spread-text">
          <div className="ml-spread-label">Coffee + Music + Community</div>
          <h2 className="ml-spread-title">You Are So Welcomed</h2>
          <p className="ml-spread-body">Strangers become friends on the dance floor. From the coffee shop to the pool deck, we bring the energy wherever the community gathers. This is what morning looks like when you're alive.</p>
          <div className="ml-spread-link">Shop Crops & Tanks &rarr;</div>
        </div>
      </div>

      {/* BIG MARQUEE — DARK */}
      <div className="ml-bigm ml-bigm-dark">
        <div className="ml-bigm-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ml-bigm-text">
              <span className="ml-c">MORNING</span> <span className="ml-f">RAVE</span> <span className="ml-bigm-sep">/</span> <span className="ml-c">CLUB</span> <span className="ml-f">LUMEN</span> <span className="ml-bigm-sep">/</span>
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
        <div className="ml-products-head">
          <div>
            <div className="ml-label">New Arrivals</div>
            <h2 className="ml-title" style={{ marginBottom: 0 }}>The Drop</h2>
          </div>
          <span className="ml-products-link">View All &rarr;</span>
        </div>
        <div className="ml-pgrid">
          <div className="ml-pcard">
            <div className="ml-pcard-img"><img src="/lumen/cherry-lips-tank-lifestyle.png" alt="" /></div>
            <div className="ml-pcard-info">
              <div className="ml-pcard-name">Morning Rave Cherry Lips Tank</div>
              <div className="ml-pcard-price">$38</div>
            </div>
          </div>
          <div className="ml-pcard">
            <div className="ml-pcard-img"><img src="/lumen/move-body-tee-lifestyle.png" alt="" /></div>
            <div className="ml-pcard-info">
              <div className="ml-pcard-name">Move Your Body Tee</div>
              <div className="ml-pcard-price">$46</div>
            </div>
          </div>
          <div className="ml-pcard">
            <div className="ml-pcard-img"><img src="/lumen/morning-rave-hoodie-lifestyle.png" alt="" /></div>
            <div className="ml-pcard-info">
              <div className="ml-pcard-name">The Morning Rave Hoodie</div>
              <div className="ml-pcard-price">$72</div>
            </div>
          </div>
          <div className="ml-pcard">
            <div className="ml-pcard-img"><img src="/lumen/disco-crop-lifestyle.png" alt="" /></div>
            <div className="ml-pcard-info">
              <div className="ml-pcard-name">Disco Ball Character Crop Tee</div>
              <div className="ml-pcard-price">$36</div>
            </div>
          </div>
          <div className="ml-pcard">
            <div className="ml-pcard-img"><img src="/lumen/good-energy-hoodie-lifestyle.png" alt="" /></div>
            <div className="ml-pcard-info">
              <div className="ml-pcard-name">Good Energy Club Hoodie</div>
              <div className="ml-pcard-price">$78</div>
            </div>
          </div>
          <div className="ml-pcard">
            <div className="ml-pcard-img"><img src="/lumen/welcomed-crop-lifestyle.png" alt="" /></div>
            <div className="ml-pcard-info">
              <div className="ml-pcard-name">You Are So Welcomed Crop Tee</div>
              <div className="ml-pcard-price">$42</div>
            </div>
          </div>
        </div>
      </div>

      {/* LIFESTYLE BANNER — Pool Party */}
      <div className="ml-banner">
        <img className="ml-banner-img" src="/lumen/pool-party-group.png" alt="" />
        <div className="ml-banner-overlay" />
        <div className="ml-banner-content">
          <h2>Move Your<br />Body</h2>
          <p>Morning Rave &mdash; Phoenix, AZ</p>
        </div>
      </div>

      {/* BIG MARQUEE — CREAM */}
      <div className="ml-bigm ml-bigm-cream">
        <div className="ml-bigm-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ml-bigm-text">
              <span className="ml-f">COFFEE</span> <span className="ml-bigm-sep">+</span> <span>MUSIC</span> <span className="ml-bigm-sep">+</span> <span className="ml-f">COMMUNITY</span> <span className="ml-bigm-sep">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* SPREAD REVERSE — Venue Friends */}
      <div className="ml-spread ml-spread-rev">
        <div className="ml-spread-text" style={{ background: '#FFF8F0' }}>
          <div className="ml-spread-label">The Culture</div>
          <h2 className="ml-spread-title">Good Energy Club</h2>
          <p className="ml-spread-body">Heavyweight fleece, oversized fit, designed for the morning ravers. Front chest script, full back print. Three colorways that hit different. Built for people who move with intention.</p>
          <div className="ml-spread-link">Shop Hoodies &rarr;</div>
        </div>
        <div className="ml-spread-img">
          <img src="/lumen/venue-friends.png" alt="" />
        </div>
      </div>

      {/* PHOTO GRID */}
      <div className="ml-photogrid">
        <div className="ml-pg-item ml-tall">
          <img src="/lumen/cherry-lips-tank-lifestyle.png" alt="" />
          <div className="ml-pg-overlay"><span>Cherry Lips</span></div>
        </div>
        <div className="ml-pg-item">
          <img src="/lumen/move-body-tee-lifestyle.png" alt="" />
          <div className="ml-pg-overlay"><span>Move Your Body</span></div>
        </div>
        <div className="ml-pg-item">
          <img src="/lumen/disco-crop-lifestyle.png" alt="" />
          <div className="ml-pg-overlay"><span>Disco Ball</span></div>
        </div>
        <div className="ml-pg-item">
          <img src="/lumen/welcomed-crop-lifestyle.png" alt="" />
          <div className="ml-pg-overlay"><span>You Are So Welcomed</span></div>
        </div>
        <div className="ml-pg-item ml-tall">
          <img src="/lumen/morning-rave-hoodie-lifestyle.png" alt="" />
          <div className="ml-pg-overlay"><span>Morning Rave</span></div>
        </div>
        <div className="ml-pg-item">
          <img src="/lumen/tote-bag-lifestyle.png" alt="" />
          <div className="ml-pg-overlay"><span>Tote Bag</span></div>
        </div>
      </div>

      {/* BIG MARQUEE — BLUE */}
      <div className="ml-bigm ml-bigm-blue">
        <div className="ml-bigm-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ml-bigm-text">
              <span className="ml-f">YOU ARE SO WELCOMED</span> <span className="ml-bigm-sep">/</span> <span>ENERGY IS THE NEW CURRENCY</span> <span className="ml-bigm-sep">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* VALUES */}
      <div className="ml-values">
        <div style={{ textAlign: 'center' }}>
          <div className="ml-label">The Vibe</div>
          <h2 className="ml-title">What is Club Lumen?</h2>
          <p className="ml-sub" style={{ margin: '0 auto' }}>A sober-curious morning rave. Real DJs. Real coffee. Real community. No alcohol necessary.</p>
        </div>
        <div className="ml-values-grid">
          <div>
            <div className="ml-val-icon">&#9749;</div>
            <div className="ml-val-title">Coffee</div>
            <div className="ml-val-desc">Local roasters serving up the good stuff. Espresso, cold brew, matcha. The only buzz you need to dance.</div>
          </div>
          <div>
            <div className="ml-val-icon">&#9835;</div>
            <div className="ml-val-title">Music</div>
            <div className="ml-val-desc">Real DJs spinning real sets. House, disco, funk, feel-good energy. The kind of music that moves your body and your soul.</div>
          </div>
          <div>
            <div className="ml-val-icon">&#9734;</div>
            <div className="ml-val-title">Community</div>
            <div className="ml-val-desc">Strangers become friends on the dance floor. A safe space to be yourself, move freely, and connect.</div>
          </div>
        </div>
      </div>

      {/* LIFESTYLE BANNER — Good Energy */}
      <div className="ml-banner">
        <img className="ml-banner-img" src="/lumen/good-energy-hoodie-lifestyle.png" alt="" />
        <div className="ml-banner-overlay" />
        <div className="ml-banner-content">
          <h2>Good Energy<br />Only</h2>
          <p>Lumen Energy &mdash; For The Morning Ravers</p>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="ml-newsletter">
        <div className="ml-label" style={{ color: '#E8866A', textAlign: 'center' }}>Stay Locked In</div>
        <div className="ml-newsletter-title">Join the Movement</div>
        <div className="ml-newsletter-sub">First access to merch drops, event tickets, and exclusive colorways.</div>
        <div className="ml-newsletter-form">
          <div className="ml-newsletter-input">Your email</div>
          <div className="ml-newsletter-btn">Subscribe</div>
        </div>
      </div>
    </div>
  );
}
