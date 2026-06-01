import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Loader2, Star } from 'lucide-react'
import { Header } from '../public/Header'
import { api, resolveMediaUrl } from '@/services/api'
import { useToast } from '@/context/ToastContext'

const ReviewPage = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [profileUserId, setProfileUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    loadBooking()
  }, [bookingId])

  const loadBooking = async () => {
    setLoading(true)
    setError('')

    try {
      const [profile, data] = await Promise.all([
        api.profile.current(),
        api.booking.retrieve(bookingId),
      ])

      setProfileUserId(profile?.user || null)
      setBooking(data)

      if (data?.user !== profile?.user) {
        const message = 'Only the customer who booked this service can submit a review.'
        setError(message)
        addToast(message, 'error')
      } else if (data?.status !== 'Completed') {
        const message = 'You can only review a booking after it has been completed.'
        setError(message)
        addToast(message, 'error')
      }
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        navigate('/login')
        return
      }
      const message = err?.payload?.detail || 'Failed to load booking'
      setError(message)
      addToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')

    try {
      await api.review.create({
        booking: Number(bookingId),
        rating: Number(form.rating),
        comment: form.comment,
      })

      setMessage('Review submitted successfully')
      addToast('Review submitted successfully', 'success')
      setTimeout(() => navigate('/bookings'), 1200)
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        navigate('/login')
        return
      }
      const message = err?.payload?.detail || err?.payload?.non_field_errors?.[0] || 'Failed to submit review'
      setError(message)
      addToast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate('/bookings')}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Review</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900">Rate your completed service</h1>
              <p className="mt-2 text-sm text-slate-600">
                Share your feedback only after the booking has been completed.
              </p>
            </div>
            {booking?.helper_service?.service?.image && (
              <img
                src={resolveMediaUrl(booking.helper_service.service.image)}
                alt={booking.helper_service?.service?.name || 'Service'}
                className="h-24 w-24 rounded-2xl object-cover"
              />
            )}
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {booking && (
            <div className="mb-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{booking.helper_service?.service?.name || 'Service'}</p>
              <p className="mt-1">Provider: {booking.helper_service?.provider_name || booking.helper_service?.provider_email || `Provider #${booking.helper_service?.user}`}</p>
              <p className="mt-1">Completed booking ID: {booking.id}</p>
            </div>
          )}

          {booking && booking.status === 'Completed' && booking.user === profileUserId ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Rating</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, rating: value }))}
                      className={`inline-flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        form.rating === value
                          ? 'border-amber-400 bg-amber-50 text-amber-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Star className="h-4 w-4" />
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="mb-2 block text-sm font-medium text-slate-700">
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={5}
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Tell others about your experience..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || booking?.status !== 'Completed'}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default ReviewPage