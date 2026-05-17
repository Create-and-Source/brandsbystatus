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
          height: 400px;
          overflow: hidden;
        }
        .ml-hero > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ml-hero-grad {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(255,250,245,1) 0%, rgba(255,250,245,0.3) 50%, rgba(255,250,245,0.5) 100%);
        }
        .ml-hero-inner {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 50px;
          text-align: center;
        }
        .ml-hero-logo {
          width: 120px;
          margin-bottom: 16px;
        }
        .ml-hero-tag {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #E8866A;
          margin-bottom: 24px;
        }
        .ml-hero-cta {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #fff;
          background: #1A1A1A;
          padding: 14px 32px;
          border-radius: 40px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* TICKER */
        .ml-ticker {
          padding: 12px 0;
          overflow: hidden;
          border-top: 1px solid #E8E2DA;
          border-bottom: 1px solid #E8E2DA;
          background: #FFFAF5;
        }
        .ml-ticker-track {
          display: flex;
          gap: 28px;
          width: max-content;
          animation: ml-scroll 22s linear infinite;
        }
        .ml-ticker-text {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #888;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .ml-ticker-dot {
          width: 5px;
          height: 5px;
          background: #E8866A;
          border-radius: 50%;
          display: inline-block;
        }

        @keyframes ml-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }

        /* MARQUEE */
        .ml-marquee {
          padding: 24px 0;
          overflow: hidden;
          border-bottom: 1px solid #E8E2DA;
        }
        .ml-marquee-track {
          display: flex;
          width: max-content;
          animation: ml-scroll 18s linear infinite;
        }
        .ml-marquee-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 20px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 44px;
          font-weight: 800;
          text-transform: uppercase;
          white-space: nowrap;
          color: transparent;
          -webkit-text-stroke: 1.5px #E8E2DA;
        }
        .ml-marquee-item .ml-filled {
          color: #1A1A1A;
          -webkit-text-stroke: none;
        }
        .ml-marquee-item .ml-coral {
          color: #E8866A;
          -webkit-text-stroke: none;
        }

        /* PILLARS */
        .ml-pillars {
          display: flex;
          justify-content: center;
          gap: 48px;
          padding: 48px 32px;
          border-bottom: 1px solid #E8E2DA;
        }
        .ml-pillar {
          text-align: center;
        }
        .ml-pillar-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FFF0E8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px;
          font-size: 18px;
        }
        .ml-pillar-name {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #555;
        }

        /* INTRO */
        .ml-intro {
          max-width: 500px;
          margin: 0 auto;
          padding: 56px 32px;
          text-align: center;
        }
        .ml-intro-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #E8866A;
          margin-bottom: 16px;
        }
        .ml-intro h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 14px;
        }
        .ml-intro p {
          font-size: 13px;
          line-height: 1.8;
          color: #888;
        }

        /* PRODUCTS */
        .ml-products {
          padding: 0 32px 40px;
        }
        .ml-products-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 24px;
        }
        .ml-products-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 700;
        }
        .ml-products-header span {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #E8866A;
        }
        .ml-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .ml-card img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          background: #FFF0E8;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .ml-card-name {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .ml-card-price {
          font-size: 12px;
          color: #888;
        }

        /* SPREAD */
        .ml-spread {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          min-height: 350px;
          border-top: 1px solid #E8E2DA;
        }
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
          padding: 40px;
        }
        .ml-spread-text h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .ml-spread-text p {
          font-size: 13px;
          color: #888;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .ml-spread-cta {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #E8866A;
        }

        /* PHOTO GRID */
        .ml-photos {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2px;
        }
        .ml-photos img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .ml-hero { height: 280px; }
          .ml-hero-inner { padding-bottom: 30px; }
          .ml-hero-logo { width: 80px; }
          .ml-marquee-item { font-size: 28px; padding: 0 12px; }
          .ml-pillars { gap: 24px; padding: 32px 16px; }
          .ml-intro { padding: 36px 20px; }
          .ml-intro h2 { font-size: 20px; }
          .ml-products { padding: 0 16px 32px; }
          .ml-spread { grid-template-columns: 1fr; min-height: auto; }
          .ml-spread-text { padding: 24px 16px; }
          .ml-spread-img img { height: 200px; }
        }
      `}</style>

      {/* HERO */}
      <div className="ml-hero">
        <img src="/portfolio/lumen-welcomed.png" alt="" />
        <div className="ml-hero-grad" />
        <div className="ml-hero-inner">
          <img src="/portfolio/lumen-logo.png" alt="Club Lumen" className="ml-hero-logo" />
          <div className="ml-hero-tag">Coffee + Music + Community</div>
          <div className="ml-hero-cta">Shop Now →</div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ml-ticker">
        <div className="ml-ticker-track">
          {[...Array(3)].map((_, r) =>
            ['Coffee + Music + Community', 'Dance Before Noon', 'Energy Is The New Currency', 'Good Energy Club', 'You Are So Welcomed', 'Morning Rave'].map((t, i) => (
              <span className="ml-ticker-text" key={`${r}-${i}`}>
                {t}
                <span className="ml-ticker-dot" />
              </span>
            ))
          )}
        </div>
      </div>

      {/* MARQUEE */}
      <div className="ml-marquee">
        <div className="ml-marquee-track">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ml-marquee-item">
              <span className="ml-coral">DANCE</span>
              <span>/</span>
              <span className="ml-filled">BEFORE NOON</span>
              <span>/</span>
              <span>CLUB LUMEN</span>
              <span>/</span>
            </div>
          ))}
        </div>
      </div>

      {/* PILLARS */}
      <div className="ml-pillars">
        <div className="ml-pillar">
          <div className="ml-pillar-icon">☕</div>
          <div className="ml-pillar-name">Coffee</div>
        </div>
        <div className="ml-pillar">
          <div className="ml-pillar-icon">🎵</div>
          <div className="ml-pillar-name">Music</div>
        </div>
        <div className="ml-pillar">
          <div className="ml-pillar-icon">👥</div>
          <div className="ml-pillar-name">Community</div>
        </div>
      </div>

      {/* INTRO */}
      <div className="ml-intro">
        <div className="ml-intro-label">The Movement</div>
        <h2>Not a party. A practice. Energy is the new currency.</h2>
        <p>Club Lumen is a morning rave collective. No alcohol. No ego. Just coffee, music, and movement in the desert sunrise.</p>
      </div>

      {/* SPREAD */}
      <div className="ml-spread">
        <div className="ml-spread-img">
          <img src="/portfolio/lumen-2.png" alt="" />
        </div>
        <div className="ml-spread-text">
          <h3>The Morning Rave Collection</h3>
          <p>Every piece is designed for the dance floor. Breathable, festival-ready, and drenched in good energy.</p>
          <div className="ml-spread-cta">Shop Collection →</div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="ml-products" style={{ paddingTop: 40 }}>
        <div className="ml-products-header">
          <h2>Shop</h2>
          <span>View All →</span>
        </div>
        <div className="ml-grid">
          <div className="ml-card">
            <img src="/portfolio/lumen-1.png" alt="" />
            <div className="ml-card-name">Sunrise Hoodie</div>
            <div className="ml-card-price">$78</div>
          </div>
          <div className="ml-card">
            <img src="/portfolio/lumen-3.png" alt="" />
            <div className="ml-card-name">Energy Tee</div>
            <div className="ml-card-price">$42</div>
          </div>
          <div className="ml-card">
            <img src="/portfolio/lumen-5.png" alt="" />
            <div className="ml-card-name">Festival Crewneck</div>
            <div className="ml-card-price">$68</div>
          </div>
          <div className="ml-card">
            <img src="/portfolio/lumen-6.png" alt="" />
            <div className="ml-card-name">Lumen Dad Hat</div>
            <div className="ml-card-price">$32</div>
          </div>
        </div>
      </div>

      {/* MARQUEE 2 */}
      <div className="ml-marquee">
        <div className="ml-marquee-track">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ml-marquee-item">
              <span className="ml-filled">GOOD ENERGY</span>
              <span>/</span>
              <span className="ml-coral">CLUB</span>
              <span>/</span>
              <span>LUMEN</span>
              <span>/</span>
            </div>
          ))}
        </div>
      </div>

      {/* PHOTO GRID */}
      <div className="ml-photos">
        <img src="/portfolio/lumen-2.png" alt="" />
        <img src="/portfolio/lumen-welcomed.png" alt="" />
        <img src="/portfolio/lumen-5.png" alt="" />
        <img src="/portfolio/lumen-1.png" alt="" />
        <img src="/portfolio/lumen-3.png" alt="" />
        <img src="/portfolio/lumen-6.png" alt="" />
      </div>
    </div>
  );
}
