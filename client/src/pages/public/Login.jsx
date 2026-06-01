// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
// import { API_ENDPOINTS, buildApiUrl } from '../../services/api'
// import { useToast } from '../../context/ToastContext'
// import { useAuth } from '../../context/AuthContext'

// const initialFormState = {
//   email: '',
//   password: '',
// }

// export const Login = () => {
//   const navigate = useNavigate()
//   const { addToast } = useToast()
//   const { setTokens } = useAuth()
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

//       return message || 'Login failed. Please try again.'
//     } catch {
//       return 'Login failed. Please try again.'
//     }
//   }

//   const handleSubmit = async (event) => {
//     event.preventDefault()
//     setLoading(true)

//     try {
//       const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.login), {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) {
//         throw new Error(await extractErrorMessage(response))
//       }

//       const data = await response.json()
//       const { access, refresh } = data

//       // Update AuthContext which will also store in localStorage
//       setTokens(access, refresh)

//       addToast('Login successful!', 'success')
//       setFormData(initialFormState)

//       // Redirect to profile after a short delay
//       setTimeout(() => {
//         navigate('/')
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
//               Access your account and manage bookings.
//             </p>
//             <div className="space-y-4">
//               <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
//                 Welcome back to your service hub.
//               </h1>
//               <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
//                 Sign in to view your profile, manage service requests, and track your bookings effortlessly.
//               </p>
//             </div>
//           </div>

//           <div className="relative z-10 grid gap-4 border-t border-white/10 pt-6 text-sm text-slate-300 sm:grid-cols-2">
//             <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//               <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
//               Quick login with your email and password.
//             </div>
//             <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//               <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
//               Secure token-based authentication.
//             </div>
//           </div>
//         </section>

//         <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
//           <div className="w-full max-w-lg">
//             <div className="mb-8 space-y-2">
//               <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">
//                 Welcome back
//               </p>
//               <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
//                 Sign in to your account
//               </h2>
//               <p className="text-sm leading-6 text-slate-600">
//                 Enter your credentials to access your FixNow profile.
//               </p>
//             </div>

//             <form className="space-y-5" onSubmit={handleSubmit}>
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
//                 <span>Password</span>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
//                   placeholder="••••••••"
//                 />
//               </label>

//               <div className="flex items-center justify-between">
//                 <label className="inline-flex items-center gap-2 text-sm text-slate-600">
//                   <input
//                     type="checkbox"
//                     className="rounded border-slate-200"
//                     defaultChecked={false}
//                   />
//                   Remember me
//                 </label>
//                 <Link
//                   to="/forgot-password"
//                   className="text-sm font-semibold text-slate-950 underline-offset-4 hover:underline"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
//               >
//                 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
//                 {loading ? 'Signing in...' : 'Sign in'}
//                 {!loading ? <ArrowRight className="h-4 w-4" /> : null}
//               </button>
//             </form>

//             <p className="mt-6 text-center text-sm text-slate-600">
//               Don't have an account?{' '}
//               <Link
//                 to="/register"
//                 className="font-semibold text-slate-950 underline-offset-4 hover:underline"
//               >
//                 Create one
//               </Link>
//             </p>
//           </div>
//         </section>
//       </div>
//     </main>
//   )
// }


import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Sparkles, CheckCircle2, Eye, EyeOff, Wrench } from 'lucide-react'
import { API_ENDPOINTS, buildApiUrl } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'

const initialFormState = {
  email: '',
  password: '',
}

export const Login = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { setTokens } = useAuth()
  const [formData, setFormData] = useState(initialFormState)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
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
      return message || 'Login failed. Please try again.'
    } catch {
      return 'Login failed. Please try again.'
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.login), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error(await extractErrorMessage(response))
      const data = await response.json()
      const { access, refresh } = data
      setTokens(access, refresh)
      addToast('Login successful!', 'success')
      setFormData(initialFormState)
      setTimeout(() => navigate('/'), 1200)
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
        padding: '2rem 1rem',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&display=swap');

        .ln-input {
          width: 100%;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 13px 18px;
          color: #0f172a;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .ln-input::placeholder { color: #94a3b8; }
        .ln-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .ln-input-wrap { position: relative; display: flex; align-items: center; }
        .ln-input-wrap .ln-input { padding-right: 48px; }
        .ln-eye-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
          line-height: 0;
        }
        .ln-eye-btn:hover { color: #6366f1; background: rgba(99,102,241,0.08); }

        .ln-submit {
          width: 100%;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px 24px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 4px 16px rgba(15,23,42,0.18);
          letter-spacing: 0.01em;
        }
        .ln-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(15,23,42,0.24);
        }
        .ln-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .ln-nav-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 50px;
          background: rgba(99,102,241,0.09);
          border: 1px solid rgba(99,102,241,0.2);
          font-size: 11px;
          font-weight: 600;
          color: #6366f1;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          width: fit-content;
        }

        .ln-checkbox { accent-color: #6366f1; width: 15px; height: 15px; cursor: pointer; }

        .ln-forgot {
          font-size: 13px;
          font-weight: 500;
          color: #6366f1;
          text-decoration: none;
          transition: color 0.2s;
        }
        .ln-forgot:hover { color: #4f46e5; text-decoration: underline; }

        .ln-register-link {
          color: #0f172a;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1.5px solid #6366f1;
          padding-bottom: 1px;
          transition: color 0.2s, border-color 0.2s;
        }
        .ln-register-link:hover { color: #6366f1; }

        @keyframes ln-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ln-a1 { animation: ln-fade-up 0.55s ease both; }
        .ln-a2 { animation: ln-fade-up 0.55s 0.08s ease both; }
        .ln-a3 { animation: ln-fade-up 0.55s 0.16s ease both; }
        .ln-a4 { animation: ln-fade-up 0.55s 0.24s ease both; }
        .ln-a5 { animation: ln-fade-up 0.55s 0.32s ease both; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .ln-spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Decorative blobs — same blue/indigo palette as the header */}
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
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1060px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        background: 'rgba(255,255,255,0.8)',
        border: '1.5px solid rgba(255,255,255,0.95)',
        borderRadius: '28px',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 32px 80px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}>

        {/* ── LEFT PANEL — dark slate matching header's gradient ── */}
        <section style={{
          background: 'linear-gradient(150deg, #1e293b 0%, #0f172a 60%, #1a2744 100%)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.25rem',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* inner glow using header's blue/indigo accent */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.25) 0%, transparent 55%), radial-gradient(ellipse at 90% 90%, rgba(59,130,246,0.2) 0%, transparent 55%)',
          }} />

          {/* Logo */}
          <div className="ln-a1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(99,102,241,0.5)',
            }}>
              <Wrench style={{ width: 18, height: 18, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              FixNow
            </span>
          </div>

          {/* Hero copy */}
          <div className="ln-a2" style={{
            position: 'relative', flex: 1,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', gap: '1.25rem',
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
              Your service hub
            </div>

            <h1 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(1.9rem, 3vw, 2.6rem)',
              fontWeight: 600,
              color: '#f8fafc',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              margin: 0,
            }}>
              Welcome back to FixNow.
            </h1>

            <p style={{
              fontSize: 15, lineHeight: 1.75,
              color: 'rgba(248,250,252,0.48)',
              margin: 0, maxWidth: 340,
            }}>
              Sign in to view your profile, manage service requests, and track your bookings effortlessly.
            </p>
          </div>

          {/* Feature cards */}
          <div className="ln-a3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { title: 'Quick Access', desc: 'Log in instantly with your email and password.' },
              { title: 'Secure Sessions', desc: 'Protected by token-based authentication.' },
            ].map((f) => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: '14px 16px',
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
        <section style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.55)',
        }}>
          {/* Header */}
          <div className="ln-a2" style={{ marginBottom: '2rem' }}>
            <div className="ln-nav-pill" style={{ marginBottom: 12 }}>
              <Sparkles style={{ width: 11, height: 11 }} />
              Welcome back
            </div>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(1.6rem, 2.2vw, 2rem)',
              fontWeight: 600,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              margin: '0 0 8px',
              lineHeight: 1.2,
            }}>
              Sign in to your account
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>
              Enter your credentials to access your FixNow profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            {/* Email */}
            <div className="ln-a3" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Email address</label>
              <input
                className="ln-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>

            {/* Password with eye toggle */}
            <div className="ln-a4" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Password</label>
              <div className="ln-input-wrap">
                <input
                  className="ln-input"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="ln-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOff style={{ width: 17, height: 17 }} />
                    : <Eye style={{ width: 17, height: 17 }} />
                  }
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="ln-a4" style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 12,
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" className="ln-checkbox" defaultChecked={false} />
                <span style={{ fontSize: 13, color: '#64748b' }}>Remember me</span>
              </label>
              <Link to="/forgot-password" className="ln-forgot">Forgot password?</Link>
            </div>

            {/* Submit */}
            <div className="ln-a5">
              <button type="submit" disabled={loading} className="ln-submit">
                {loading
                  ? <><Loader2 style={{ width: 16, height: 16 }} className="ln-spin" /> Signing in…</>
                  : <>Sign in <ArrowRight style={{ width: 16, height: 16 }} /></>
                }
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="ln-a5" style={{
            margin: '1.75rem 0 1.25rem',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>New to FixNow?</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <p className="ln-a5" style={{ textAlign: 'center', fontSize: 14, color: '#64748b', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/register" className="ln-register-link">Create one</Link>
          </p>
        </section>
      </div>
    </main>
  )
}