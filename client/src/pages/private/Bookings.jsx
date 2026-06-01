import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertCircle, CalendarDays, Loader2, MapPin, UserRound, Clock3, BadgeCheck } from 'lucide-react'
import { Header } from '../public/Header'
import { api } from '@/services/api'
import { useToast } from '@/context/ToastContext'

const formatDateTime = (value) => {
  if (!value) return 'Not scheduled'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const BookingCard = ({ booking, canManage = false, onStatusChange, actionLoadingId }) => {
  const isCustomerReviewEligible = !canManage && booking.status === 'Completed'
  const serviceName = booking.helper_service?.service?.name || 'Service'
  const description = booking.helper_service?.service?.description || 'Service booking'
  const provider =
    booking.helper_service?.provider_name ||
    booking.helper_service?.provider_email ||
    booking.helper_service?.user ||
    'Provider'
  const locations = booking.helper_service?.location || []

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Booking</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">{serviceName}</h3>
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">{description}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            booking.status === 'Completed'
              ? 'bg-emerald-50 text-emerald-700'
              : booking.status === 'Accepted'
                ? 'bg-blue-50 text-blue-700'
                : booking.status === 'In Progress'
                  ? 'bg-amber-50 text-amber-700'
                  : booking.status === 'Rejected'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-slate-100 text-slate-700'
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-700">
        <p className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-slate-500" />
          <span>{provider}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-slate-500" />
          <span>{formatDateTime(booking.scheduled_at)}</span>
        </p>
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
          <span>
            {locations.length > 0
              ? locations.map((location) => `${location.city}, ${location.area}`).join(' | ')
              : 'Location not specified'}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-slate-500" />
          <span>Price: PKR {booking.helper_service?.price}</span>
        </p>
      </div>

      {canManage && (
        <div className="mt-5 flex flex-wrap gap-2">
          {booking.status === 'Pending' && (
            <>
              <button
                onClick={() => onStatusChange?.(booking.id, 'Accepted')}
                disabled={actionLoadingId === booking.id}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {actionLoadingId === booking.id ? 'Processing...' : 'Accept'}
              </button>
              <button
                onClick={() => onStatusChange?.(booking.id, 'Rejected')}
                disabled={actionLoadingId === booking.id}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
              >
                Reject
              </button>
            </>
          )}

          {booking.status === 'Accepted' && (
            <>
              <button
                onClick={() => onStatusChange?.(booking.id, 'In Progress')}
                disabled={actionLoadingId === booking.id}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {actionLoadingId === booking.id ? 'Processing...' : 'Mark In Progress'}
              </button>
              <button
                onClick={() => onStatusChange?.(booking.id, 'Rejected')}
                disabled={actionLoadingId === booking.id}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
              >
                Cancel
              </button>
            </>
          )}

          {booking.status === 'In Progress' && (
            <button
              onClick={() => onStatusChange?.(booking.id, 'Completed')}
              disabled={actionLoadingId === booking.id}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {actionLoadingId === booking.id ? 'Processing...' : 'Mark Complete'}
            </button>
          )}
        </div>
      )}

      {isCustomerReviewEligible && (
        <div className="mt-5">
          <Link
            to={`/review/${booking.id}`}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Write Review
          </Link>
        </div>
      )}
    </div>
  )
}

export default function BookingsPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  useEffect(() => {
    loadProfileAndBookings()
  }, [])

  const loadProfileAndBookings = async () => {
    setLoading(true)
    setError('')

    try {
      const [profile, bookingResponse, reviewResponse] = await Promise.all([
        api.profile.current(),
        api.booking.list(),
        api.review.list(),
      ])

      setUserRole(profile?.roll || '')

      const bookingsData = Array.isArray(bookingResponse) ? bookingResponse : bookingResponse?.results || []
      setBookings(bookingsData)

      const reviewData = Array.isArray(reviewResponse) ? reviewResponse : reviewResponse?.results || []
      const reviewedBookingIds = new Set(
        reviewData
          .map((review) => review?.booking_details?.id)
          .filter(Boolean)
      )

      const completedBooking = bookingsData.find(
        (booking) => booking.status === 'Completed' && booking.user === profile?.user && !reviewedBookingIds.has(booking.id)
      )

      if (completedBooking && profile?.roll !== 'SP' && profile?.roll !== 'A') {
        navigate(`/review/${completedBooking.id}`)
        return
      }
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        navigate('/login')
        return
      }
      setBookings([])
      const message = err?.payload?.detail || 'Failed to load bookings'
      setError(message)
      addToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeStatus = async (bookingId, status) => {
    setActionLoadingId(bookingId)
    try {
      await api.booking.patch(bookingId, { status })
      await loadProfileAndBookings()
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        navigate('/login')
        return
      }
      const message = err?.payload?.detail || err?.payload?.status || 'Failed to update booking'
      setError(message)
      addToast(message, 'error')
    } finally {
      setActionLoadingId(null)
    }
  }

  const canManageBookings = userRole === 'SP' || userRole === 'A'

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Your Bookings
          </h1>
          <p className="mt-4 text-xl text-slate-600">
            Review your scheduled service requests and booking status.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex h-80 items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-slate-400" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">No bookings yet</h2>
            <p className="mt-2 text-slate-600">Book a service from the services page to see it here.</p>
            <Link
              to="/services"
              className="mt-6 inline-flex rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Browse Services
            </Link>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                canManage={canManageBookings}
                onStatusChange={handleChangeStatus}
                actionLoadingId={actionLoadingId}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
