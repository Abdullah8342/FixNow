// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
// import { API_ENDPOINTS, buildApiUrl } from '../../services/api'
// import { useToast } from '../../context/ToastContext'

// const initialFormState = {
//   first_name: '',
//   last_name: '',
//   email: '',
//   roll: 'SA',
//   password: '',
//   confirm_password: '',
// }

// const Register = () => {
//   const navigate = useNavigate()
//   const { addToast } = useToast()
//   const [formData, setFormData] = useState(initialFormState)
//   const [loading, setLoading] = useState(false)

//   const handleChange = (event) => {
//     const { name, value } = event.target
//     setFormData((currentValues) => ({
//       ...currentValues,
//       [name]: value,
//     }))
//   }

//   const extractErrorMessage = async (response) => {
//     try {
//       const data = await response.json()

//       if (typeof data === 'string') {
//         return data
//       }

//       const message =
//         data?.detail ||
//         data?.message ||
//         data?.error ||
//         data?.non_field_errors?.[0] ||
//         Object.values(data || {})
//           .flat()
//           .filter(Boolean)
//           .join(' ')

//       return message || 'Registration failed. Please try again.'
//     } catch {
//       return 'Registration failed. Please try again.'
//     }
//   }

//   const handleSubmit = async (event) => {
//     event.preventDefault()

//     if (formData.password !== formData.confirm_password) {
//       addToast('Password and confirm password must match.', 'error')
//       return
//     }

//     setLoading(true)

//     try {
//       const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.register), {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) {
//         throw new Error(await extractErrorMessage(response))
//       }

//       addToast('Account created successfully. You can log in now.', 'success')
//       setFormData(initialFormState)
//       setTimeout(() => {
//         navigate('/login')
//       }, 1200)
//     } catch (submitError) {
//       addToast(submitError.message || 'Something went wrong. Please try again.', 'error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.16),transparent_38%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_48%,#fdf2f8_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
//       <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-4xl bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.14)] ring-1 ring-white/70 backdrop-blur xl:grid-cols-[1.1fr_0.9fr]">
//         <section className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-10 lg:px-12">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.28),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.24),transparent_30%)]" />
//           <div className="relative z-10 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.32em] text-amber-300">
//             <Sparkles className="h-4 w-4" />
//             FixNow
//           </div>

//           <div className="relative z-10 max-w-xl space-y-6">
//             <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
//               Create your account and start booking trusted service support.
//             </p>
//             <div className="space-y-4">
//               <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
//                 Join the platform built for fast service requests.
//               </h1>
//               <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
//                 Register once, manage your profile, and connect with the right help without friction.
//               </p>
//             </div>
//           </div>

//           <div className="relative z-10 grid gap-4 border-t border-white/10 pt-6 text-sm text-slate-300 sm:grid-cols-2">
//             <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//               <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
//               Quick signup flow with direct backend integration.
//             </div>
//             <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//               <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
//               Prepare your account for login and profile setup.
//             </div>
//           </div>
//         </section>

//         <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
//           <div className="w-full max-w-lg">
//             <div className="mb-8 space-y-2">
//               <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">
//                 Get started
//               </p>
//               <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
//                 Create your account
//               </h2>
//               <p className="text-sm leading-6 text-slate-600">
//                 Fill in your details below and we will send the request to the backend signup API.
//               </p>
//             </div>

//             <form className="space-y-5" onSubmit={handleSubmit}>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <label className="space-y-2 text-sm font-medium text-slate-700">
//                   <span>First name</span>
//                   <input
//                     type="text"
//                     name="first_name"
//                     value={formData.first_name}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
//                     placeholder="Hamza"
//                   />
//                 </label>

//                 <label className="space-y-2 text-sm font-medium text-slate-700">
//                   <span>Last name</span>
//                   <input
//                     type="text"
//                     name="last_name"
//                     value={formData.last_name}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
//                     placeholder="Khan"
//                   />
//                 </label>
//               </div>

//               <label className="space-y-2 text-sm font-medium text-slate-700">
//                 <span>Email address</span>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
//                   placeholder="you@example.com"
//                 />
//               </label>

//               <label className="space-y-2 text-sm font-medium text-slate-700">
//                 <span>Account type</span>
//                 <select
//                   name="roll"
//                   value={formData.roll}
//                   onChange={handleChange}
//                   className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
//                 >
//                   <option value="SA">Service Acquirer</option>
//                   <option value="SP">Service Provider</option>
//                 </select>
//               </label>

//               <div className="grid gap-4 sm:grid-cols-2">
//                 <label className="space-y-2 text-sm font-medium text-slate-700">
//                   <span>Password</span>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     minLength={8}
//                     className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
//                     placeholder="••••••••"
//                   />
//                 </label>

//                 <label className="space-y-2 text-sm font-medium text-slate-700">
//                   <span>Confirm password</span>
//                   <input
//                     type="password"
//                     name="confirm_password"
//                     value={formData.confirm_password}
//                     onChange={handleChange}
//                     required
//                     minLength={8}
//                     className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
//                     placeholder="••••••••"
//                   />
//                 </label>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
//               >
//                 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
//                 {loading ? 'Creating account...' : 'Create account'}
//                 {!loading ? <ArrowRight className="h-4 w-4" /> : null}
//               </button>
//             </form>

//             <p className="mt-6 text-center text-sm text-slate-600">
//               Already have an account?{' '}
//               <Link to="/login" className="font-semibold text-slate-950 underline-offset-4 hover:underline">
//                 Log in
//               </Link>
//             </p>
//           </div>
//         </section>
//       </div>
//     </main>
//   )
// }

// export default Register









import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Loader2, Sparkles, Eye, EyeOff, Wrench } from 'lucide-react'
import { API_ENDPOINTS, buildApiUrl } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const initialFormState = {
  first_name: '',
  last_name: '',
  email: '',
  roll: 'SA',
  password: '',
  confirm_password: '',
}

const Register = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [formData, setFormData] = useState(initialFormState)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const extractErrorMessage = async (response) => {
    try {
      const data = await response.json()
      if (typeof data === 'string') return data
      const message =
        data?.detail ||
        data?.message ||
        data?.error ||
        data?.non_field_errors?.[0] ||
        Object.values(data || {}).flat().filter(Boolean).join(' ')
      return message || 'Registration failed. Please try again.'
    } catch {
      return 'Registration failed. Please try again.'
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (formData.password !== formData.confirm_password) {
      addToast('Password and confirm password must match.', 'error')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.register), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error(await extractErrorMessage(response))
      addToast('Account created successfully. You can log in now.', 'success')
      setFormData(initialFormState)
      setTimeout(() => navigate('/login'), 1200)
    } catch (submitError) {
      addToast(submitError.message || 'Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(59,130,246,0.08) 0%, transparent 50%), linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f0f9ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .rg-input {
          width: 100%;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          color: #0f172a;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .rg-input::placeholder { color: #94a3b8; }
        .rg-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .rg-select {
          width: 100%;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          color: #0f172a;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
        }
        .rg-select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .rg-input-wrap { position: relative; display: flex; align-items: center; }
        .rg-input-wrap .rg-input { padding-right: 44px; }
        .rg-eye-btn {
          position: absolute; right: 12px;
          background: none; border: none; cursor: pointer;
          color: #94a3b8; display: flex; align-items: center;
          padding: 4px; border-radius: 6px;
          transition: color 0.2s, background 0.2s; line-height: 0;
        }
        .rg-eye-btn:hover { color: #6366f1; background: rgba(99,102,241,0.08); }

        .rg-submit {
          width: 100%;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #fff; border: none; border-radius: 12px;
          padding: 13px 24px; font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(15,23,42,0.18);
          letter-spacing: 0.01em;
        }
        .rg-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(15,23,42,0.24);
        }
        .rg-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .rg-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 50px;
          background: rgba(99,102,241,0.09);
          border: 1px solid rgba(99,102,241,0.2);
          font-size: 11px; font-weight: 600; color: #6366f1;
          letter-spacing: 0.08em; text-transform: uppercase; width: fit-content;
        }

        .rg-login-link {
          color: #0f172a; font-weight: 600; text-decoration: none;
          border-bottom: 1.5px solid #6366f1; padding-bottom: 1px;
          transition: color 0.2s;
        }
        .rg-login-link:hover { color: #6366f1; }

        @keyframes rg-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rg-a1 { animation: rg-fade-up 0.55s ease both; }
        .rg-a2 { animation: rg-fade-up 0.55s 0.07s ease both; }
        .rg-a3 { animation: rg-fade-up 0.55s 0.14s ease both; }
        .rg-a4 { animation: rg-fade-up 0.55s 0.21s ease both; }
        .rg-a5 { animation: rg-fade-up 0.55s 0.28s ease both; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .rg-spin { animation: spin 1s linear infinite; }

        /* Two-col grid for name + password pairs */
        .rg-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 480px) {
          .rg-2col { grid-template-columns: 1fr; }
        }

        /* Card grid: side-by-side on ≥768px, stacked below */
        .rg-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .rg-card { grid-template-columns: 1fr; }
          .rg-left-panel { display: none; }
        }

        /* Right panel padding: compact on mobile */
        .rg-right-panel {
          padding: 2.5rem 2.5rem;
        }
        @media (max-width: 640px) {
          .rg-right-panel { padding: 1.5rem 1.25rem; }
        }

        /* Left panel padding */
        .rg-left-panel {
          padding: 1rem;
        }
      `}</style>

      {/* Blobs */}
      <div style={{
        position: 'fixed', top: '-8%', left: '-4%',
        width: 440, height: 440, borderRadius: '50%',
        background: 'rgba(99,102,241,0.13)',
        filter: 'blur(72px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-12%', right: '-6%',
        width: 520, height: 520, borderRadius: '50%',
        background: 'rgba(59,130,246,0.11)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Card */}
      <div
        className="rg-card"
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: '1060px',
          background: 'rgba(255,255,255,0.8)',
          border: '1.5px solid rgba(255,255,255,0.95)',
          borderRadius: '28px', overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 32px 80px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        {/* ── LEFT PANEL ── */}
        <section
          className="rg-left-panel"
          style={{
            background: 'linear-gradient(150deg, #1e293b 0%, #0f172a 60%, #1a2744 100%)',
            display: 'flex', flexDirection: 'column',
            gap: '2rem', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.25) 0%, transparent 55%), radial-gradient(ellipse at 90% 90%, rgba(59,130,246,0.2) 0%, transparent 55%)',
          }} />

          {/* Logo */}
          <div className="rg-a1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(99,102,241,0.5)',
            }}>
              <Wrench style={{ width: 18, height: 18, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>FixNow</span>
          </div>

          {/* Hero copy */}
          <div className="rg-a2" style={{
            position: 'relative', flex: 1,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', gap: '1.1rem',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 50,
              background: 'rgba(99,102,241,0.18)',
              border: '1px solid rgba(99,102,241,0.35)',
              fontSize: 11, fontWeight: 600, color: '#a5b4fc',
              letterSpacing: '0.08em', textTransform: 'uppercase', width: 'fit-content',
            }}>
              <Sparkles style={{ width: 11, height: 11 }} />
              Create your account
            </div>

            <h1 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(1.7rem, 2.8vw, 2.5rem)',
              fontWeight: 600, color: '#f8fafc',
              lineHeight: 1.2, letterSpacing: '-0.03em', margin: 0,
            }}>
              Join the platform built for fast service requests.
            </h1>

            <p style={{
              fontSize: 15, lineHeight: 1.75,
              color: 'rgba(248,250,252,0.48)',
              margin: 0, maxWidth: 340,
            }}>
              Register once, manage your profile, and connect with the right help without friction.
            </p>
          </div>

          {/* Feature cards */}
          <div className="rg-a3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { title: 'Quick Signup', desc: 'Direct backend integration for instant account creation.' },
              { title: 'Ready to Go', desc: 'Log in and set up your profile right after registering.' },
            ].map((f) => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: '13px 15px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <CheckCircle2 style={{ width: 17, height: 17, color: '#4ade80', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>{f.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(248,250,252,0.42)', lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RIGHT PANEL ── */}
        <section
          className="rg-right-panel"
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            background: 'rgba(255,255,255,0.55)',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div className="rg-a2" style={{ marginBottom: '1.5rem' }}>
            <div className="rg-pill" style={{ marginBottom: 10 }}>
              <Sparkles style={{ width: 11, height: 11 }} />
              Get started
            </div>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(1.5rem, 2.2vw, 1.9rem)',
              fontWeight: 600, color: '#0f172a',
              letterSpacing: '-0.025em', margin: '0 0 6px', lineHeight: 1.2,
            }}>
              Create your account
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
              Fill in your details below to register your FixNow profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Name row */}
            <div className="rg-a3 rg-2col">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>First name</label>
                <input
                  className="rg-input" type="text" name="first_name"
                  value={formData.first_name} onChange={handleChange}
                  required placeholder="Hamza"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Last name</label>
                <input
                  className="rg-input" type="text" name="last_name"
                  value={formData.last_name} onChange={handleChange}
                  required placeholder="Khan"
                />
              </div>
            </div>

            {/* Email */}
            <div className="rg-a3" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Email address</label>
              <input
                className="rg-input" type="email" name="email"
                value={formData.email} onChange={handleChange}
                required placeholder="you@example.com"
              />
            </div>

            {/* Account type */}
            <div className="rg-a3" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Account type</label>
              <select className="rg-select" name="roll" value={formData.roll} onChange={handleChange}>
                <option value="SA">Service Acquirer</option>
                <option value="SP">Service Provider</option>
              </select>
            </div>

            {/* Password row */}
            <div className="rg-a4 rg-2col">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Password</label>
                <div className="rg-input-wrap">
                  <input
                    className="rg-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password" value={formData.password}
                    onChange={handleChange} required minLength={8}
                    placeholder="••••••••"
                  />
                  <button type="button" className="rg-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Confirm password</label>
                <div className="rg-input-wrap">
                  <input
                    className="rg-input"
                    type={showConfirm ? 'text' : 'password'}
                    name="confirm_password" value={formData.confirm_password}
                    onChange={handleChange} required minLength={8}
                    placeholder="••••••••"
                  />
                  <button type="button" className="rg-eye-btn"
                    onClick={() => setShowConfirm(v => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                    {showConfirm ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="rg-a5" style={{ marginTop: '0.25rem' }}>
              <button type="submit" disabled={loading} className="rg-submit">
                {loading
                  ? <><Loader2 style={{ width: 16, height: 16 }} className="rg-spin" /> Creating account…</>
                  : <>Create account <ArrowRight style={{ width: 16, height: 16 }} /></>
                }
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="rg-a5" style={{
            margin: '1.5rem 0 1rem',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>Already registered?</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <p className="rg-a5" style={{ textAlign: 'center', fontSize: 14, color: '#64748b', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" className="rg-login-link">Log in</Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default Register