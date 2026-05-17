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
          position: relative;
        }
        .ms * { margin: 0; padding: 0; box-sizing: border-box; }
        .ms img { max-width: 100%; display: block; }

        /* SCANLINES */
        .ms-scanlines {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.08) 0px,
            rgba(0,0,0,0.08) 1px,
            transparent 1px,
            transparent 3px
          );
        }

        /* HERO */
        .ms-hero {
          position: relative;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .ms-hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ms-hero-grad {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.7) 100%);
        }
        .ms-hero-inner {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 40px;
        }
        .ms-hero-logo {
          height: 36px;
          width: auto;
          margin: 0 auto 20px;
          filter: brightness(0) invert(1);
        }
        .ms-hero-tag {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 28px;
        }
        .ms-hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
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
          animation: ms-tick 35s linear infinite;
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

        @keyframes ms-tick {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }

        /* MARQUEE */
        .ms-marquee {
          padding: 24px 0;
          overflow: hidden;
          border-bottom: 1px solid #1A1A1A;
        }
        .ms-marquee-track {
          display: flex;
          animation: ms-mq 18s linear infinite;
          width: max-content;
        }
        .ms-marquee-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 16px;
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 900;
          text-transform: uppercase;
          white-space: nowrap;
          color: transparent;
          -webkit-text-stroke: 1px #1A1A1A;
        }
        .ms-marquee-item .ms-f { color: #F0F0F0; -webkit-text-stroke: none; }
        .ms-marquee-item .ms-r { color: #E50000; -webkit-text-stroke: none; }

        @keyframes ms-mq {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* GLITCH */
        .ms-glitch {
          position: relative;
          display: inline-block;
          animation: ms-gskew 4s infinite ease-in-out alternate;
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
          animation: ms-gclip 3s infinite linear alternate-reverse;
          left: 2px;
          text-shadow: -2px 0 #E50000;
        }
        .ms-glitch::after {
          color: #E50000;
          animation: ms-gclip 2s infinite linear alternate;
          left: -2px;
          text-shadow: 2px 0 #0ff;
        }
        @keyframes ms-gskew {
          0%, 100% { transform: skew(0deg); }
          20% { transform: skew(-1deg); }
          40% { transform: skew(0.5deg); }
          60% { transform: skew(-0.5deg); }
          80% { transform: skew(1deg); }
        }
        @keyframes ms-gclip {
          0% { clip-path: inset(40% 0 61% 0); }
          20% { clip-path: inset(92% 0 1% 0); }
          40% { clip-path: inset(43% 0 1% 0); }
          60% { clip-path: inset(25% 0 58% 0); }
          80% { clip-path: inset(54% 0 7% 0); }
          100% { clip-path: inset(58% 0 43% 0); }
        }

        /* INTRO */
        .ms-intro {
          max-width: 560px;
          margin: 0 auto;
          padding: 80px 40px;
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
          font-size: clamp(22px, 4vw, 28px);
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 16px;
        }
        .ms-intro p {
          font-size: 14px;
          line-height: 1.8;
          color: #666;
        }

        /* SPREAD */
        .ms-spread {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 450px;
          border-top: 1px solid #1A1A1A;
        }
        .ms-spread-rev { direction: rtl; }
        .ms-spread-rev > * { direction: ltr; }
        .ms-spread-img { overflow: hidden; }
        .ms-spread-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ms-spread-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 40px;
          background: #0E0E0E;
        }
        .ms-spread-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #E50000;
          margin-bottom: 16px;
        }
        .ms-spread-title {
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 16px;
        }
        .ms-spread-body {
          font-size: 14px;
          line-height: 1.8;
          color: #666;
          margin-bottom: 24px;
        }
        .ms-spread-link {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #E50000;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* PULLQUOTE */
        .ms-pullquote {
          padding: 80px 40px;
          text-align: center;
          border-top: 1px solid #1A1A1A;
          border-bottom: 1px solid #1A1A1A;
        }
        .ms-pullquote-text {
          font-size: clamp(18px, 3vw, 28px);
          font-weight: 700;
          line-height: 1.4;
          max-width: 650px;
          margin: 0 auto;
        }
        .ms-pullquote-text em { color: #E50000; font-style: italic; }

        /* PRODUCTS */
        .ms-products {
          padding: 80px 40px;
        }
        .ms-products-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .ms-products-title {
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 700;
        }
        .ms-products-link {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #666;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ms-pgrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .ms-pcard {}
        .ms-pcard-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          background: #111;
          margin-bottom: 12px;
        }
        .ms-pcard-name {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .ms-pcard-price {
          font-size: 13px;
          color: #666;
        }

        /* PHOTO GRID */
        .ms-photos {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          border-top: 1px solid #1A1A1A;
        }
        .ms-pg-item {
          overflow: hidden;
          aspect-ratio: 1;
        }
        .ms-pg-item.ms-tall { grid-row: span 2; aspect-ratio: auto; }
        .ms-pg-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.8);
        }

        /* NEWSLETTER */
        .ms-newsletter {
          padding: 80px 40px;
          text-align: center;
          border-top: 1px solid #1A1A1A;
        }
        .ms-newsletter-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #E50000;
          margin-bottom: 16px;
        }
        .ms-newsletter-title {
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 700;
          margin-bottom: 12px;
        }
        .ms-newsletter-sub {
          font-size: 13px;
          color: #666;
          margin-bottom: 32px;
        }
        .ms-newsletter-form {
          display: flex;
          max-width: 420px;
          margin: 0 auto;
          border: 1px solid #222;
          overflow: hidden;
        }
        .ms-newsletter-input {
          flex: 1;
          padding: 14px 20px;
          color: #666;
          font-size: 13px;
        }
        .ms-newsletter-btn {
          padding: 14px 24px;
          background: #E50000;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .ms-hero { min-height: 350px; }
          .ms-hero-logo { height: 28px; }
          .ms-marquee-item { font-size: 28px !important; gap: 10px; padding: 0 10px; }
          .ms-intro { padding: 48px 24px; }
          .ms-intro h2 { font-size: 20px; }
          .ms-spread { grid-template-columns: 1fr; min-height: auto; }
          .ms-spread-text { padding: 32px 24px; }
          .ms-spread-img { min-height: 250px; }
          .ms-pgrid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .ms-products { padding: 48px 20px; }
          .ms-pullquote { padding: 48px 24px; }
          .ms-photos { grid-template-columns: 1fr 1fr; }
          .ms-pg-item.ms-tall { grid-row: span 1; aspect-ratio: 1; }
          .ms-newsletter { padding: 48px 20px; }
          .ms-newsletter-form { flex-direction: column; }
        }
      `}</style>

      {/* SCANLINES */}
      <div className="ms-scanlines" />

      {/* HERO */}
      <div className="ms-hero">
        <img className="ms-hero-bg" src="/shift/street-crossing.png" alt="" />
        <video src="/shift/shift-hero.mp4" autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
        <div className="ms-hero-grad" style={{ zIndex: 2 }} />
        <div className="ms-hero-inner">
          <img src="/shift/shift-logo.png" alt="Shift" className="ms-hero-logo" />
          <div className="ms-hero-tag">Life Keeps Moving</div>
          <div className="ms-hero-cta">Shop Now &rarr;</div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ms-ticker">
        <div className="ms-ticker-track">
          {[...Array(3)].map((_, r) =>
            ['Free Shipping Over $150', 'Heavyweight Premium Cotton', 'Life Keeps Moving', 'Oversized Fit', 'Limited Drops', 'Forward Only', 'No Reverse', 'Shift Your Perspective'].map((t, i) => (
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
              <span className="ms-f">SHIFT</span>
              <span>&rarr;</span>
              <span className="ms-r">FORWARD</span>
              <span>&rarr;</span>
              <span>ONLY</span>
              <span>&rarr;</span>
            </div>
          ))}
        </div>
      </div>

      {/* INTRO */}
      <div className="ms-intro">
        <div className="ms-intro-label">The Brand</div>
        <h2><span className="ms-glitch" data-text="More than apparel. A mindset. A movement.">More than apparel. A mindset. A movement.</span></h2>
        <p>Every piece carries the energy of forward motion. Heavyweight, premium, built to last — designed for people who move with intention. The arrow only points one direction.</p>
      </div>

      {/* SPREAD — Essentials */}
      <div className="ms-spread">
        <div className="ms-spread-img">
          <img src="/shift/street-crossing.png" alt="" />
        </div>
        <div className="ms-spread-text">
          <div className="ms-spread-label">Essentials</div>
          <h2 className="ms-spread-title"><span className="ms-glitch" data-text="Built for the Move">Built for the Move</span></h2>
          <p className="ms-spread-body">400gsm heavyweight cotton. Oversized, relaxed cuts. Pre-shrunk fleece that holds its shape wear after wear. This isn't fast fashion — it's built to last.</p>
          <div className="ms-spread-link">Shop Essentials &rarr;</div>
        </div>
      </div>

      {/* PULLQUOTE */}
      <div className="ms-pullquote">
        <p className="ms-pullquote-text">"The arrow only points one direction — <em>forward</em>. There is no reverse. No pause. No going back."</p>
      </div>

      {/* PRODUCTS */}
      <div className="ms-products">
        <div className="ms-products-head">
          <div className="ms-products-title"><span className="ms-glitch" data-text="The Collection">The Collection</span></div>
          <span className="ms-products-link">View All &rarr;</span>
        </div>
        <div className="ms-pgrid">
          <div className="ms-pcard">
            <img className="ms-pcard-img" src="/shift/pizza-shop.png" alt="" />
            <div className="ms-pcard-name">Shift Logo Crewneck</div>
            <div className="ms-pcard-price">$68</div>
          </div>
          <div className="ms-pcard">
            <img className="ms-pcard-img" src="/shift/nyc-crosswalk.png" alt="" />
            <div className="ms-pcard-name">Shift Logo Hoodie</div>
            <div className="ms-pcard-price">$78</div>
          </div>
          <div className="ms-pcard">
            <img className="ms-pcard-img" src="/shift/pool-party.png" alt="" />
            <div className="ms-pcard-name">Shift Logo Tee</div>
            <div className="ms-pcard-price">$42</div>
          </div>
          <div className="ms-pcard">
            <img className="ms-pcard-img" src="/shift/street-crossing.png" alt="" />
            <div className="ms-pcard-name">Shift Essentials Jogger</div>
            <div className="ms-pcard-price">$62</div>
          </div>
          <div className="ms-pcard">
            <img className="ms-pcard-img" src="/shift/car-meet.png" alt="" />
            <div className="ms-pcard-name">Shift Racing Vintage Tee</div>
            <div className="ms-pcard-price">$52</div>
          </div>
          <div className="ms-pcard">
            <img className="ms-pcard-img" src="/shift/convertible-pink-red.png" alt="" />
            <div className="ms-pcard-name">Shift Pink Collection</div>
            <div className="ms-pcard-price">$78</div>
          </div>
        </div>
      </div>

      {/* MARQUEE 2 */}
      <div className="ms-marquee">
        <div className="ms-marquee-track">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ms-marquee-item">
              <span className="ms-r">NO REVERSE</span>
              <span>&rarr;</span>
              <span className="ms-f">KEEP MOVING</span>
              <span>&rarr;</span>
              <span>SHIFT</span>
              <span>&rarr;</span>
            </div>
          ))}
        </div>
      </div>

      {/* PHOTO GRID */}
      <div className="ms-photos">
        <div className="ms-pg-item ms-tall">
          <img src="/shift/chinatown.jpg" alt="" />
        </div>
        <div className="ms-pg-item">
          <img src="/shift/nyc-crosswalk.png" alt="" />
        </div>
        <div className="ms-pg-item">
          <img src="/shift/car-meet.png" alt="" />
        </div>
        <div className="ms-pg-item">
          <img src="/shift/coffee-shop.png" alt="" />
        </div>
        <div className="ms-pg-item ms-tall">
          <img src="/shift/subway.png" alt="" />
        </div>
        <div className="ms-pg-item">
          <img src="/shift/pool-party.png" alt="" />
        </div>
      </div>

      {/* SPREAD — Racing */}
      <div className="ms-spread ms-spread-rev">
        <div className="ms-spread-text">
          <div className="ms-spread-label">Limited Edition</div>
          <h2 className="ms-spread-title"><span className="ms-glitch" data-text="Racing Collection">Racing Collection</span></h2>
          <p className="ms-spread-body">Vintage acid wash. All-over racing graphics. "Built for Speed. No Limits." — a capsule for those who live in the fast lane.</p>
          <div className="ms-spread-link">Shop Racing &rarr;</div>
        </div>
        <div className="ms-spread-img">
          <img src="/shift/car-meet.png" alt="" />
        </div>
      </div>

      {/* SPREAD — New Colorways */}
      <div className="ms-spread">
        <div className="ms-spread-img">
          <img src="/shift/convertible-pink-red.png" alt="" />
        </div>
        <div className="ms-spread-text">
          <div className="ms-spread-label">New Drops</div>
          <h2 className="ms-spread-title"><span className="ms-glitch" data-text="Fresh Colorways">Fresh Colorways</span></h2>
          <p className="ms-spread-body">Pink Collection and Olive & Orange. New energy, same heavyweight quality. Limited quantities.</p>
          <div className="ms-spread-link">Shop New Arrivals &rarr;</div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="ms-newsletter">
        <div className="ms-newsletter-label">Stay Locked In</div>
        <div className="ms-newsletter-title"><span className="ms-glitch" data-text="Join the Movement">Join the Movement</span></div>
        <div className="ms-newsletter-sub">Early access to drops, exclusive colorways, and first dibs on limited editions.</div>
        <div className="ms-newsletter-form">
          <div className="ms-newsletter-input">Your email</div>
          <div className="ms-newsletter-btn">Subscribe</div>
        </div>
      </div>
    </div>
  );
}
