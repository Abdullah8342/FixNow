import { useState } from 'react'
import { Header } from './Header'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import Footer from './Footer'
import { api } from '@/services/api'

export const Contactus = () => {
  const { addToast } = useToast()
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      addToast('Please fill in all fields', 'error')
      return
    }

    setLoading(true)
    try {
      await api.account.contactUs(formData)
      addToast('Our team will contact you shortly.', 'success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      addToast(error?.payload?.detail || 'Failed to send message. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-200 bg-white p-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 border border-slate-200">
                <div className="flex gap-4 mb-4">
                  <Mail className="h-6 w-6 text-slate-950 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-950">Email</h3>
                    <p className="text-sm text-slate-600">support@fixnow.com</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 border border-slate-200">
                <div className="flex gap-4 mb-4">
                  <Phone className="h-6 w-6 text-slate-950 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-950">Phone</h3>
                    <p className="text-sm text-slate-600">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 border border-slate-200">
                <div className="flex gap-4 mb-4">
                  <MapPin className="h-6 w-6 text-slate-950 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-950">Address</h3>
                    <p className="text-sm text-slate-600">123 Service Street<br />Tech City, TC 12345</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-slate-950 p-6 text-white">
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-sm text-slate-300">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
