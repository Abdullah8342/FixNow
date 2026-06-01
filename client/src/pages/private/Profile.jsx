
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Sparkles, CheckCircle2, LogOut, RefreshCw, Save, Upload, CalendarDays, Clock3, MapPin, UserRound, BadgeCheck } from 'lucide-react'
import { API_ENDPOINTS, buildApiUrl, getAuthHeaders, resolveMediaUrl } from '../../services/api'
import { api } from '@/services/api'
import { useToast } from '../../context/ToastContext'

const Profile = () => {
  const nav = useNavigate()
  const { addToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filePreview, setFilePreview] = useState(null)
  const [file, setFile] = useState(null)
  const [phone, setPhone] = useState('')
  const [providerReviews, setProviderReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsError, setReviewsError] = useState('')

  const access = () => localStorage.getItem('access_token')
  const refresh = () => localStorage.getItem('refresh_token')

  useEffect(() => {
    const token = access()
    if (!token) return nav('/login')
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (profile?.roll === 'SP' || profile?.roll === 'A') {
      loadProviderReviews()
    } else {
      setProviderReviews([])
      setReviewsError('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.roll, profile?.user])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.profile.root), {
        headers: getAuthHeaders(access()),
      })
      if (!res.ok) throw new Error('Failed to load profile')
      const data = await res.json()
      setProfile(data)
      setPhone(data.phone || '')
      setFilePreview(data.profile_picture || null)
    } catch (e) {
      addToast(e.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadProviderReviews = async () => {
    if (!profile?.user) return

    setReviewsLoading(true)
    setReviewsError('')

    try {
      const data = await api.review.list()
      const reviewsData = Array.isArray(data) ? data : data?.results || []
      const filtered = reviewsData.filter((review) => review?.helper_service?.user === profile.user)
      setProviderReviews(filtered)
    } catch (e) {
      setProviderReviews([])
      setReviewsError(e?.payload?.detail || 'Failed to load reviews')
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setFilePreview(URL.createObjectURL(f))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const form = new FormData()
      form.append('phone', phone)
      if (file) form.append('profile_picture', file)

      const res = await fetch(buildApiUrl(API_ENDPOINTS.profile.root), {
        method: 'PATCH',
        headers: getAuthHeaders(access()),
        body: form,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.detail || body?.message || 'Failed to update profile')
      }

      addToast('Profile updated', 'success')
      await fetchProfile()
    } catch (e) {
      addToast(e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      const refreshToken = refresh()
      if (refreshToken) {
        await fetch(buildApiUrl(API_ENDPOINTS.auth.logout), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        })
      }
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      addToast('Logged out successfully', 'success')
      nav('/login')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.16),transparent_38%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_48%,#fdf2f8_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.16),transparent_38%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_48%,#fdf2f8_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-4xl bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.14)] ring-1 ring-white/70 backdrop-blur xl:grid-cols-[1.1fr_0.9fr]">
        {/* Left Section - Hero */}
        <section className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-10 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.28),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.24),transparent_30%)]" />
          <div className="relative z-10 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.32em] text-amber-300">
            <Sparkles className="h-4 w-4" />
            FixNow
          </div>

          <div className="relative z-10 max-w-xl space-y-6">
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              {profile?.roll || 'Customer'} Dashboard
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                Manage your profile information, update your contact details, and keep your account secure.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 border-t border-white/10 pt-6 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
              Update your personal information anytime.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
              Your data is securely stored.
            </div>
          </div>
        </section>

        {/* Right Section - Profile Form */}
        <section className="flex items-start justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-lg space-y-8">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">
                Your Profile
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Account Settings
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                View and manage your profile information.
              </p>
            </div>

            {!profile ? (
              <div className="text-center text-slate-600">No profile data available</div>
            ) : (
              <form className="space-y-5" onSubmit={handleSave}>
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-full bg-linear-to-br from-amber-100 to-slate-100 ring-4 ring-white shadow-md">
                    {filePreview ? (
                      <img 
                        src={resolveMediaUrl(filePreview)} 
                        alt="avatar" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                        <Sparkles className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <Upload className="h-4 w-4" />
                    Change image
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  </label>
                </div>

                {/* Full Name - Read Only */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Full name</label>
                  <input 
                    value={profile.full_name || ''} 
                    readOnly 
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                  />
                </div>

                {/* Email - Read Only */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Email address</label>
                  <input 
                    value={profile.email || ''} 
                    readOnly 
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                  />
                </div>

                {/* Account Type - Read Only */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Account type</label>
                  <input 
                    value={profile.roll || ''} 
                    readOnly 
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                  />
                </div>

                {/* Phone - Editable */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Phone number
                  </label>
                  <input 
                    type="tel"
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    placeholder="Your phone number"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={fetchProfile}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reload
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-5 py-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 hover:text-rose-800"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            )}

            {(profile?.roll === 'SP' || profile?.roll === 'A') && (
              <section className="rounded-4xl border border-slate-200 bg-white/80 p-6 shadow-sm ring-1 ring-white/60">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">
                      Customer Feedback
                    </p>
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                      Reviews On Your Services
                    </h3>
                  </div>
                  <BadgeCheck className="h-6 w-6 text-slate-400" />
                </div>

                {reviewsError && (
                  <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {reviewsError}
                  </div>
                )}

                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
                  </div>
                ) : providerReviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                    No reviews yet for your completed services.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {providerReviews.map((review) => (
                      <article key={review.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900">
                              {review.booking_details?.service || review.helper_service?.service?.name || 'Service'}
                            </h4>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 ring-2 ring-white">
                                {review.reviewer_image ? (
                                  <img
                                    src={resolveMediaUrl(review.reviewer_image)}
                                    alt={review.reviewer_name || review.reviewer_email || 'Service Acquirer'}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500">
                                    {String(review.reviewer_name || review.reviewer_email || 'SA').slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-slate-600">
                                Service Acquirer: {review.reviewer_name || review.reviewer_email || `Customer #${review.user}`}
                              </p>
                            </div>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                            {review.rating} / 5
                          </span>
                        </div>

                        {review.comment && (
                          <p className="mt-3 text-sm leading-6 text-slate-700">
                            {review.comment}
                          </p>
                        )}

                        <div className="mt-3 text-xs text-slate-500">
                          Reviewed on {review.created_at ? new Date(review.created_at).toLocaleString() : 'Unknown date'}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

          </div>
        </section>
      </div>
    </main>
  )
}

export default Profile
