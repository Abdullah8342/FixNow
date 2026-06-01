import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/pages/public/Header'
import { api, resolveMediaUrl } from '@/services/api'
import { AlertCircle, CheckCircle2, Loader2, MapPin, UserRound, X } from 'lucide-react'
import Footer from '@/pages/public/Footer'
import { useToast } from '@/context/ToastContext'

export default function MyOfferings() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [offerings, setOfferings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingOffering, setEditingOffering] = useState(null)
  const [editForm, setEditForm] = useState({ service_id: '', location_ids: [], price: '', experience_year: '', is_available: true })
  const [servicesList, setServicesList] = useState([])
  const [locationsList, setLocationsList] = useState([])
  const [deletePending, setDeletePending] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadMyOfferings()
  }, [])

  const loadMyOfferings = async () => {
    setLoading(true)
    setError('')
    try {
      const profile = await api.profile.current()
      const myOfferings = Array.isArray(profile?.service) ? profile.service : []
      setOfferings(myOfferings)
    } catch (err) {
      addToast(err?.payload?.detail || 'Failed to load your offerings', 'error')
      setOfferings([])
    } finally {
      setLoading(false)
    }
  }

  const openEdit = async (offering) => {
    setEditingOffering(offering)
    setSubmitting(false)
    try {
      const [servicesData, locationsData] = await Promise.all([api.service.list(), api.helper.locationList()])
      const services = Array.isArray(servicesData) ? servicesData : servicesData?.results || []
      const locations = Array.isArray(locationsData) ? locationsData : locationsData?.results || []
      setServicesList(services)
      setLocationsList(locations)
      setEditForm({
        service_id: offering.service?.id || '',
        price: offering.price,
        experience_year: offering.experience_year || '',
        is_available: offering.is_available,
        location_ids: Array.isArray(offering.location) ? offering.location.map((l) => l.id) : [],
      })
    } catch (err) {
      addToast(err?.payload?.detail || 'Failed to load edit options', 'error')
    }
  }

  const handleDelete = (id) => {
    setDeletePending(id)
  }

  const confirmDelete = async () => {
    const id = deletePending
    if (!id) return
    setSubmitting(true)
    try {
      await api.helper.helperServiceDelete(id)
      addToast('Offering deleted', 'success')
      setDeletePending(null)
      await loadMyOfferings()
    } catch (err) {
      addToast(err?.payload?.detail || 'Failed to delete offering', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const cancelDelete = () => setDeletePending(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">My Offerings</h1>
          <p className="mt-4 text-xl text-slate-600">Manage the services you offer</p>
        </div>

        {/* errors shown as toasts */}

        {loading && (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          </div>
        )}

        {!loading && offerings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">You have not created any offerings yet.</p>
          </div>
        )}

        {!loading && offerings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((offering) => (
              <div key={offering.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                {offering.service?.image && (
                  <img src={resolveMediaUrl(offering.service.image)} alt={offering.service?.name || 'Service'} className="mb-4 h-44 w-full rounded-xl object-cover" />
                )}
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{offering.service?.name || 'Service'}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{offering.service?.description || 'Professional service offering.'}</p>

                <div className="space-y-2 mb-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">PKR {offering.price}</p>
                  <p className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-slate-500" />
                    <span>{offering.provider_name || offering.provider_email || `Provider #${offering.user}`}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openEdit(offering)} className="flex-1 rounded-md bg-amber-600 text-white px-4 py-2 font-medium hover:bg-amber-700 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(offering.id)} className="flex-1 rounded-md border border-red-300 text-red-700 px-4 py-2 font-medium hover:bg-red-50 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {editingOffering && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Edit Offering</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">{editingOffering.service?.name || 'Service'}</h2>
                </div>
                <button type="button" onClick={() => setEditingOffering(null)} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label="Close edit dialog">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                setSubmitting(true)
                try {
                  const payload = {
                    service_id: editForm.service_id ? parseInt(editForm.service_id) : undefined,
                    location_id: Array.isArray(editForm.location_ids) ? editForm.location_ids : undefined,
                    price: parseFloat(editForm.price),
                    experience_year: editForm.experience_year ? parseInt(editForm.experience_year) : null,
                    is_available: !!editForm.is_available,
                  }
                  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
                  await api.helper.helperServicePatch(editingOffering.id, payload)
                  addToast('Offering updated', 'success')
                  setEditingOffering(null)
                  await loadMyOfferings()
                } catch (err) {
                  if (err?.status === 401 || err?.status === 403) {
                    navigate('/login')
                    return
                  }
                  setError(err?.payload?.detail || 'Failed to update offering')
                } finally {
                  setSubmitting(false)
                }
              }} className="space-y-4">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Service Type</label>
                  <select value={editForm.service_id} onChange={(e) => setEditForm((p) => ({ ...p, service_id: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400" required>
                    <option value="">-- Select Service --</option>
                    {servicesList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Price (PKR)</label>
                  <input type="number" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400" required />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Locations</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto border rounded-md p-2">
                    {locationsList.map((loc) => (
                      <label key={loc.id} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={Array.isArray(editForm.location_ids) ? editForm.location_ids.includes(loc.id) : false} onChange={(e) => {
                          const checked = e.target.checked
                          setEditForm((p) => {
                            const ids = Array.isArray(p.location_ids) ? [...p.location_ids] : []
                            if (checked) {
                              if (!ids.includes(loc.id)) ids.push(loc.id)
                            } else {
                              const idx = ids.indexOf(loc.id)
                              if (idx > -1) ids.splice(idx, 1)
                            }
                            return { ...p, location_ids: ids }
                          })
                        }} />
                        <span>{loc.city}, {loc.area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Experience (years)</label>
                  <input type="number" value={editForm.experience_year} onChange={(e) => setEditForm((p) => ({ ...p, experience_year: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400" />
                </div>

                <div className="flex items-center gap-3">
                  <input id="is_available" type="checkbox" checked={!!editForm.is_available} onChange={(e) => setEditForm((p) => ({ ...p, is_available: e.target.checked }))} />
                  <label htmlFor="is_available" className="text-sm text-slate-700">Available for booking</label>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditingOffering(null)} className="flex-1 rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 rounded-md bg-amber-600 px-4 py-2 font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deletePending && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-slate-900">Confirm Delete</h3>
              <p className="mt-2 text-sm text-slate-600">Are you sure you want to delete this offering? This action cannot be undone.</p>
              <div className="mt-4 flex gap-3">
                <button onClick={cancelDelete} className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-slate-700">Cancel</button>
                <button onClick={confirmDelete} disabled={submitting} className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white">{submitting ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  )
}
