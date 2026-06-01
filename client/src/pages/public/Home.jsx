// import { useEffect, useState } from 'react'
// import { Header } from './Header'
// import { Link } from 'react-router-dom'
// import { ArrowRight, CalendarDays, ShieldCheck, Star, Wrench } from 'lucide-react'
// import { api, resolveMediaUrl } from '@/services/api'
// import Footer from './Footer'

// const Home = () => {
//   const [topServices, setTopServices] = useState([])
//   const [servicesLoading, setServicesLoading] = useState(true)

//   useEffect(() => {
//     loadTopServices()
//   }, [])

//   const loadTopServices = async () => {
//     setServicesLoading(true)
//     try {
//       const data = await api.helper.helperServiceList()
//       const offerings = Array.isArray(data) ? data : data?.results || []
//       const available = offerings.filter((item) => item.is_available)
//       setTopServices(available.slice(0, 6))
//     } catch {
//       setTopServices([])
//     } finally {
//       setServicesLoading(false)
//     }
//   }

//   const highlights = [
//     {
//       icon: Wrench,
//       title: 'Skilled Service Providers',
//       description: 'Find trusted professionals for electrical, plumbing, cleaning, repairs and more.',
//     },
//     {
//       icon: CalendarDays,
//       title: 'Simple Booking Flow',
//       description: 'Book services with date and time selection in just a few clicks.',
//     },
//     {
//       icon: ShieldCheck,
//       title: 'Secure & Verified',
//       description: 'Service providers, bookings, and reviews are tracked for trust and transparency.',
//     },
//   ]

//   return (
//     <>
//       <Header />

//       <main className="bg-slate-50">
//         <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pt-18">
//           <div className="space-y-6">
//             <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
//               <Star className="h-3.5 w-3.5" />
//               Trusted Local Marketplace
//             </p>

//             <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
//               Book the right service provider for every job
//             </h1>

//             <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
//               FixNow connects customers with verified service providers. Discover services, book instantly, track progress, and review completed work.
//             </p>

//             <div className="flex flex-wrap items-center gap-3">
//               <Link
//                 to="/services"
//                 className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
//               >
//                 Explore Services
//                 <ArrowRight className="h-4 w-4" />
//               </Link>
//               <Link
//                 to="/register"
//                 className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
//               >
//                 Join FixNow
//               </Link>
//             </div>
//           </div>

//           <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="mb-4 flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-slate-900">Platform Highlights</h2>
//               <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                 Live
//               </span>
//             </div>

//             <div className="space-y-4">
//               {highlights.map((item) => {
//                 const Icon = item.icon
//                 return (
//                   <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                     <div className="flex items-start gap-3">
//                       <div className="rounded-xl bg-white p-2 ring-1 ring-slate-200">
//                         <Icon className="h-5 w-5 text-slate-800" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-slate-900">{item.title}</h3>
//                         <p className="mt-1 text-sm text-slate-600">{item.description}</p>
//                       </div>
//                     </div>
//                   </article>
//                 )
//               })}
//             </div>
//           </div>
//         </section>

//         <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
//           <div className="mb-6 flex items-center justify-between gap-4">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Top Services</p>
//               <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Popular services you can book now</h2>
//             </div>
//             <Link to="/services" className="text-sm font-semibold text-slate-900 hover:text-slate-700">
//               View all
//             </Link>
//           </div>

//           {servicesLoading ? (
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {[1, 2, 3].map((item) => (
//                 <div key={item} className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white" />
//               ))}
//             </div>
//           ) : topServices.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
//               No services available yet.
//             </div>
//           ) : (
//             <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//               {topServices.map((service) => (
//                 <article key={service.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//                   {service.service?.image ? (
//                     <img
//                       src={resolveMediaUrl(service.service.image)}
//                       alt={service.service?.name || 'Service'}
//                       className="h-40 w-full object-cover"
//                     />
//                   ) : (
//                     <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-slate-500">
//                       No image
//                     </div>
//                   )}
//                   <div className="p-4">
//                     <h3 className="text-lg font-semibold text-slate-900">{service.service?.name || 'Service'}</h3>
//                     <p className="mt-1 line-clamp-2 text-sm text-slate-600">
//                       {service.service?.description || 'Professional service offering.'}
//                     </p>
//                     <div className="mt-3 flex items-center justify-between text-sm">
//                       <span className="font-semibold text-slate-900">PKR {service.price}</span>
//                       <span className="text-slate-600">{service.provider_name || service.provider_email || `#${service.user}`}</span>
//                     </div>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           )}
//         </section>
//       </main>

//       <Footer />
//     </>
//   )
// }

// export { Home }
// export default Home




import { useEffect, useState } from 'react'
import { Header } from './Header'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, ShieldCheck, Star, Wrench } from 'lucide-react'
import { api, resolveMediaUrl } from '@/services/api'
import Footer from './Footer'

const Home = () => {
  const [topServices, setTopServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)

  useEffect(() => {
    loadTopServices()
  }, [])

  const loadTopServices = async () => {
    setServicesLoading(true)
    try {
      const data = await api.helper.helperServiceList()
      const offerings = Array.isArray(data) ? data : data?.results || []
      const available = offerings.filter((item) => item.is_available)
      setTopServices(available.slice(0, 6))
    } catch {
      setTopServices([])
    } finally {
      setServicesLoading(false)
    }
  }

  const highlights = [
    {
      icon: Wrench,
      title: 'Skilled Service Providers',
      description: 'Find trusted professionals for electrical, plumbing, cleaning, repairs and more.',
    },
    {
      icon: CalendarDays,
      title: 'Simple Booking Flow',
      description: 'Book services with date and time selection in just a few clicks.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Verified',
      description: 'Service providers, bookings, and reviews are tracked for trust and transparency.',
    },
  ]

  const styles = {
    main: {
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(59,130,246,0.06) 0%, transparent 50%), linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f0f9ff 100%)',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    },
    decorativeBlob1: {
      position: 'fixed',
      top: '-8%',
      left: '-4%',
      width: 440,
      height: 440,
      borderRadius: '50%',
      background: 'rgba(99,102,241,0.1)',
      filter: 'blur(72px)',
      pointerEvents: 'none',
      zIndex: 0,
    },
    decorativeBlob2: {
      position: 'fixed',
      bottom: '-12%',
      right: '-6%',
      width: 520,
      height: 520,
      borderRadius: '50%',
      background: 'rgba(59,130,246,0.08)',
      filter: 'blur(80px)',
      pointerEvents: 'none',
      zIndex: 0,
    },
    heroSection: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '1280px',
      margin: '0 auto',
      padding: 'clamp(2rem, 5vw, 3rem)',
    },
    heroGrid: {
      display: 'grid',
      gap: 'clamp(2rem, 4vw, 3rem)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      alignItems: 'center',
    },
    leftColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '50px',
      background: 'rgba(99,102,241,0.09)',
      border: '1px solid rgba(99,102,241,0.2)',
      fontSize: '11px',
      fontWeight: 600,
      color: '#6366f1',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      width: 'fit-content',
    },
    title: {
      fontFamily: "'Fraunces', serif",
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 700,
      color: '#0f172a',
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
      margin: 0,
    },
    description: {
      fontSize: 'clamp(0.95rem, 2vw, 1.125rem)',
      lineHeight: 1.6,
      color: '#64748b',
      maxWidth: '540px',
      margin: 0,
    },
    buttonGroup: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center',
    },
    primaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '50px',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'transform 0.15s, box-shadow 0.2s',
      boxShadow: '0 4px 12px rgba(15,23,42,0.15)',
    },
    secondaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: '#fff',
      color: '#1e293b',
      border: '1.5px solid #e2e8f0',
      borderRadius: '50px',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.15s',
    },
    rightColumn: {
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1.5px solid rgba(255,255,255,0.9)',
      padding: 'clamp(1.5rem, 4vw, 2rem)',
      boxShadow: '0 20px 40px rgba(15,23,42,0.08)',
    },
    rightHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid #e2e8f0',
    },
    rightTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#0f172a',
      margin: 0,
    },
    liveBadge: {
      background: '#10b981',
      color: '#fff',
      padding: '0.25rem 0.75rem',
      borderRadius: '50px',
      fontSize: '0.75rem',
      fontWeight: 600,
    },
    highlightCard: {
      background: '#fff',
      borderRadius: '16px',
      padding: '1rem',
      marginBottom: '1rem',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.15s, box-shadow 0.15s',
    },
    highlightIconWrapper: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '12px',
      padding: '0.5rem',
      width: 'fit-content',
      marginBottom: '0.75rem',
    },
    highlightTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#0f172a',
      margin: '0 0 0.25rem 0',
    },
    highlightDesc: {
      fontSize: '0.875rem',
      color: '#64748b',
      lineHeight: 1.5,
      margin: 0,
    },
    servicesSection: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '1280px',
      margin: '0 auto',
      padding: 'clamp(1.5rem, 4vw, 2rem)',
      paddingTop: 'clamp(1rem, 3vw, 2rem)',
    },
    servicesHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '2rem',
    },
    servicesBadge: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#6366f1',
      marginBottom: '0.5rem',
    },
    servicesTitle: {
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: 700,
      color: '#0f172a',
      letterSpacing: '-0.02em',
      margin: 0,
    },
    viewAllLink: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#6366f1',
      textDecoration: 'none',
      padding: '0.5rem 0',
    },
    servicesGrid: {
      display: 'grid',
      gap: '1.5rem',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    },
    serviceCard: {
      background: '#fff',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.15s, box-shadow 0.15s',
    },
    serviceImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
    },
    serviceImagePlaceholder: {
      width: '100%',
      height: '200px',
      background: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      fontSize: '0.875rem',
    },
    serviceContent: {
      padding: '1.25rem',
    },
    serviceTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#0f172a',
      margin: '0 0 0.5rem 0',
    },
    serviceDescription: {
      fontSize: '0.875rem',
      color: '#64748b',
      lineHeight: 1.5,
      margin: '0 0 1rem 0',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    serviceFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.875rem',
    },
    servicePrice: {
      fontWeight: 700,
      color: '#6366f1',
    },
    serviceProvider: {
      color: '#94a3b8',
    },
    loadingCard: {
      height: '350px',
      background: '#fff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      animation: 'pulse 1.5s ease-in-out infinite',
    },
    emptyState: {
      background: '#fff',
      borderRadius: '16px',
      padding: '3rem',
      textAlign: 'center',
      border: '1px dashed #cbd5e1',
      color: '#64748b',
    },
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .ln-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .ln-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
        }
        
        .ln-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2);
        }
        
        .ln-btn-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }
        
        .ln-highlight-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.1);
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .ln-fade-up {
          animation: fadeUp 0.6s ease both;
        }
        .ln-fade-up-delay-1 { animation-delay: 0.1s; }
        .ln-fade-up-delay-2 { animation-delay: 0.2s; }
        .ln-fade-up-delay-3 { animation-delay: 0.3s; }
      `}</style>

      <Header />

      <main style={styles.main}>
        {/* Decorative blobs */}
        <div style={styles.decorativeBlob1} />
        <div style={styles.decorativeBlob2} />

        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.heroGrid}>
            <div style={styles.leftColumn} className="ln-fade-up">
              <div style={styles.badge}>
                <Star size={14} />
                Trusted Local Marketplace
              </div>

              <h1 style={styles.title}>
                Book the right service provider for every job
              </h1>

              <p style={styles.description}>
                FixNow connects customers with verified service providers. Discover services, book instantly, track progress, and review completed work.
              </p>

              <div style={styles.buttonGroup}>
                <Link
                  to="/services"
                  style={styles.primaryButton}
                  className="ln-btn-primary"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                  }}
                >
                  Explore Services
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/register"
                  style={styles.secondaryButton}
                  className="ln-btn-secondary"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc'
                    e.currentTarget.style.borderColor = '#cbd5e1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff'
                    e.currentTarget.style.borderColor = '#e2e8f0'
                  }}
                >
                  Join FixNow
                </Link>
              </div>
            </div>

            <div style={styles.rightColumn} className="ln-fade-up ln-fade-up-delay-1">
              <div style={styles.rightHeader}>
                <h2 style={styles.rightTitle}>Platform Highlights</h2>
                <span style={styles.liveBadge}>Live</span>
              </div>

              <div>
                {highlights.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.title}
                      style={styles.highlightCard}
                      className="ln-highlight-card"
                    >
                      <div style={styles.highlightIconWrapper}>
                        <Icon size={20} color="#6366f1" />
                      </div>
                      <h3 style={styles.highlightTitle}>{item.title}</h3>
                      <p style={styles.highlightDesc}>{item.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div style={styles.servicesSection}>
          <div style={styles.servicesHeader} className="ln-fade-up ln-fade-up-delay-2">
            <div>
              <div style={styles.servicesBadge}>Top Services</div>
              <h2 style={styles.servicesTitle}>Popular services you can book now</h2>
            </div>
            <Link to="/services" style={styles.viewAllLink}>
              View all →
            </Link>
          </div>

          {servicesLoading ? (
            <div style={styles.servicesGrid}>
              {[1, 2, 3].map((item) => (
                <div key={item} style={styles.loadingCard} className="ln-pulse" />
              ))}
            </div>
          ) : topServices.length === 0 ? (
            <div style={styles.emptyState}>
              No services available yet.
            </div>
          ) : (
            <div style={styles.servicesGrid}>
              {topServices.map((service, index) => (
                <div
                  key={service.id}
                  style={styles.serviceCard}
                  className={`ln-card-hover ln-fade-up ln-fade-up-delay-${index % 3 === 0 ? '1' : index % 3 === 1 ? '2' : '3'}`}
                >
                  {service.service?.image ? (
                    <img
                      src={resolveMediaUrl(service.service.image)}
                      alt={service.service?.name || 'Service'}
                      style={styles.serviceImage}
                    />
                  ) : (
                    <div style={styles.serviceImagePlaceholder}>
                      No image
                    </div>
                  )}
                  <div style={styles.serviceContent}>
                    <h3 style={styles.serviceTitle}>{service.service?.name || 'Service'}</h3>
                    <p style={styles.serviceDescription}>
                      {service.service?.description || 'Professional service offering.'}
                    </p>
                    <div style={styles.serviceFooter}>
                      <span style={styles.servicePrice}>PKR {service.price}</span>
                      <span style={styles.serviceProvider}>
                        {service.provider_name || service.provider_email || `#${service.user}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export { Home }
export default Home