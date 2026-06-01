// import { Link } from 'react-router-dom'

// const Footer = () => {
// 	const year = new Date().getFullYear()

// 	return (
// 		<footer className="border-t border-slate-200 bg-white">
// 			<div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
// 				<div>
// 					<h3 className="text-lg font-semibold text-slate-900">FixNow</h3>
// 					<p className="mt-2 text-sm leading-6 text-slate-600">
// 						Connect with trusted service providers, manage bookings, and review completed work.
// 					</p>
// 				</div>

// 				<div>
// 					<h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Explore</h4>
// 					<ul className="mt-3 space-y-2 text-sm text-slate-700">
// 						<li><Link className="transition hover:text-slate-950" to="/">Home</Link></li>
// 						<li><Link className="transition hover:text-slate-950" to="/services">Services</Link></li>
// 						<li><Link className="transition hover:text-slate-950" to="/aboutus">About Us</Link></li>
// 						<li><Link className="transition hover:text-slate-950" to="/contactus">Contact Us</Link></li>
// 					</ul>
// 				</div>

// 				<div>
// 					<h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Contact</h4>
// 					<ul className="mt-3 space-y-2 text-sm text-slate-700">
// 						<li>support@fixnow.com</li>
// 						<li>+1 (555) 123-4567</li>
// 						<li>123 Service Street, Tech City</li>
// 					</ul>
// 				</div>
// 			</div>

// 			<div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
// 				© {year} FixNow. All rights reserved.
// 			</div>
// 		</footer>
// 	)
// }

// export default Footer



import { Link } from 'react-router-dom'
import { Wrench, Mail, Phone, MapPin, Home, Settings, Users, MessageSquare } from 'lucide-react'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: '#0f172a',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        .ft-nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: rgba(248,250,252,0.55);
          text-decoration: none;
          padding: 5px 0;
          transition: color 0.2s, padding-left 0.2s;
        }
        .ft-nav-link:hover {
          color: #a5b4fc;
          padding-left: 4px;
        }
        .ft-nav-link svg {
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .ft-nav-link:hover svg { color: #6366f1; }

        .ft-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: rgba(248,250,252,0.55);
          padding: 5px 0;
          line-height: 1.5;
        }
        .ft-contact-item svg { flex-shrink: 0; margin-top: 1px; color: #6366f1; }

        .ft-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6366f1;
          margin: 0 0 14px;
        }

        .ft-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 0;
        }

        .ft-bottom-link {
          font-size: 13px;
          color: rgba(248,250,252,0.35);
          text-decoration: none;
          transition: color 0.2s;
        }
        .ft-bottom-link:hover { color: #a5b4fc; }
      `}</style>

      {/* Ambient glow — matches header/login panels */}
      <div style={{
        position: 'absolute', top: 0, left: '-10%',
        width: 480, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, right: '-8%',
        width: 380, height: 220, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)',
      }} />

      {/* Main footer content */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto',
        padding: '3rem 1.5rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2.5rem',
      }}>

        {/* Brand column */}
        <div style={{ gridColumn: 'span 1' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99,102,241,0.45)',
              flexShrink: 0,
            }}>
              <Wrench style={{ width: 17, height: 17, color: '#fff' }} />
            </div>
            <span style={{
              fontSize: 18, fontWeight: 700,
              color: '#f8fafc', letterSpacing: '-0.02em',
            }}>
              FixNow
            </span>
          </div>

          <p style={{
            fontSize: 14, lineHeight: 1.75,
            color: 'rgba(248,250,252,0.48)',
            margin: '0 0 20px', maxWidth: 260,
          }}>
            Connect with trusted service providers, manage bookings, and review completed work — all in one place.
          </p>

          {/* Subtle badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 50,
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.25)',
            fontSize: 11, fontWeight: 600, color: '#a5b4fc',
            letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 6px rgba(74,222,128,0.8)',
              display: 'inline-block',
            }} />
            All systems operational
          </div>
        </div>

        {/* Explore column */}
        <div>
          <p className="ft-section-label">Explore</p>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            <Link className="ft-nav-link" to="/">
              <Home style={{ width: 14, height: 14 }} /> Home
            </Link>
            <Link className="ft-nav-link" to="/services">
              <Settings style={{ width: 14, height: 14 }} /> Services
            </Link>
            <Link className="ft-nav-link" to="/aboutus">
              <Users style={{ width: 14, height: 14 }} /> About Us
            </Link>
            <Link className="ft-nav-link" to="/contactus">
              <MessageSquare style={{ width: 14, height: 14 }} /> Contact Us
            </Link>
          </nav>
        </div>

        {/* Contact column */}
        <div>
          <p className="ft-section-label">Contact</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="ft-contact-item">
              <Mail style={{ width: 15, height: 15 }} />
              <span>support@fixnow.com</span>
            </div>
            <div className="ft-contact-item">
              <Phone style={{ width: 15, height: 15 }} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="ft-contact-item">
              <MapPin style={{ width: 15, height: 15 }} />
              <span>123 Service Street,<br />Tech City</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <hr className="ft-divider" />
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(248,250,252,0.3)' }}>
          © {year} FixNow. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <a href="#" className="ft-bottom-link">Privacy Policy</a>
          <a href="#" className="ft-bottom-link">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer