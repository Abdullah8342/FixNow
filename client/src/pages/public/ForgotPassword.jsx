// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { ArrowRight, Loader2, Sparkles, CheckCircle2, Mail, Lock, Zap } from 'lucide-react'
// import { API_ENDPOINTS, buildApiUrl } from '../../services/api'
// import { useToast } from '../../context/ToastContext'
// import { useAuth } from '../../context/AuthContext'

// const STEPS = {
//   REQUEST_OTP: 'request_otp',
//   VERIFY_OTP: 'verify_otp',
//   RESET_PASSWORD: 'reset_password',
// }

// export const ForgotPassword = () => {
//   const navigate = useNavigate()
//   const { addToast } = useToast()
//   const { setTokens } = useAuth()
//   const [step, setStep] = useState(STEPS.REQUEST_OTP)
//   const [email, setEmail] = useState('')
//   const [otp, setOtp] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [loading, setLoading] = useState(false)

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
//       return message || 'An error occurred. Please try again.'
//     } catch {
//       return 'An error occurred. Please try again.'
//     }
//   }

//   const handleRequestOTP = async (event) => {
//     event.preventDefault()
//     setLoading(true)

//     try {
//       const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.forgotPassword), {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       })

//       if (!response.ok) {
//         throw new Error(await extractErrorMessage(response))
//       }

//       addToast('OTP sent to your email. Check your inbox.', 'success')
//       setStep(STEPS.VERIFY_OTP)
//     } catch (submitError) {
//       addToast(submitError.message, 'error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerifyOTP = async (event) => {
//     event.preventDefault()
//     setLoading(true)

//     try {
//       const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.verifyOtp), {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, otp }),
//       })

//       if (!response.ok) {
//         throw new Error(await extractErrorMessage(response))
//       }

//       const data = await response.json()
//       setTokens(data.access, data.refresh)

//       addToast('OTP verified. Now reset your password.', 'success')
//       setStep(STEPS.RESET_PASSWORD)
//     } catch (submitError) {
//       addToast(submitError.message, 'error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleResetPassword = async (event) => {
//     event.preventDefault()

//     if (password !== confirmPassword) {
//       addToast('Passwords do not match.', 'error')
//       return
//     }

//     setLoading(true)

//     try {
//       const accessToken = localStorage.getItem('access_token')
//       const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.resetPassword), {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify({ password, confirm_password: confirmPassword }),
//       })

//       if (!response.ok) {
//         throw new Error(await extractErrorMessage(response))
//       }

//       addToast('Password reset successfully. Redirecting to login...', 'success')
//       setTimeout(() => {
//         navigate('/login')
//       }, 1500)
//     } catch (submitError) {
//       addToast(submitError.message, 'error')
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
//               Recover your account securely.
//             </p>
//             <div className="space-y-4">
//               <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
//                 Reset your password with ease.
//               </h1>
//               <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
//                 We'll send you a one-time code via email. Verify it and set a new password to regain access.
//               </p>
//             </div>
//           </div>

//           <div className="relative z-10 grid gap-4 border-t border-white/10 pt-6 text-sm text-slate-300 sm:grid-cols-2">
//             <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//               <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
//               Multi-step verification for security.
//             </div>
//             <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//               <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
//               OTP sent directly to your email.
//             </div>
//           </div>
//         </section>

//         <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
//           <div className="w-full max-w-lg">
//             <div className="mb-8 space-y-2">
//               <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">
//                 Password recovery
//               </p>
//               <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
//                 {step === STEPS.REQUEST_OTP && 'Request a reset code'}
//                 {step === STEPS.VERIFY_OTP && 'Verify your code'}
//                 {step === STEPS.RESET_PASSWORD && 'Set new password'}
//               </h2>
//               <p className="text-sm leading-6 text-slate-600">
//                 {step === STEPS.REQUEST_OTP && 'Enter your email to receive a one-time code.'}
//                 {step === STEPS.VERIFY_OTP && 'Check your email and enter the code we sent.'}
//                 {step === STEPS.RESET_PASSWORD && 'Create a strong new password for your account.'}
//               </p>
//             </div>

//             {/* Step 1: Request OTP */}
//             {step === STEPS.REQUEST_OTP && (
//               <form className="space-y-5" onSubmit={handleRequestOTP}>
//                 <label className="space-y-2 text-sm font-medium text-slate-700">
//                   <span className="flex items-center gap-2">
//                     <Mail className="h-4 w-4" />
//                     Email address
//                   </span>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 my-2 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
//                     placeholder="you@example.com"
//                   />
//                 </label>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
//                 >
//                   {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
//                   {loading ? 'Sending...' : 'Send code'}
//                 </button>
//               </form>
//             )}

//             {/* Step 2: Verify OTP */}
//             {step === STEPS.VERIFY_OTP && (
//               <form className="space-y-5" onSubmit={handleVerifyOTP}>
//                 <label className="space-y-2 text-sm font-medium text-slate-700">
//                   <span>One-time code</span>
//                   <input
//                     type="text"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     required
//                     placeholder="e.g., 123456"
//                     className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
//                   />
//                 </label>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
//                 >
//                   {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
//                   {loading ? 'Verifying...' : 'Verify code'}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setStep(STEPS.REQUEST_OTP)}
//                   className="w-full text-sm text-slate-600 hover:underline"
//                 >
//                   Didn't receive code? Request again
//                 </button>
//               </form>
//             )}

//             {/* Step 3: Reset Password */}
//             {step === STEPS.RESET_PASSWORD && (
//               <form className="space-y-5" onSubmit={handleResetPassword}>
//                 <label className="space-y-2 text-sm font-medium text-slate-700">
//                   <span className="flex items-center gap-2">
//                     <Lock className="h-4 w-4" />
//                     New password
//                   </span>
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     minLength={8}
//                     className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
//                     placeholder="••••••••"
//                   />
//                 </label>

//                 <label className="space-y-2 text-sm font-medium text-slate-700">
//                   <span className="flex items-center gap-2">
//                     <Lock className="h-4 w-4" />
//                     Confirm password
//                   </span>
//                   <input
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                     minLength={8}
//                     className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
//                     placeholder="••••••••"
//                   />
//                 </label>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
//                 >
//                   {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
//                   {loading ? 'Resetting...' : 'Reset password'}
//                 </button>
//               </form>
//             )}

//             <p className="mt-6 text-center text-sm text-slate-600">
//               Remember your password?{' '}
//               <Link to="/login" className="font-semibold text-slate-950 underline-offset-4 hover:underline">
//                 Back to login
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
import { ArrowRight, Loader2, Sparkles, CheckCircle2, Mail, Lock, Zap, Eye, EyeOff, Wrench, ShieldCheck } from 'lucide-react'
import { API_ENDPOINTS, buildApiUrl } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'

const STEPS = {
  REQUEST_OTP: 'request_otp',
  VERIFY_OTP: 'verify_otp',
  RESET_PASSWORD: 'reset_password',
}

const stepMeta = {
  [STEPS.REQUEST_OTP]: {
    pill: 'Step 1 of 3',
    title: 'Request a reset code',
    desc: 'Enter your email address and we will send you a one-time code.',
  },
  [STEPS.VERIFY_OTP]: {
    pill: 'Step 2 of 3',
    title: 'Verify your code',
    desc: 'Check your inbox and enter the 6-digit code we sent you.',
  },
  [STEPS.RESET_PASSWORD]: {
    pill: 'Step 3 of 3',
    title: 'Set a new password',
    desc: 'Create a strong new password to regain access to your account.',
  }
}     


export const ForgotPassword = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { setTokens } = useAuth()
  const [step, setStep] = useState(STEPS.REQUEST_OTP)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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
      return message || 'An error occurred. Please try again.'
    } catch {
      return 'An error occurred. Please try again.'
    }
  }

  const handleRequestOTP = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.forgotPassword), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) throw new Error(await extractErrorMessage(response))
      addToast('OTP sent to your email. Check your inbox.', 'success')
      setStep(STEPS.VERIFY_OTP)
    } catch (submitError) {
      addToast(submitError.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.verifyOtp), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      if (!response.ok) throw new Error(await extractErrorMessage(response))
      const data = await response.json()
      setTokens(data.access, data.refresh)
      addToast('OTP verified. Now reset your password.', 'success')
      setStep(STEPS.RESET_PASSWORD)
    } catch (submitError) {
      addToast(submitError.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error')
      return
    }
    setLoading(true)
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch(buildApiUrl(API_ENDPOINTS.auth.resetPassword), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password, confirm_password: confirmPassword }),
      })
      if (!response.ok) throw new Error(await extractErrorMessage(response))
      addToast('Password reset successfully. Redirecting to login...', 'success')
      setTimeout(() => navigate('/login'), 1500)
    } catch (submitError) {
      addToast(submitError.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const meta = stepMeta[step]
  const stepIndex = { [STEPS.REQUEST_OTP]: 0, [STEPS.VERIFY_OTP]: 1, [STEPS.RESET_PASSWORD]: 2 }[step]

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

        .fp-input {
          width: 100%;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 13px 16px;
          color: #0f172a;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .fp-input::placeholder { color: #94a3b8; }
        .fp-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .fp-input-icon {
          padding-left: 44px;
        }

        .fp-input-wrap { position: relative; display: flex; align-items: center; }
        .fp-input-wrap .fp-input { padding-right: 46px; }
        .fp-icon-left {
          position: absolute; left: 14px;
          color: #94a3b8; pointer-events: none; line-height: 0;
        }
        .fp-eye-btn {
          position: absolute; right: 12px;
          background: none; border: none; cursor: pointer;
          color: #94a3b8; display: flex; align-items: center;
          padding: 4px; border-radius: 6px;
          transition: color 0.2s, background 0.2s; line-height: 0;
        }
        .fp-eye-btn:hover { color: #6366f1; background: rgba(99,102,241,0.08); }

        .fp-submit {
          width: 100%;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #fff; border: none; border-radius: 12px;
          padding: 14px 24px; font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(15,23,42,0.18);
          letter-spacing: 0.01em;
        }
        .fp-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(15,23,42,0.24);
        }
        .fp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .fp-ghost-btn {
          width: 100%;
          background: transparent;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 24px;
          font-size: 14px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          color: #64748b; cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .fp-ghost-btn:hover { border-color: #6366f1; color: #6366f1; background: rgba(99,102,241,0.04); }

        .fp-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 50px;
          background: rgba(99,102,241,0.09);
          border: 1px solid rgba(99,102,241,0.2);
          font-size: 11px; font-weight: 600; color: #6366f1;
          letter-spacing: 0.08em; text-transform: uppercase; width: fit-content;
        }

        .fp-login-link {
          color: #0f172a; font-weight: 600; text-decoration: none;
          border-bottom: 1.5px solid #6366f1; padding-bottom: 1px;
          transition: color 0.2s;
        }
        .fp-login-link:hover { color: #6366f1; }

        /* Progress stepper */
        .fp-stepper {
          display: flex; align-items: center; gap: 0;
          margin-bottom: 2rem;
        }
        .fp-step-dot {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; flex-shrink: 0;
          transition: background 0.3s, color 0.3s, box-shadow 0.3s;
        }
        .fp-step-dot.done {
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          color: #fff;
          box-shadow: 0 2px 10px rgba(99,102,241,0.35);
        }
        .fp-step-dot.active {
          background: #0f172a; color: #fff;
          box-shadow: 0 2px 10px rgba(15,23,42,0.25);
        }
        .fp-step-dot.pending {
          background: #f1f5f9; color: #94a3b8;
          border: 1.5px solid #e2e8f0;
        }
        .fp-step-line {
          flex: 1; height: 2px; margin: 0 4px;
          border-radius: 2px;
          transition: background 0.4s;
        }
        .fp-step-line.done { background: linear-gradient(90deg, #6366f1, #3b82f6); }
        .fp-step-line.pending { background: #e2e8f0; }

        /* OTP input special style */
        .fp-otp-input {
          width: 100%;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          color: #0f172a;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.35em;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .fp-otp-input::placeholder { color: #cbd5e1; font-weight: 400; letter-spacing: 0.2em; font-size: 16px; }
        .fp-otp-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        /* Card */
        .fp-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .fp-card { grid-template-columns: 1fr; }
          .fp-left-panel { display: none; }
        }

        .fp-left-panel { padding: 1rem; }

        .fp-right-panel { padding: 2.5rem; }
        @media (max-width: 640px) {
          .fp-right-panel { padding: 1.5rem 1.25rem; }
        }

        @keyframes fp-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fp-a1 { animation: fp-fade-up 0.5s ease both; }
        .fp-a2 { animation: fp-fade-up 0.5s 0.07s ease both; }
        .fp-a3 { animation: fp-fade-up 0.5s 0.14s ease both; }
        .fp-a4 { animation: fp-fade-up 0.5s 0.21s ease both; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fp-spin { animation: spin 1s linear infinite; }

        @keyframes fp-slide {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .fp-slide { animation: fp-slide 0.35s ease both; }
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
        className="fp-card"
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
          className="fp-left-panel"
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
          <div className="fp-a1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <div className="fp-a2" style={{
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
              <ShieldCheck style={{ width: 11, height: 11 }} />
              Secure recovery
            </div>

            <h1 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(1.7rem, 2.8vw, 2.5rem)',
              fontWeight: 600, color: '#f8fafc',
              lineHeight: 1.2, letterSpacing: '-0.03em', margin: 0,
            }}>
              Reset your password with ease.
            </h1>

            <p style={{
              fontSize: 15, lineHeight: 1.75,
              color: 'rgba(248,250,252,0.48)',
              margin: 0, maxWidth: 340,
            }}>
              We'll send you a one-time code via email. Verify it and set a new password to regain access.
            </p>
          </div>

          {/* Feature cards */}
          <div className="fp-a3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { title: 'Multi-step Verification', desc: 'Three secure steps to protect your account.' },
              { title: 'OTP via Email', desc: 'One-time code sent directly to your inbox.' },
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
          className="fp-right-panel"
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            background: 'rgba(255,255,255,0.55)',
          }}
        >
          {/* Step progress */}
          <div className="fp-a1 fp-stepper">
            {['Email', 'Verify', 'Reset'].map((label, i) => {
              const isDone = i < stepIndex
              const isActive = i === stepIndex
              return (
                <>
                  <div
                    key={label}
                    className={`fp-step-dot ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}
                    title={label}
                  >
                    {isDone ? <CheckCircle2 style={{ width: 14, height: 14 }} /> : i + 1}
                  </div>
                  {i < 2 && (
                    <div className={`fp-step-line ${i < stepIndex ? 'done' : 'pending'}`} key={`line-${i}`} />
                  )}
                </>
              )
            })}
          </div>

          {/* Header */}
          <div className="fp-a2" style={{ marginBottom: '1.75rem' }}>
            <div className="fp-pill" style={{ marginBottom: 10 }}>
              <Sparkles style={{ width: 11, height: 11 }} />
              {meta.pill}
            </div>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(1.5rem, 2.2vw, 1.9rem)',
              fontWeight: 600, color: '#0f172a',
              letterSpacing: '-0.025em', margin: '0 0 6px', lineHeight: 1.2,
            }}>
              {meta.title}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
              {meta.desc}
            </p>
          </div>

          {/* ── STEP 1: Request OTP ── */}
          {step === STEPS.REQUEST_OTP && (
            <form className="fp-slide" onSubmit={handleRequestOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Email address</label>
                <div className="fp-input-wrap" style={{ position: 'relative' }}>
                  <span className="fp-icon-left" style={{ position: 'absolute', left: 14, color: '#94a3b8', lineHeight: 0, pointerEvents: 'none' }}>
                    <Mail style={{ width: 16, height: 16 }} />
                  </span>
                  <input
                    className="fp-input"
                    style={{ paddingLeft: 44 }}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="fp-submit" style={{ marginTop: '0.25rem' }}>
                {loading
                  ? <><Loader2 style={{ width: 16, height: 16 }} className="fp-spin" /> Sending…</>
                  : <><Zap style={{ width: 16, height: 16 }} /> Send code</>
                }
              </button>
            </form>
          )}

          {/* ── STEP 2: Verify OTP ── */}
          {step === STEPS.VERIFY_OTP && (
            <form className="fp-slide" onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>One-time code</label>
                <input
                  className="fp-otp-input"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="• • • • • •"
                  maxLength={8}
                />
                <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                  Sent to <strong style={{ color: '#475569' }}>{email}</strong>
                </p>
              </div>

              <button type="submit" disabled={loading} className="fp-submit">
                {loading
                  ? <><Loader2 style={{ width: 16, height: 16 }} className="fp-spin" /> Verifying…</>
                  : <><CheckCircle2 style={{ width: 16, height: 16 }} /> Verify code</>
                }
              </button>

              <button
                type="button"
                className="fp-ghost-btn"
                onClick={() => setStep(STEPS.REQUEST_OTP)}
              >
                Didn't receive code? Request again
              </button>
            </form>
          )}

          {/* ── STEP 3: Reset Password ── */}
          {step === STEPS.RESET_PASSWORD && (
            <form className="fp-slide" onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>New password</label>
                <div className="fp-input-wrap">
                  <span style={{ position: 'absolute', left: 14, color: '#94a3b8', lineHeight: 0, pointerEvents: 'none' }}>
                    <Lock style={{ width: 16, height: 16 }} />
                  </span>
                  <input
                    className="fp-input"
                    style={{ paddingLeft: 44 }}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                  />
                  <button type="button" className="fp-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Confirm password</label>
                <div className="fp-input-wrap">
                  <span style={{ position: 'absolute', left: 14, color: '#94a3b8', lineHeight: 0, pointerEvents: 'none' }}>
                    <Lock style={{ width: 16, height: 16 }} />
                  </span>
                  <input
                    className="fp-input"
                    style={{ paddingLeft: 44 }}
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                  />
                  <button type="button" className="fp-eye-btn"
                    onClick={() => setShowConfirm(v => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                    {showConfirm ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="fp-submit" style={{ marginTop: '0.25rem' }}>
                {loading
                  ? <><Loader2 style={{ width: 16, height: 16 }} className="fp-spin" /> Resetting…</>
                  : <>Reset password <ArrowRight style={{ width: 16, height: 16 }} /></>
                }
              </button>
            </form>
          )}

          {/* Divider + back to login */}
          <div style={{
            margin: '1.75rem 0 1.1rem',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>Remember it?</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', margin: 0 }}>
            Remember your password?{' '}
            <Link to="/login" className="fp-login-link">Back to login</Link>
          </p>
        </section>
      </div>
    </main>
  )
}