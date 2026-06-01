import { Header } from './Header'
import { CheckCircle2, Users, Zap } from 'lucide-react'
import Footer from './Footer'

const Aboutus = () => {
  const features = [
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Get instant connection with service professionals in your area.',
    },
    {
      icon: Users,
      title: 'Expert Professionals',
      description: 'Verified and skilled service providers ready to help.',
    },
    {
      icon: CheckCircle2,
      title: 'Quality Assured',
      description: 'High standards and customer satisfaction guaranteed.',
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              About FixNow
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Your trusted platform for connecting with skilled service professionals.
            </p>
          </div>

          <div className="mb-16 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950 mb-4">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed">
                FixNow is dedicated to making home and professional services accessible and affordable for everyone. We believe that quality service should be just a few clicks away. Our platform bridges the gap between service seekers and skilled professionals, ensuring reliability, transparency, and customer satisfaction.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-950 mb-4">Why Choose Us</h2>
              <ul className="space-y-3 text-slate-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <span>Easy booking and instant confirmation</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <span>Transparent pricing with no hidden costs</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <span>Professional and vetted service providers</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <span>24/7 customer support</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-slate-950 mb-8 text-center">What We Offer</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-6">
                    <Icon className="h-8 w-8 text-slate-950 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-950 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-lg bg-slate-950 px-8 py-12 text-white text-center">
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-slate-300 mb-6">
              Whether you're looking for services or want to become a service provider, FixNow is the perfect platform for you.
            </p>
            <button className="rounded-full bg-white px-6 py-2 font-semibold text-slate-950 hover:bg-slate-100">
              Get Started
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Aboutus
