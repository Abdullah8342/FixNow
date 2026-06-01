import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from './Header'
import Footer from './Footer'
import { api, resolveMediaUrl } from '@/services/api'
import { Loader2, MapPin, UserRound } from 'lucide-react'

const ProviderProfile = () => {
  const { providerId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProviderProfile()
  }, [providerId])

  const loadProviderProfile = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await api.profile.provider(providerId)
      setProfile(data)
    } catch (err) {
      setProfile(null)
      setError(err?.payload?.detail || 'Failed to load provider profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : !profile ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
            Provider profile not found.
          </div>
        ) : (
          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-100">
                    {profile.profile_picture ? (
                      <img
                        src={resolveMediaUrl(profile.profile_picture)}
                        alt={profile.full_name || 'Provider'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                        {(profile.full_name || 'SP').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                      {profile.full_name || 'Service Provider'}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">{profile.email}</p>
                    <p className="mt-1 text-sm text-slate-600">Phone: {profile.phone || 'N/A'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/services')}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Back to Services
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">Provider Services</h2>

              {!Array.isArray(profile.service) || profile.service.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                  No services listed by this provider yet.
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {profile.service.map((item) => (
                    <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {item.service?.image && (
                        <img
                          src={resolveMediaUrl(item.service.image)}
                          alt={item.service?.name || 'Service'}
                          className="h-36 w-full object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-slate-900">{item.service?.name || 'Service'}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {item.service?.description || 'Service by this provider.'}
                        </p>

                        <div className="mt-3 space-y-1 text-sm text-slate-700">
                          <p className="font-semibold text-slate-900">PKR {item.price}</p>
                          <p className="flex items-center gap-2">
                            <UserRound className="h-4 w-4 text-slate-500" />
                            <span>{item.experience_year || 0} years experience</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                            <span>
                              {Array.isArray(item.location) && item.location.length > 0
                                ? item.location.map((loc) => `${loc.city}, ${loc.area}`).join(' | ')
                                : 'Location not specified'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ProviderProfile
