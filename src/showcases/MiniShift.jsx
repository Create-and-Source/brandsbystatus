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
          height: 400px;
          overflow: hidden;
        }
        .ms-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ms-hero-grad {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #050505 0%, rgba(5,5,5,0.4) 40%, rgba(5,5,5,0.6) 100%);
        }
        .ms-hero-inner {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 60px;
          text-align: center;
        }
        .ms-hero-logo {
          width: 180px;
          filter: brightness(0) invert(1);
          margin-bottom: 16px;
        }
        .ms-hero-tag {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 24px;
        }
        .ms-hero-cta {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #050505;
          background: #F0F0F0;
          padding: 14px 32px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
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
          gap: 32px;
          width: max-content;
          animation: ms-scroll 20s linear infinite;
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
          gap: 32px;
        }
        .ms-ticker-dot {
          width: 4px;
          height: 4px;
          background: #E50000;
          border-radius: 50%;
          display: inline-block;
        }

        @keyframes ms-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }

        /* MARQUEE */
        .ms-marquee {
          padding: 28px 0;
          overflow: hidden;
          border-bottom: 1px solid #1A1A1A;
        }
        .ms-marquee-track {
          display: flex;
          width: max-content;
          animation: ms-scroll 15s linear infinite;
        }
        .ms-marquee-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 16px;
          font-size: 48px;
          font-weight: 900;
          text-transform: uppercase;
          white-space: nowrap;
          color: transparent;
          -webkit-text-stroke: 1px #1A1A1A;
        }
        .ms-marquee-item .ms-filled {
          color: #F0F0F0;
          -webkit-text-stroke: none;
        }
        .ms-marquee-item .ms-red {
          color: #E50000;
          -webkit-text-stroke: none;
        }

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

        /* INTRO */
        .ms-intro {
          max-width: 500px;
          margin: 0 auto;
          padding: 60px 32px;
          text-align: center;
        }
        .ms-intro-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #E50000;
          margin-bottom: 16px;
        }
        .ms-intro h2 {
          font-size: 24px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 16px;
        }
        .ms-intro p {
          font-size: 13px;
          line-height: 1.8;
          color: #666;
        }

        /* PRODUCTS */
        .ms-products {
          padding: 0 32px 40px;
        }
        .ms-products-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 24px;
        }
        .ms-products-header h2 {
          font-size: 22px;
          font-weight: 700;
        }
        .ms-products-header span {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #666;
        }
        .ms-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .ms-card img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          background: #111;
          margin-bottom: 10px;
        }
        .ms-card-name {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .ms-card-price {
          font-size: 12px;
          color: #666;
        }

        /* PHOTO GRID */
        .ms-photos {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2px;
        }
        .ms-photos img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          filter: saturate(0.7);
        }
        .ms-photos .ms-tall {
          grid-row: span 2;
          aspect-ratio: auto;
          height: 100%;
        }

        @media (max-width: 768px) {
          .ms-hero { height: 280px; }
          .ms-hero-inner { padding-bottom: 30px; }
          .ms-hero-logo { width: 120px; }
          .ms-marquee-item { font-size: 28px; padding: 0 12px; }
          .ms-intro { padding: 40px 20px; }
          .ms-intro h2 { font-size: 20px; }
          .ms-products { padding: 0 16px 32px; }
          .ms-photos { grid-template-columns: 1fr 1fr; }
          .ms-photos .ms-tall { grid-row: span 1; aspect-ratio: 1; }
        }
      `}</style>

      {/* HERO */}
      <div className="ms-hero">
        <img src="/portfolio/shift-crosswalk.png" alt="" />
        <div className="ms-hero-grad" />
        <div className="ms-hero-inner">
          <img src="/portfolio/shift-logo.jpeg" alt="Shift" className="ms-hero-logo" />
          <div className="ms-hero-tag">Life Keeps Moving</div>
          <div className="ms-hero-cta">Shop Now →</div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ms-ticker">
        <div className="ms-ticker-track">
          {[...Array(3)].map((_, r) =>
            ['Free Shipping Over $150', 'Heavyweight Premium Cotton', 'Life Keeps Moving', 'Oversized Fit', 'Limited Drops', 'Forward Only'].map((t, i) => (
              <span className="ms-ticker-text" key={`${r}-${i}`}>
                {t}
                <span className="ms-ticker-dot" />
              </span>
            ))
          )}
        </div>
      </div>

      {/* MARQUEE */}
      <div className="ms-marquee">
        <div className="ms-marquee-track">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ms-marquee-item">
              <span className="ms-filled">SHIFT</span>
              <span>→</span>
              <span className="ms-red">FORWARD</span>
              <span>→</span>
              <span>ONLY</span>
              <span>→</span>
            </div>
          ))}
        </div>
      </div>

      {/* INTRO */}
      <div className="ms-intro">
        <div className="ms-intro-label">The Brand</div>
        <h2><span className="ms-glitch" data-text="More than apparel. A mindset. A movement.">More than apparel. A mindset. A movement.</span></h2>
        <p>Every piece carries the energy of forward motion. Heavyweight, premium, built to last — designed for people who move with intention.</p>
      </div>

      {/* PRODUCTS */}
      <div className="ms-products">
        <div className="ms-products-header">
          <h2><span className="ms-glitch" data-text="The Collection">The Collection</span></h2>
          <span>View All →</span>
        </div>
        <div className="ms-grid">
          <div className="ms-card">
            <img src="/portfolio/shift-girls.png" alt="" />
            <div className="ms-card-name">Essential Hoodie</div>
            <div className="ms-card-price">$85</div>
          </div>
          <div className="ms-card">
            <img src="/portfolio/shift-4.png" alt="" />
            <div className="ms-card-name">Forward Tee</div>
            <div className="ms-card-price">$45</div>
          </div>
          <div className="ms-card">
            <img src="/portfolio/shift-5.png" alt="" />
            <div className="ms-card-name">Racing Crewneck</div>
            <div className="ms-card-price">$75</div>
          </div>
          <div className="ms-card">
            <img src="/portfolio/shift-subway.png" alt="" />
            <div className="ms-card-name">City Cap</div>
            <div className="ms-card-price">$35</div>
          </div>
        </div>
      </div>

      {/* MARQUEE 2 */}
      <div className="ms-marquee">
        <div className="ms-marquee-track">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ms-marquee-item">
              <span className="ms-red">NO REVERSE</span>
              <span>→</span>
              <span className="ms-filled">KEEP MOVING</span>
              <span>→</span>
              <span>SHIFT</span>
              <span>→</span>
            </div>
          ))}
        </div>
      </div>

      {/* PHOTO GRID */}
      <div className="ms-photos">
        <img src="/portfolio/shift-chinatown.jpg" alt="" className="ms-tall" />
        <img src="/portfolio/shift-crosswalk.png" alt="" />
        <img src="/portfolio/shift-pizza.png" alt="" />
        <img src="/portfolio/shift-girls.png" alt="" />
        <img src="/portfolio/shift-subway.png" alt="" className="ms-tall" />
        <img src="/portfolio/shift-4.png" alt="" />
      </div>
    </div>
  );
}
