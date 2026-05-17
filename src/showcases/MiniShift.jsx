export default function MiniShift() {
  return (
    <div className="ms">
      <style>{`
        .ms {
          background: #050505;
          color: #F0F0F0;
          font-family: 'Inter', -apple-system, sans-serif;
          pointer-events: none;
          user-select: none;
          overflow: hidden;
        }
        .ms img { max-width: 100%; display: block; }

        /* HERO */
        .ms-hero {
          position: relative;
          height: 500px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ms-hero > img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ms-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(5,5,5,0.4), rgba(5,5,5,0.7));
        }
        .ms-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 40px;
        }
        .ms-hero-logo {
          height: 80px;
          width: auto;
          margin: 0 auto 20px;
          filter: brightness(0) invert(1);
        }
        .ms-hero-tagline {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
        }
        .ms-hero-slogan {
          font-size: 18px;
          font-weight: 500;
          color: rgba(255,255,255,0.3);
          font-style: italic;
        }
        .ms-hero-cta {
          margin-top: 32px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #050505;
          background: #F0F0F0;
          padding: 14px 36px;
        }

        /* TICKER */
        .ms-ticker {
          padding: 12px 0;
          overflow: hidden;
          border-top: 1px solid #1A1A1A;
          border-bottom: 1px solid #1A1A1A;
        }
        .ms-ticker-track {
          display: flex;
          animation: ms-scroll 35s linear infinite;
          width: max-content;
        }
        .ms-ticker-text {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }
        .ms-ticker-dot {
          width: 4px;
          height: 4px;
          background: #E50000;
          border-radius: 50%;
          margin: 0 20px;
          flex-shrink: 0;
        }

        @keyframes ms-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* BIG MARQUEE */
        .ms-big-marquee {
          padding: 24px 0;
          overflow: hidden;
          border-bottom: 1px solid #1A1A1A;
        }
        .ms-big-marquee-track {
          display: flex;
          gap: 0;
          animation: ms-scroll 20s linear infinite;
          width: max-content;
        }
        .ms-big-marquee-text {
          font-size: 64px;
          font-weight: 900;
          text-transform: uppercase;
          white-space: nowrap;
          letter-spacing: -2px;
          line-height: 1;
          padding: 0 16px;
          color: transparent;
          -webkit-text-stroke: 1px #1A1A1A;
        }
        .ms-big-marquee-text .ms-filled { color: #F0F0F0; -webkit-text-stroke: none; }
        .ms-big-marquee-text .ms-red { color: #E50000; -webkit-text-stroke: none; }
        .ms-big-marquee-sep { color: #333; margin: 0 16px; }

        /* GLITCH TEXT */
        .ms-glitch {
          position: relative;
          display: inline-block;
          animation: ms-glitch-skew 4s infinite ease-in-out alternate;
        }
        .ms-glitch::before,
        .ms-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          overflow: hidden;
        }
        .ms-glitch::before {
          color: #0ff;
          animation: ms-glitch-clip 3s infinite linear alternate-reverse;
          left: 2px;
          text-shadow: -2px 0 #E50000;
        }
        .ms-glitch::after {
          color: #E50000;
          animation: ms-glitch-clip 2s infinite linear alternate;
          left: -2px;
          text-shadow: 2px 0 #0ff;
        }
        @keyframes ms-glitch-skew {
          0%, 100% { transform: skew(0deg); }
          20% { transform: skew(-0.5deg); }
          60% { transform: skew(0.5deg); }
        }
        @keyframes ms-glitch-clip {
          0% { clip-path: inset(40% 0 61% 0); }
          20% { clip-path: inset(92% 0 1% 0); }
          40% { clip-path: inset(43% 0 1% 0); }
          60% { clip-path: inset(25% 0 58% 0); }
          80% { clip-path: inset(54% 0 7% 0); }
          100% { clip-path: inset(58% 0 43% 0); }
        }

        /* SECTION */
        .ms-section {
          padding: 80px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ms-section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #E50000;
          margin-bottom: 14px;
        }
        .ms-section-title {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 14px;
        }
        .ms-section-sub {
          font-size: 13px;
          line-height: 1.8;
          color: #666;
          max-width: 480px;
        }

        /* SPREAD */
        .ms-spread {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 400px;
          border-top: 1px solid #1A1A1A;
        }
        .ms-spread-reverse { direction: rtl; }
        .ms-spread-reverse > * { direction: ltr; }
        .ms-spread-img { overflow: hidden; }
        .ms-spread-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.8);
        }
        .ms-spread-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 40px;
          background: #0A0A0A;
        }
        .ms-spread-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #E50000;
          margin-bottom: 14px;
        }
        .ms-spread-title {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 14px;
        }
        .ms-spread-body {
          font-size: 13px;
          line-height: 1.8;
          color: #666;
          margin-bottom: 24px;
        }
        .ms-spread-link {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #E50000;
        }

        /* PRODUCTS */
        .ms-products {
          padding: 60px 40px;
          border-top: 1px solid #1A1A1A;
        }
        .ms-products-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 32px;
        }
        .ms-products-title {
          font-size: 24px;
          font-weight: 700;
        }
        .ms-products-link {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #666;
        }
        .ms-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        .ms-card {
          overflow: hidden;
        }
        .ms-card-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          background: #111;
          filter: saturate(0.8);
          margin-bottom: 12px;
        }
        .ms-card-name {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 3px;
        }
        .ms-card-price {
          font-size: 13px;
          color: #666;
        }

        /* LIFESTYLE BANNER */
        .ms-lifestyle {
          position: relative;
          height: 400px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid #1A1A1A;
        }
        .ms-lifestyle img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.7);
        }
        .ms-lifestyle-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(5,5,5,0.8), rgba(5,5,5,0.3));
        }
        .ms-lifestyle-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
        }
        .ms-lifestyle-content h2 {
          font-size: 56px;
          font-weight: 900;
          letter-spacing: -2px;
          line-height: 0.9;
          text-transform: uppercase;
        }
        .ms-lifestyle-content p {
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-top: 12px;
        }

        /* PHOTO GRID */
        .ms-photos {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2px;
          border-top: 1px solid #1A1A1A;
        }
        .ms-photos-item {
          overflow: hidden;
          aspect-ratio: 1;
        }
        .ms-photos-item.ms-tall { grid-row: span 2; aspect-ratio: auto; }
        .ms-photos-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.7);
        }

        /* NEWSLETTER */
        .ms-newsletter {
          padding: 60px 40px;
          text-align: center;
          border-top: 1px solid #1A1A1A;
        }
        .ms-newsletter-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .ms-newsletter-sub {
          font-size: 12px;
          color: #666;
          margin-bottom: 28px;
        }
        .ms-newsletter-form {
          display: flex;
          max-width: 380px;
          margin: 0 auto;
          border: 1px solid #222;
          overflow: hidden;
        }
        .ms-newsletter-input {
          flex: 1;
          padding: 12px 16px;
          color: #666;
          font-size: 12px;
        }
        .ms-newsletter-btn {
          padding: 12px 20px;
          background: #E50000;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .ms-hero { height: 350px; }
          .ms-hero-logo { height: 60px; }
          .ms-big-marquee-text { font-size: 36px; }
          .ms-section { padding: 48px 24px; }
          .ms-section-title { font-size: 22px; }
          .ms-spread { grid-template-columns: 1fr; min-height: auto; }
          .ms-spread-text { padding: 32px 24px; }
          .ms-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .ms-products { padding: 40px 20px; }
          .ms-lifestyle { height: 280px; }
          .ms-lifestyle-content h2 { font-size: 36px; }
          .ms-photos { grid-template-columns: 1fr 1fr; }
          .ms-photos-item.ms-tall { grid-row: span 1; aspect-ratio: 1; }
        }
      `}</style>

      {/* HERO */}
      <div className="ms-hero">
        <img src="/portfolio/shift-crosswalk.png" alt="" />
        <div className="ms-hero-overlay" />
        <div className="ms-hero-content">
          <img src="/portfolio/shift-logo.jpeg" alt="Shift" className="ms-hero-logo" />
          <div className="ms-hero-tagline">Life Keeps Moving</div>
          <div className="ms-hero-slogan">Forward Only</div>
          <div className="ms-hero-cta">Shop Now &rarr;</div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ms-ticker">
        <div className="ms-ticker-track">
          {[...Array(3)].map((_, r) =>
            ['Free Shipping Over $150', 'Heavyweight Premium Cotton', 'Life Keeps Moving', 'Oversized Fit', 'Limited Drops', 'Forward Only', 'NYC Streetwear'].map((t, i) => (
              <span className="ms-ticker-text" key={`${r}-${i}`}>
                {t}
                <span className="ms-ticker-dot" />
              </span>
            ))
          )}
        </div>
      </div>

      {/* BIG MARQUEE 1 */}
      <div className="ms-big-marquee">
        <div className="ms-big-marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ms-big-marquee-text">
              <span className="ms-filled">SHIFT</span> <span className="ms-big-marquee-sep">&rarr;</span> <span className="ms-red">FORWARD</span> <span className="ms-big-marquee-sep">&rarr;</span> <span>ONLY</span> <span className="ms-big-marquee-sep">&rarr;</span>
            </span>
          ))}
        </div>
      </div>

      {/* INTRO */}
      <div className="ms-section">
        <div className="ms-section-label">The Brand</div>
        <h2 className="ms-section-title"><span className="ms-glitch" data-text="More than apparel. A mindset. A movement.">More than apparel. A mindset. A movement.</span></h2>
        <p className="ms-section-sub">Every piece carries the energy of forward motion. Heavyweight, premium, built to last — designed for people who move with intention.</p>
      </div>

      {/* SPREAD */}
      <div className="ms-spread">
        <div className="ms-spread-img">
          <img src="/portfolio/shift-girls.png" alt="" />
        </div>
        <div className="ms-spread-text">
          <div className="ms-spread-label">The Culture</div>
          <h2 className="ms-spread-title">No Reverse. Keep Moving.</h2>
          <p className="ms-spread-body">NYC streets, forward motion energy. Every piece is cut oversized in heavyweight cotton. Built for the city. Built to last.</p>
          <div className="ms-spread-link">Shop Hoodies &rarr;</div>
        </div>
      </div>

      {/* BIG MARQUEE 2 */}
      <div className="ms-big-marquee">
        <div className="ms-big-marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ms-big-marquee-text">
              <span className="ms-red">NO REVERSE</span> <span className="ms-big-marquee-sep">&rarr;</span> <span className="ms-filled">KEEP MOVING</span> <span className="ms-big-marquee-sep">&rarr;</span> <span>SHIFT</span> <span className="ms-big-marquee-sep">&rarr;</span>
            </span>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="ms-products">
        <div className="ms-products-header">
          <div className="ms-products-title"><span className="ms-glitch" data-text="The Collection">The Collection</span></div>
          <span className="ms-products-link">View All &rarr;</span>
        </div>
        <div className="ms-grid">
          <div className="ms-card">
            <img className="ms-card-img" src="/portfolio/shift-girls.png" alt="" />
            <div className="ms-card-name">Essential Hoodie</div>
            <div className="ms-card-price">$85</div>
          </div>
          <div className="ms-card">
            <img className="ms-card-img" src="/portfolio/shift-4.png" alt="" />
            <div className="ms-card-name">Forward Tee</div>
            <div className="ms-card-price">$45</div>
          </div>
          <div className="ms-card">
            <img className="ms-card-img" src="/portfolio/shift-5.png" alt="" />
            <div className="ms-card-name">Racing Crewneck</div>
            <div className="ms-card-price">$75</div>
          </div>
          <div className="ms-card">
            <img className="ms-card-img" src="/portfolio/shift-subway.png" alt="" />
            <div className="ms-card-name">City Cap</div>
            <div className="ms-card-price">$35</div>
          </div>
          <div className="ms-card">
            <img className="ms-card-img" src="/portfolio/shift-crosswalk.png" alt="" />
            <div className="ms-card-name">Motion Shorts</div>
            <div className="ms-card-price">$55</div>
          </div>
          <div className="ms-card">
            <img className="ms-card-img" src="/portfolio/shift-pizza.png" alt="" />
            <div className="ms-card-name">No Reverse Jacket</div>
            <div className="ms-card-price">$120</div>
          </div>
        </div>
      </div>

      {/* LIFESTYLE BANNER */}
      <div className="ms-lifestyle">
        <img src="/portfolio/shift-subway.png" alt="" />
        <div className="ms-lifestyle-overlay" />
        <div className="ms-lifestyle-content">
          <h2>Life Keeps<br />Moving</h2>
          <p>Shift &mdash; NYC Streetwear</p>
        </div>
      </div>

      {/* SPREAD REVERSE */}
      <div className="ms-spread ms-spread-reverse">
        <div className="ms-spread-text">
          <div className="ms-spread-label">Limited Drop</div>
          <h2 className="ms-spread-title">The Forward Collection</h2>
          <p className="ms-spread-body">Every drop is limited. When it's gone, it's gone. Designed in New York, inspired by the city that never stops.</p>
          <div className="ms-spread-link">Shop the Drop &rarr;</div>
        </div>
        <div className="ms-spread-img">
          <img src="/portfolio/shift-4.png" alt="" />
        </div>
      </div>

      {/* BIG MARQUEE 3 */}
      <div className="ms-big-marquee">
        <div className="ms-big-marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="ms-big-marquee-text">
              <span className="ms-filled">LIFE</span> <span className="ms-big-marquee-sep">&rarr;</span> <span className="ms-red">KEEPS</span> <span className="ms-big-marquee-sep">&rarr;</span> <span>MOVING</span> <span className="ms-big-marquee-sep">&rarr;</span>
            </span>
          ))}
        </div>
      </div>

      {/* PHOTO GRID */}
      <div className="ms-photos">
        <div className="ms-photos-item ms-tall">
          <img src="/portfolio/shift-chinatown.jpg" alt="" />
        </div>
        <div className="ms-photos-item">
          <img src="/portfolio/shift-crosswalk.png" alt="" />
        </div>
        <div className="ms-photos-item">
          <img src="/portfolio/shift-pizza.png" alt="" />
        </div>
        <div className="ms-photos-item">
          <img src="/portfolio/shift-girls.png" alt="" />
        </div>
        <div className="ms-photos-item ms-tall">
          <img src="/portfolio/shift-subway.png" alt="" />
        </div>
        <div className="ms-photos-item">
          <img src="/portfolio/shift-4.png" alt="" />
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="ms-newsletter">
        <div className="ms-newsletter-title"><span className="ms-glitch" data-text="Join the Movement">Join the Movement</span></div>
        <div className="ms-newsletter-sub">Be the first to know when new drops land.</div>
        <div className="ms-newsletter-form">
          <div className="ms-newsletter-input">Your email</div>
          <div className="ms-newsletter-btn">Subscribe</div>
        </div>
      </div>
    </div>
  );
}
