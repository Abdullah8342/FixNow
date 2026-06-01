
// import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Header } from './Header'
// import { api } from '@/services/api'
// import { AlertCircle, CalendarDays, CheckCircle2, Loader2, MapPin, UserRound, X, Search, SlidersHorizontal, Filter, ChevronDown, ChevronUp, Star, DollarSign, TrendingUp, Grid3x3, List, Clock, Briefcase } from 'lucide-react'
// import { resolveMediaUrl } from '@/services/api'
// import Footer from './Footer'
// import { useToast } from '@/context/ToastContext'

// export const Services = () => {
//   const navigate = useNavigate()
//   const { addToast } = useToast()
//   const [offerings, setOfferings] = useState([])
  
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [currentUser, setCurrentUser] = useState(null)
  
//   const [bookingId, setBookingId] = useState(null)
//   const [bookingOffering, setBookingOffering] = useState(null)
//   const [bookingForm, setBookingForm] = useState({ scheduled_at: '' })
//   const [bookingSubmitting, setBookingSubmitting] = useState(false)
  
//   // Filter state
//   const [filters, setFilters] = useState({
//     searchText: '',
//     serviceType: '',
//     location: '',
//     minExperience: '',
//     maxExperience: '',
//     minPrice: '',
//     maxPrice: '',
//     availableOnly: false,
//     sortBy: 'relevance', // relevance, price_low, price_high, experience_high, experience_low
//   })
  
//   // UI state
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
//   const [viewMode, setViewMode] = useState('grid') // grid, list
//   const [searchSuggestions, setSearchSuggestions] = useState([])
//   const [showSuggestions, setShowSuggestions] = useState(false)
//   const [recentSearches, setRecentSearches] = useState([])
//   const searchInputRef = useRef(null)
  
//   // Price range from data
//   const priceRange = useMemo(() => {
//     const prices = offerings.map(o => o.price).filter(p => p > 0)
//     if (prices.length === 0) return { min: 0, max: 10000 }
//     return {
//       min: Math.min(...prices),
//       max: Math.max(...prices)
//     }
//   }, [offerings])

//   // Load recent searches from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem('recentServiceSearches')
//     if (saved) {
//       try {
//         setRecentSearches(JSON.parse(saved).slice(0, 5))
//       } catch (e) {}
//     }
//   }, [])

//   // Save recent search
//   const saveRecentSearch = useCallback((searchTerm) => {
//     if (!searchTerm.trim()) return
//     setRecentSearches(prev => {
//       const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5)
//       localStorage.setItem('recentServiceSearches', JSON.stringify(updated))
//       return updated
//     })
//   }, [])

//   // Debounced search for suggestions
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (filters.searchText.length > 1) {
//         // Generate suggestions from existing data
//         const suggestions = new Set()
        
//         offerings.forEach(offering => {
//           // Provider name suggestions
//           if (offering.provider_name?.toLowerCase().includes(filters.searchText.toLowerCase())) {
//             suggestions.add(offering.provider_name)
//           }
//           // Service name suggestions
//           if (offering.service?.name?.toLowerCase().includes(filters.searchText.toLowerCase())) {
//             suggestions.add(offering.service.name)
//           }
//           // Location suggestions
//           if (Array.isArray(offering.location)) {
//             offering.location.forEach(loc => {
//               const locationStr = `${loc.city}, ${loc.area}`
//               if (locationStr.toLowerCase().includes(filters.searchText.toLowerCase())) {
//                 suggestions.add(locationStr)
//               }
//             })
//           }
//         })
        
//         setSearchSuggestions(Array.from(suggestions).slice(0, 5))
//         setShowSuggestions(true)
//       } else {
//         setSearchSuggestions([])
//         setShowSuggestions(false)
//       }
//     }, 300)
    
//     return () => clearTimeout(timer)
//   }, [filters.searchText, offerings])

//   useEffect(() => {
//     loadServices()
//     loadCurrentUser()
//   }, [])

//   const loadCurrentUser = async () => {
//     try {
//       const profile = await api.profile.current()
//       setCurrentUser(profile)
//     } catch (err) {
//       setCurrentUser(null)
//     }
//   }

//   const loadServices = async () => {
//     setLoading(true)
//     setError('')
//     try {
//       const data = await api.helper.helperServiceList()
//       const offeringsData = Array.isArray(data) ? data : data?.results || []
//       setOfferings(offeringsData)
//     } catch (err) {
//       addToast(err?.payload?.detail || 'Failed to load services', 'error')
//       setOfferings([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleBookService = async (offering) => {
//     if (currentUser && (String(currentUser.id) === String(offering.user))) {
//       addToast('You cannot book your own service', 'error')
//       return
//     }
//     setBookingOffering(offering)
//     setBookingForm({ scheduled_at: '' })
//   }

//   const closeBookingModal = () => {
//     setBookingOffering(null)
//     setBookingForm({ scheduled_at: '' })
//     setBookingSubmitting(false)
//   }

//   const submitBooking = async (event) => {
//     event.preventDefault()
//     if (!bookingForm.scheduled_at) {
//       addToast('Please choose a booking date and time', 'error')
//       return
//     }
//     const selectedDate = new Date(bookingForm.scheduled_at)
//     if (Number.isNaN(selectedDate.getTime())) {
//       addToast('Invalid booking date and time', 'error')
//       return
//     }
//     setBookingSubmitting(true)
//     setError('')
//     try {
//       const booking = await api.booking.create({
//         helper_service_id: bookingOffering.id,
//         scheduled_at: selectedDate.toISOString(),
//       })
//       setBookingId(booking?.id || null)
//       addToast('Booking created successfully.', 'success')
//       closeBookingModal()
//     } catch (err) {
//       if (err?.status === 401 || err?.status === 403) {
//         closeBookingModal()
//         navigate('/login')
//         return
//       }
//       addToast(err?.payload?.detail || err?.payload?.non_field_errors?.[0] || 'Failed to create booking', 'error')
//     } finally {
//       setBookingSubmitting(false)
//     }
//   }

//   // Extract unique services and locations
//   const uniqueServices = useMemo(() => {
//     const services = {}
//     offerings.forEach((off) => {
//       if (off.service?.id && off.service?.name) {
//         services[off.service.id] = off.service.name
//       }
//     })
//     return Object.entries(services).map(([id, name]) => ({ id, name }))
//   }, [offerings])

//   const uniqueLocations = useMemo(() => {
//     const locations = {}
//     offerings.forEach((off) => {
//       if (Array.isArray(off.location)) {
//         off.location.forEach((loc) => {
//           const key = `${loc.city}, ${loc.area}`
//           locations[key] = true
//         })
//       }
//     })
//     return Object.keys(locations).sort()
//   }, [offerings])

//   // Filter and sort offerings
//   const filteredOfferings = useMemo(() => {
//     let filtered = offerings.filter((offering) => {
//       // Search text filter
//       if (filters.searchText) {
//         const search = filters.searchText.toLowerCase()
//         const matchesProvider = (offering.provider_name || '').toLowerCase().includes(search) ||
//                                 (offering.provider_email || '').toLowerCase().includes(search)
//         const matchesService = (offering.service?.name || '').toLowerCase().includes(search)
//         const matchesLocation = Array.isArray(offering.location) && offering.location.some(
//           (l) => `${l.city}, ${l.area}`.toLowerCase().includes(search)
//         )
//         if (!matchesProvider && !matchesService && !matchesLocation) {
//           return false
//         }
//       }

//       // Service type filter
//       if (filters.serviceType && String(offering.service?.id) !== String(filters.serviceType)) {
//         return false
//       }

//       // Location filter
//       if (filters.location) {
//         const hasLocation = Array.isArray(offering.location) && offering.location.some(
//           (l) => `${l.city}, ${l.area}` === filters.location
//         )
//         if (!hasLocation) {
//           return false
//         }
//       }

//       // Experience filter
//       const exp = offering.experience_year ?? 0
//       if (filters.minExperience && exp < parseInt(filters.minExperience)) {
//         return false
//       }
//       if (filters.maxExperience && exp > parseInt(filters.maxExperience)) {
//         return false
//       }

//       // Price filter
//       const price = offering.price ?? 0
//       if (filters.minPrice && price < parseInt(filters.minPrice)) {
//         return false
//       }
//       if (filters.maxPrice && price > parseInt(filters.maxPrice)) {
//         return false
//       }

//       // Availability filter
//       if (filters.availableOnly && !offering.is_available) {
//         return false
//       }

//       return true
//     })

//     // Apply sorting
//     switch (filters.sortBy) {
//       case 'price_low':
//         filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
//         break
//       case 'price_high':
//         filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
//         break
//       case 'experience_high':
//         filtered.sort((a, b) => (b.experience_year || 0) - (a.experience_year || 0))
//         break
//       case 'experience_low':
//         filtered.sort((a, b) => (a.experience_year || 0) - (b.experience_year || 0))
//         break
//       default:
//         // relevance - keep original order
//         break
//     }

//     return filtered
//   }, [offerings, filters])

//   const clearAllFilters = () => {
//     setFilters({
//       searchText: '',
//       serviceType: '',
//       location: '',
//       minExperience: '',
//       maxExperience: '',
//       minPrice: '',
//       maxPrice: '',
//       availableOnly: false,
//       sortBy: 'relevance',
//     })
//   }

//   const hasActiveFilters = () => {
//     return filters.searchText || filters.serviceType || filters.location || 
//            filters.minExperience || filters.maxExperience || 
//            filters.minPrice || filters.maxPrice || filters.availableOnly
//   }

//   const handleSearchSubmit = (e) => {
//     e.preventDefault()
//     if (filters.searchText.trim()) {
//       saveRecentSearch(filters.searchText.trim())
//     }
//     setShowSuggestions(false)
//   }

//   const applySuggestion = (suggestion) => {
//     setFilters(prev => ({ ...prev, searchText: suggestion }))
//     saveRecentSearch(suggestion)
//     setShowSuggestions(false)
//     searchInputRef.current?.blur()
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
//       <Header />

//       <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//         {/* Hero Section with Enhanced Search */}
//         <div className="mb-12 text-center">
//           <h1 className="text-md  tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
//             Find Professional Services
//           </h1>
//           <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
//             Connect with trusted service providers in your area
//           </p>
//         </div>

//         {/* Enhanced Search Bar */}
//         <div className="mb-6">
//           <form onSubmit={handleSearchSubmit} className="relative">
//             <div className="relative flex items-center">
//               <div className="absolute left-4 text-slate-400">
//                 <Search className="h-5 w-5" />
//               </div>
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search by service, provider name, or location..."
//                 value={filters.searchText}
//                 onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
//                 onFocus={() => filters.searchText.length > 1 && setShowSuggestions(true)}
//                 className="w-full rounded-3xl border border-slate-200 bg-white py-4 pl-12 pr-32 text-base shadow-sm transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
//               />
//               <div className="absolute right-2 flex gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//                   className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
//                     showAdvancedFilters 
//                       ? 'bg-blue-600 text-white' 
//                       : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                   }`}
//                 >
//                   <SlidersHorizontal className="h-4 w-4" />
//                   Filters
//                   {hasActiveFilters() && (
//                     <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
//                       {Object.values(filters).filter(v => v && v !== 'relevance' && v !== false).length}
//                     </span>
//                   )}
//                 </button>
//                 <button
//                   type="submit"
//                   className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
//                 >
//                   Search
//                 </button>
//               </div>
//             </div>

//             {/* Search Suggestions */}
//             {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
//               <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
//                 {recentSearches.length > 0 && filters.searchText.length <= 1 && (
//                   <div className="border-b border-slate-100 p-2">
//                     <p className="mb-1 px-3 text-xs font-semibold uppercase text-slate-400">Recent Searches</p>
//                     {recentSearches.map((search, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => applySuggestion(search)}
//                         className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
//                       >
//                         <Clock className="h-3.5 w-3.5 text-slate-400" />
//                         {search}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//                 {searchSuggestions.length > 0 && (
//                   <div className="p-2">
//                     <p className="mb-1 px-3 text-xs font-semibold uppercase text-slate-400">Suggestions</p>
//                     {searchSuggestions.map((suggestion, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => applySuggestion(suggestion)}
//                         className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
//                       >
//                         <Search className="h-3.5 w-3.5 text-slate-400" />
//                         {suggestion}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </form>
//         </div>

//         {/* Advanced Filters Panel */}
//         {showAdvancedFilters && (
//           <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm animate-in slide-in-from-top-2 duration-200">
//             <div className="mb-4 flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                 <Filter className="h-5 w-5 text-blue-600" />
//                 Advanced Filters
//               </h3>
//               <button
//                 onClick={() => setShowAdvancedFilters(false)}
//                 className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
//               >
//                 <ChevronUp className="h-5 w-5" />
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
//               {/* Service Type */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">Service Type</label>
//                 <select
//                   value={filters.serviceType}
//                   onChange={(e) => setFilters(p => ({ ...p, serviceType: e.target.value }))}
//                   className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
//                 >
//                   <option value="">All Services</option>
//                   {uniqueServices.map((service) => (
//                     <option key={service.id} value={service.id}>{service.name}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Location */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
//                 <select
//                   value={filters.location}
//                   onChange={(e) => setFilters(p => ({ ...p, location: e.target.value }))}
//                   className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
//                 >
//                   <option value="">All Locations</option>
//                   {uniqueLocations.map((loc) => (
//                     <option key={loc} value={loc}>{loc}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Experience Range */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
//                 <div className="flex gap-2">
//                   <input
//                     type="number"
//                     placeholder="Min"
//                     value={filters.minExperience}
//                     onChange={(e) => setFilters(p => ({ ...p, minExperience: e.target.value }))}
//                     className="w-1/2 rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Max"
//                     value={filters.maxExperience}
//                     onChange={(e) => setFilters(p => ({ ...p, maxExperience: e.target.value }))}
//                     className="w-1/2 rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Price Range */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">Price Range (PKR)</label>
//                 <div className="flex gap-2">
//                   <input
//                     type="number"
//                     placeholder={`Min (${priceRange.min})`}
//                     value={filters.minPrice}
//                     onChange={(e) => setFilters(p => ({ ...p, minPrice: e.target.value }))}
//                     className="w-1/2 rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                   <input
//                     type="number"
//                     placeholder={`Max (${priceRange.max})`}
//                     value={filters.maxPrice}
//                     onChange={(e) => setFilters(p => ({ ...p, maxPrice: e.target.value }))}
//                     className="w-1/2 rounded-md border border-slate-300 px-3 py-2 text-sm"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
//               <div className="flex items-center gap-4">
//                 <label className="flex items-center gap-2 text-sm text-slate-700">
//                   <input
//                     type="checkbox"
//                     checked={filters.availableOnly}
//                     onChange={(e) => setFilters(p => ({ ...p, availableOnly: e.target.checked }))}
//                     className="rounded border-slate-300"
//                   />
//                   Available for booking only
//                 </label>
//               </div>
              
//               <div className="flex gap-2">
//                 {hasActiveFilters() && (
//                   <button
//                     onClick={clearAllFilters}
//                     className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
//                   >
//                     Clear All Filters
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Sort and View Options Bar */}
//         <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
//           <p className="text-sm text-slate-600">
//             Found <span className="font-semibold text-slate-900">{filteredOfferings.length}</span> services
//           </p>
          
//           <div className="flex items-center gap-3">
//             {/* Sort Dropdown */}
//             <select
//               value={filters.sortBy}
//               onChange={(e) => setFilters(p => ({ ...p, sortBy: e.target.value }))}
//               className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
//             >
//               <option value="relevance">Sort by: Relevance</option>
//               <option value="price_low">Price: Low to High</option>
//               <option value="price_high">Price: High to Low</option>
//               <option value="experience_high">Experience: Most to Least</option>
//               <option value="experience_low">Experience: Least to Most</option>
//             </select>

//             {/* View Toggle */}
//             <div className="flex rounded-md border border-slate-200 bg-white p-1">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`rounded-md p-1.5 transition ${
//                   viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
//                 }`}
//               >
//                 <Grid3x3 className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`rounded-md p-1.5 transition ${
//                   viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
//                 }`}
//               >
//                 <List className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 text-red-600" />
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}

//         {loading && (
//           <div className="flex justify-center items-center h-96">
//             <div className="text-center space-y-4">
//               <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
//               <p className="text-gray-600">Loading services...</p>
//             </div>
//           </div>
//         )}

//         {!loading && offerings.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-600 text-lg">No services available yet.</p>
//           </div>
//         )}

//         {!loading && offerings.length > 0 && filteredOfferings.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-600 text-lg">No services match your filters. Try adjusting your search criteria.</p>
//             <button
//               onClick={clearAllFilters}
//               className="mt-4 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
//             >
//               Clear all filters
//             </button>
//           </div>
//         )}

//         {/* Services Display - Grid/List View */}
//         {!loading && filteredOfferings.length > 0 && (
//           <div className={viewMode === 'grid' 
//             ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//             : "space-y-4"
//           }>
//             {filteredOfferings.map((offering) => (
//               <div
//                 key={offering.id}
//                 className={viewMode === 'grid'
//                   ? "rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] duration-200"
//                   : "rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all flex gap-4"
//                 }
//               >
//                 {viewMode === 'grid' ? (
//                   // Grid View
//                   <>
//                     {offering.service?.image && (
//                       <img
//                         src={resolveMediaUrl(offering.service.image)}
//                         alt={offering.service?.name || 'Service'}
//                         className="mb-4 h-44 w-full rounded-xl object-cover"
//                       />
//                     )}
//                     <h3 className="text-xl font-semibold text-slate-900 mb-2">
//                       {offering.service?.name || 'Service'}
//                     </h3>
//                     <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                       {offering.service?.description || 'Professional service offering by a verified provider.'}
//                     </p>

//                     <div className="space-y-2 mb-4 text-sm text-slate-700">
//                       <p className="text-2xl font-bold text-blue-600">PKR {offering.price}</p>
//                       <div className="flex items-center gap-3 py-2">
//                         {offering.provider_profile_picture ? (
//                           <img
//                             src={resolveMediaUrl(offering.provider_profile_picture)}
//                             alt={offering.provider_name || 'Provider'}
//                             className="h-8 w-8 rounded-full object-cover"
//                           />
//                         ) : (
//                           <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
//                             <UserRound className="h-4 w-4 text-slate-500" />
//                           </div>
//                         )}
//                         <span className="font-medium text-slate-900">{offering.provider_name || offering.provider_email || `Provider #${offering.user}`}</span>
//                       </div>
//                       <p className="flex items-start gap-2">
//                         <MapPin className="h-4 w-4 mt-0.5 text-slate-500" />
//                         <span className="text-xs">
//                           {Array.isArray(offering.location) && offering.location.length > 0
//                             ? offering.location.map((l) => `${l.city}, ${l.area}`).join(' | ')
//                             : 'Location not specified'}
//                         </span>
//                       </p>
//                       <div className="flex items-center justify-between">
//                         <p className="flex items-center gap-1">
//                           <Briefcase className="h-3.5 w-3.5 text-slate-400" />
//                           <span>{offering.experience_year ?? 0} years exp</span>
//                         </p>
//                         <p className="flex items-center gap-1">
//                           <span className={`inline-block h-2 w-2 rounded-full ${offering.is_available ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
//                           <span className="text-xs">{offering.is_available ? 'Available' : 'Unavailable'}</span>
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => navigate(`/provider/${offering.user}`)}
//                         className="flex-1 rounded-md bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition-colors"
//                       >
//                         View Provider
//                       </button>
//                       {(() => {
//                         const isOwn = currentUser && String(currentUser.id) === String(offering.user)
//                         return (
//                           <button
//                             onClick={() => !isOwn && handleBookService(offering)}
//                             disabled={isOwn}
//                             className={`flex-1 rounded-md border border-gray-300 px-4 py-2 font-medium inline-flex items-center justify-center gap-2 ${isOwn ? 'bg-gray-100 text-slate-500 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-50 transition-colors'}`}
//                           >
//                             <CalendarDays className="h-4 w-4" />
//                             {isOwn ? 'Own Service' : 'Book'}
//                           </button>
//                         )
//                       })()}
//                     </div>
//                   </>
//                 ) : (
//                   // List View
//                   <>
//                     {offering.service?.image && (
//                       <img
//                         src={resolveMediaUrl(offering.service.image)}
//                         alt={offering.service?.name || 'Service'}
//                         className="h-32 w-32 rounded-lg object-cover flex-shrink-0"
//                       />
//                     )}
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <h3 className="text-lg font-semibold text-slate-900">
//                             {offering.service?.name || 'Service'}
//                           </h3>
//                           <div className="mt-1 flex items-center gap-3 text-sm text-slate-600">
//                             <span className="flex items-center gap-1">
//                               <UserRound className="h-3.5 w-3.5" />
//                               {offering.provider_name || offering.provider_email}
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <MapPin className="h-3.5 w-3.5" />
//                               {Array.isArray(offering.location) && offering.location.length > 0
//                                 ? offering.location[0].city
//                                 : 'Location N/A'}
//                             </span>
//                           </div>
//                         </div>
//                         <p className="text-2xl font-bold text-blue-600">PKR {offering.price}</p>
//                       </div>
//                       <p className="mt-2 text-sm text-slate-600 line-clamp-2">
//                         {offering.service?.description || 'Professional service offering by a verified provider.'}
//                       </p>
//                       <div className="mt-3 flex items-center justify-between">
//                         <div className="flex gap-4 text-sm text-slate-600">
//                           <span>Experience: {offering.experience_year ?? 0} years</span>
//                           <span className={`font-medium ${offering.is_available ? 'text-emerald-600' : 'text-rose-600'}`}>
//                             {offering.is_available ? 'Available' : 'Unavailable'}
//                           </span>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => navigate(`/provider/${offering.user}`)}
//                             className="rounded-md bg-blue-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-blue-700"
//                           >
//                             View Provider
//                           </button>
//                           {(() => {
//                             const isOwn = currentUser && String(currentUser.id) === String(offering.user)
//                             return (
//                               <button
//                                 onClick={() => !isOwn && handleBookService(offering)}
//                                 disabled={isOwn}
//                                 className={`rounded-md border px-4 py-1.5 text-sm font-medium inline-flex items-center gap-1 ${isOwn ? 'bg-gray-100 text-slate-500 cursor-not-allowed' : 'border-gray-300 text-gray-900 hover:bg-gray-50'}`}
//                               >
//                                 <CalendarDays className="h-3.5 w-3.5" />
//                                 {isOwn ? 'Own Service' : 'Book'}
//                               </button>
//                             )
//                           })()}
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Booking Modal - Same as before */}
//         {bookingOffering && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
//             <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
//               <div className="mb-5 flex items-start justify-between gap-4">
//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
//                     Book Service
//                   </p>
//                   <h2 className="mt-1 text-2xl font-bold text-slate-900">
//                     {bookingOffering.service?.name || 'Service'}
//                   </h2>
//                   <p className="mt-1 text-sm text-slate-600">
//                     Pick a date and time for your booking request.
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={closeBookingModal}
//                   className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>

//               <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
//                 <p className="flex items-center gap-2 font-medium text-slate-900">
//                   <CheckCircle2 className="h-4 w-4 text-emerald-600" />
//                   Provider: {bookingOffering.provider_name || bookingOffering.provider_email || `Provider #${bookingOffering.user}`}
//                 </p>
//                 <p className="mt-2">Price: PKR {bookingOffering.price}</p>
//               </div>

//               <form onSubmit={submitBooking} className="space-y-4">
//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Scheduled date and time
//                   </label>
//                   <input
//                     type="datetime-local"
//                     value={bookingForm.scheduled_at}
//                     onChange={(event) => setBookingForm({ scheduled_at: event.target.value })}
//                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
//                     min={new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 16)}
//                     required
//                   />
//                   <p className="mt-2 text-xs text-slate-500">
//                     Booking must be at least 15 minutes in the future.
//                   </p>
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={closeBookingModal}
//                     className="flex-1 rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={bookingSubmitting}
//                     className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     {bookingSubmitting ? 'Booking...' : 'Confirm Booking'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </main>
//       <Footer />
//     </div>
//   )
// }

// export default Services




import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from './Header'
import { api } from '@/services/api'
import { AlertCircle, CalendarDays, CheckCircle2, Loader2, MapPin, UserRound, X, Search, SlidersHorizontal, Filter, ChevronDown, ChevronUp, Star, DollarSign, TrendingUp, Grid3x3, List, Clock, Briefcase, Sparkles } from 'lucide-react'
import { resolveMediaUrl } from '@/services/api'
import Footer from './Footer'
import { useToast } from '@/context/ToastContext'

export const Services = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [offerings, setOfferings] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  
  const [bookingId, setBookingId] = useState(null)
  const [bookingOffering, setBookingOffering] = useState(null)
  const [bookingForm, setBookingForm] = useState({ scheduled_at: '' })
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  
  // Filter state
  const [filters, setFilters] = useState({
    searchText: '',
    serviceType: '',
    location: '',
    minExperience: '',
    maxExperience: '',
    minPrice: '',
    maxPrice: '',
    availableOnly: false,
    sortBy: 'relevance',
  })
  
  // UI state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const searchInputRef = useRef(null)
  const suggestionsRef = useRef(null)
  
  // Price range from data
  const priceRange = useMemo(() => {
    const prices = offerings.map(o => o.price).filter(p => p > 0)
    if (prices.length === 0) return { min: 0, max: 10000 }
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }, [offerings])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(59,130,246,0.06) 0%, transparent 50%), linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f0f9ff 100%)',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflowX: 'hidden',
    },
    decorativeBlob1: {
      position: 'fixed',
      top: '-8%',
      left: '-4%',
      width: '40%',
      maxWidth: 440,
      height: '40%',
      maxHeight: 440,
      borderRadius: '50%',
      background: 'rgba(99,102,241,0.1)',
      filter: 'blur(72px)',
      pointerEvents: 'none',
      zIndex: 0,
    },
    decorativeBlob2: {
      position: 'fixed',
      bottom: '-12%',
      right: '-6%',
      width: '50%',
      maxWidth: 520,
      height: '50%',
      maxHeight: 520,
      borderRadius: '50%',
      background: 'rgba(59,130,246,0.08)',
      filter: 'blur(80px)',
      pointerEvents: 'none',
      zIndex: 0,
    },
    mainContent: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '1280px',
      margin: '0 auto',
      padding: 'clamp(1rem, 4vw, 2rem)',
    },
    heroSection: {
      textAlign: 'center',
      marginBottom: 'clamp(1.5rem, 5vw, 3rem)',
    },
    heroBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '50px',
      background: 'rgba(99,102,241,0.09)',
      border: '1px solid rgba(99,102,241,0.2)',
      fontSize: '11px',
      fontWeight: 600,
      color: '#6366f1',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      width: 'fit-content',
      margin: '0 auto 1rem auto',
    },
    heroTitle: {
      fontFamily: "'Fraunces', serif",
      fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
      fontWeight: 700,
      color: '#0f172a',
      letterSpacing: '-0.03em',
      margin: 0,
    },
    heroSubtitle: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      color: '#64748b',
      marginTop: '0.75rem',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    searchWrapper: {
      marginBottom: '1.5rem',
      position: 'relative',
    },
    searchForm: {
      position: 'relative',
    },
    searchInputContainer: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    searchRow: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
    },
    searchIcon: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      left: '1rem',
      color: '#94a3b8',
      zIndex: 1,
    },
    searchInput: {
      flex: 1,
      width: '100%',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(10px)',
      border: '1.5px solid #e2e8f0',
      borderRadius: '60px',
      padding: '0.875rem 1rem 0.875rem 3rem',
      fontSize: '0.875rem',
      fontFamily: "'DM Sans', sans-serif",
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box',
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
      marginLeft: '0.75rem',
    },
    filterButton: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1rem',
      borderRadius: '40px',
      fontSize: '0.813rem',
      fontWeight: 500,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: isActive ? '#6366f1' : '#f1f5f9',
      color: isActive ? '#fff' : '#475569',
      whiteSpace: 'nowrap',
    }),
    searchButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      borderRadius: '40px',
      fontSize: '0.813rem',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      color: '#fff',
      transition: 'transform 0.15s, box-shadow 0.2s',
      whiteSpace: 'nowrap',
    },
    suggestionsDropdown: {
      position: 'absolute',
      top: 'calc(100% + 0.5rem)',
      left: 0,
      right: 0,
      zIndex: 100,
      background: '#fff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      maxHeight: '300px',
      overflowY: 'auto',
    },
    suggestionSection: {
      borderBottom: '1px solid #f1f5f9',
      padding: '0.5rem',
    },
    suggestionTitle: {
      fontSize: '0.7rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      color: '#94a3b8',
      padding: '0.25rem 0.75rem',
      marginBottom: '0.25rem',
    },
    suggestionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      width: '100%',
      padding: '0.5rem 0.75rem',
      background: 'none',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      color: '#475569',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'background 0.2s',
    },
    advancedFiltersPanel: {
      marginBottom: '1.5rem',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      padding: 'clamp(1rem, 3vw, 1.5rem)',
    },
    panelHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
    },
    panelTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem',
    },
    filterLabel: {
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: 500,
      color: '#475569',
      marginBottom: '0.25rem',
    },
    filterSelect: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '0.875rem',
      outline: 'none',
      background: '#fff',
    },
    filterInput: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '0.875rem',
      outline: 'none',
    },
    filterActions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e2e8f0',
    },
    clearButton: {
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      background: '#fff',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    resultCount: {
      fontSize: '0.875rem',
      color: '#64748b',
    },
    resultCountNumber: {
      fontWeight: 600,
      color: '#0f172a',
    },
    toolbarRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    sortSelect: {
      padding: '0.5rem',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '0.875rem',
      outline: 'none',
      background: '#fff',
    },
    viewToggle: {
      display: 'flex',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      background: '#fff',
      padding: '0.25rem',
    },
    viewButton: (isActive) => ({
      padding: '0.375rem',
      borderRadius: '6px',
      border: 'none',
      background: isActive ? '#6366f1' : 'transparent',
      color: isActive ? '#fff' : '#64748b',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    errorAlert: {
      marginBottom: '1.5rem',
      padding: '1rem',
      borderRadius: '12px',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
    },
    loadingContent: {
      textAlign: 'center',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    servicesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    serviceCard: (mode) => ({
      background: '#fff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      ...(mode === 'grid' ? { padding: '1rem' } : { padding: '1rem', display: 'flex', gap: '1rem' }),
    }),
    serviceImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      borderRadius: '12px',
      marginBottom: '1rem',
    },
    serviceImageList: {
      width: '120px',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '12px',
      flexShrink: 0,
    },
    serviceTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: '0.5rem',
    },
    serviceDescription: {
      fontSize: '0.875rem',
      color: '#64748b',
      lineHeight: 1.5,
      marginBottom: '1rem',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    servicePrice: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#6366f1',
      marginBottom: '0.5rem',
    },
    providerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem',
    },
    providerAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    providerAvatarPlaceholder: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    providerName: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#0f172a',
    },
    locationInfo: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
      fontSize: '0.75rem',
      color: '#64748b',
      marginBottom: '0.5rem',
    },
    metaRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
    },
    experienceBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.75rem',
      color: '#64748b',
    },
    availabilityBadge: (isAvailable) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.75rem',
      color: isAvailable ? '#10b981' : '#ef4444',
    }),
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem',
    },
    primaryButton: {
      flex: 1,
      padding: '0.5rem 1rem',
      borderRadius: '40px',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      color: '#fff',
      border: 'none',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    secondaryButton: (disabled) => ({
      flex: 1,
      padding: '0.5rem 1rem',
      borderRadius: '40px',
      background: disabled ? '#f1f5f9' : '#fff',
      color: disabled ? '#94a3b8' : '#475569',
      border: '1px solid #e2e8f0',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    }),
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(15,23,42,0.6)',
      backdropFilter: 'blur(4px)',
      padding: '1rem',
    },
    modalContent: {
      maxWidth: '28rem',
      width: '100%',
      background: '#fff',
      borderRadius: '24px',
      padding: '1.5rem',
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '1rem',
    },
    modalTitle: {
      fontSize: '0.7rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      color: '#6366f1',
    },
    modalSubtitle: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#0f172a',
      marginTop: '0.25rem',
    },
    closeButton: {
      padding: '0.5rem',
      borderRadius: '50%',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
    },
    bookingInfo: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    formLabel: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#475569',
      marginBottom: '0.25rem',
    },
    datetimeInput: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '0.875rem',
    },
    modalButtons: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1.5rem',
    },
    modalCancelButton: {
      flex: 1,
      padding: '0.5rem',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      background: '#fff',
      cursor: 'pointer',
    },
    modalConfirmButton: {
      flex: 1,
      padding: '0.5rem',
      borderRadius: '8px',
      border: 'none',
      background: '#6366f1',
      color: '#fff',
      fontWeight: 500,
      cursor: 'pointer',
    },
  }

  // Media query styles
  const mobileStyles = `
    @media (max-width: 640px) {
      .search-row {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 0.75rem !important;
      }
      .action-buttons {
        margin-left: 0 !important;
        justify-content: flex-end !important;
      }
      .search-input {
        width: 100% !important;
      }
      .filter-button span, .search-button span {
        display: none !important;
      }
      .filter-button, .search-button {
        padding: 0.625rem !important;
      }
      .toolbar {
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      .toolbar-right {
        width: 100% !important;
        justify-content: space-between !important;
      }
      .services-grid {
        grid-template-columns: 1fr !important;
      }
      .service-card-list {
        flex-direction: column !important;
      }
      .service-image-list {
        width: 100% !important;
        height: 160px !important;
      }
      .filter-grid {
        grid-template-columns: 1fr !important;
      }
    }

    @media (min-width: 641px) and (max-width: 768px) {
      .services-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .spin {
      animation: spin 1s linear infinite;
    }
    
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 30px -12px rgba(0,0,0,0.1);
    }
    
    .btn-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }
    
    .input-focus:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    }
    
    .suggestion-item:hover {
      background: #f8fafc;
    }
    
    .clear-btn:hover {
      background: #f8fafc;
    }
    
    .close-btn:hover {
      background: #f1f5f9;
    }
  `

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentServiceSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5))
      } catch (e) {}
    }
  }, [])

  // Save recent search
  const saveRecentSearch = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return
    setRecentSearches(prev => {
      const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5)
      localStorage.setItem('recentServiceSearches', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Debounced search for suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.searchText.length > 1) {
        const suggestions = new Set()
        
        offerings.forEach(offering => {
          if (offering.provider_name?.toLowerCase().includes(filters.searchText.toLowerCase())) {
            suggestions.add(offering.provider_name)
          }
          if (offering.service?.name?.toLowerCase().includes(filters.searchText.toLowerCase())) {
            suggestions.add(offering.service.name)
          }
          if (Array.isArray(offering.location)) {
            offering.location.forEach(loc => {
              const locationStr = `${loc.city}, ${loc.area}`
              if (locationStr.toLowerCase().includes(filters.searchText.toLowerCase())) {
                suggestions.add(locationStr)
              }
            })
          }
        })
        
        setSearchSuggestions(Array.from(suggestions).slice(0, 5))
        setShowSuggestions(true)
      } else {
        setSearchSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [filters.searchText, offerings])

  useEffect(() => {
    loadServices()
    loadCurrentUser()
  }, [])

  const loadCurrentUser = async () => {
    try {
      const profile = await api.profile.current()
      setCurrentUser(profile)
    } catch (err) {
      setCurrentUser(null)
    }
  }

  const loadServices = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.helper.helperServiceList()
      const offeringsData = Array.isArray(data) ? data : data?.results || []
      setOfferings(offeringsData)
    } catch (err) {
      addToast(err?.payload?.detail || 'Failed to load services', 'error')
      setOfferings([])
    } finally {
      setLoading(false)
    }
  }

  const handleBookService = async (offering) => {
    if (currentUser && (String(currentUser.id) === String(offering.user))) {
      addToast('You cannot book your own service', 'error')
      return
    }
    setBookingOffering(offering)
    setBookingForm({ scheduled_at: '' })
  }

  const closeBookingModal = () => {
    setBookingOffering(null)
    setBookingForm({ scheduled_at: '' })
    setBookingSubmitting(false)
  }

  const submitBooking = async (event) => {
    event.preventDefault()
    if (!bookingForm.scheduled_at) {
      addToast('Please choose a booking date and time', 'error')
      return
    }
    const selectedDate = new Date(bookingForm.scheduled_at)
    if (Number.isNaN(selectedDate.getTime())) {
      addToast('Invalid booking date and time', 'error')
      return
    }
    setBookingSubmitting(true)
    setError('')
    try {
      const booking = await api.booking.create({
        helper_service_id: bookingOffering.id,
        scheduled_at: selectedDate.toISOString(),
      })
      setBookingId(booking?.id || null)
      addToast('Booking created successfully.', 'success')
      closeBookingModal()
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        closeBookingModal()
        navigate('/login')
        return
      }
      addToast(err?.payload?.detail || err?.payload?.non_field_errors?.[0] || 'Failed to create booking', 'error')
    } finally {
      setBookingSubmitting(false)
    }
  }

  // Extract unique services and locations
  const uniqueServices = useMemo(() => {
    const services = {}
    offerings.forEach((off) => {
      if (off.service?.id && off.service?.name) {
        services[off.service.id] = off.service.name
      }
    })
    return Object.entries(services).map(([id, name]) => ({ id, name }))
  }, [offerings])

  const uniqueLocations = useMemo(() => {
    const locations = {}
    offerings.forEach((off) => {
      if (Array.isArray(off.location)) {
        off.location.forEach((loc) => {
          const key = `${loc.city}, ${loc.area}`
          locations[key] = true
        })
      }
    })
    return Object.keys(locations).sort()
  }, [offerings])

  // Filter and sort offerings
  const filteredOfferings = useMemo(() => {
    let filtered = offerings.filter((offering) => {
      // Search text filter
      if (filters.searchText) {
        const search = filters.searchText.toLowerCase()
        const matchesProvider = (offering.provider_name || '').toLowerCase().includes(search) ||
                                (offering.provider_email || '').toLowerCase().includes(search)
        const matchesService = (offering.service?.name || '').toLowerCase().includes(search)
        const matchesLocation = Array.isArray(offering.location) && offering.location.some(
          (l) => `${l.city}, ${l.area}`.toLowerCase().includes(search)
        )
        if (!matchesProvider && !matchesService && !matchesLocation) {
          return false
        }
      }

      // Service type filter
      if (filters.serviceType && String(offering.service?.id) !== String(filters.serviceType)) {
        return false
      }

      // Location filter
      if (filters.location) {
        const hasLocation = Array.isArray(offering.location) && offering.location.some(
          (l) => `${l.city}, ${l.area}` === filters.location
        )
        if (!hasLocation) {
          return false
        }
      }

      // Experience filter
      const exp = offering.experience_year ?? 0
      if (filters.minExperience && exp < parseInt(filters.minExperience)) {
        return false
      }
      if (filters.maxExperience && exp > parseInt(filters.maxExperience)) {
        return false
      }

      // Price filter
      const price = offering.price ?? 0
      if (filters.minPrice && price < parseInt(filters.minPrice)) {
        return false
      }
      if (filters.maxPrice && price > parseInt(filters.maxPrice)) {
        return false
      }

      // Availability filter
      if (filters.availableOnly && !offering.is_available) {
        return false
      }

      return true
    })

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price_high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'experience_high':
        filtered.sort((a, b) => (b.experience_year || 0) - (a.experience_year || 0))
        break
      case 'experience_low':
        filtered.sort((a, b) => (a.experience_year || 0) - (b.experience_year || 0))
        break
      default:
        break
    }

    return filtered
  }, [offerings, filters])

  const clearAllFilters = () => {
    setFilters({
      searchText: '',
      serviceType: '',
      location: '',
      minExperience: '',
      maxExperience: '',
      minPrice: '',
      maxPrice: '',
      availableOnly: false,
      sortBy: 'relevance',
    })
    setShowAdvancedFilters(false)
  }

  const hasActiveFilters = () => {
    return filters.searchText || filters.serviceType || filters.location || 
           filters.minExperience || filters.maxExperience || 
           filters.minPrice || filters.maxPrice || filters.availableOnly
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (filters.searchText.trim()) {
      saveRecentSearch(filters.searchText.trim())
    }
    setShowSuggestions(false)
  }

  const applySuggestion = (suggestion) => {
    setFilters(prev => ({ ...prev, searchText: suggestion }))
    saveRecentSearch(suggestion)
    setShowSuggestions(false)
    searchInputRef.current?.blur()
  }

  const filterCount = Object.values(filters).filter(v => v && v !== 'relevance' && v !== false).length

  return (
    <div style={styles.container}>
      <style>{mobileStyles}</style>

      <div style={styles.decorativeBlob1} />
      <div style={styles.decorativeBlob2} />

      <Header />

      <main style={styles.mainContent}>
        {/* Hero Section */}
        <div style={styles.heroSection} className="fade-up">
          <div style={styles.heroBadge}>
            <Sparkles size={12} />
            Find Your Expert
          </div>
          <h1 style={styles.heroTitle}>Find Professional Services</h1>
          <p style={styles.heroSubtitle}>
            Connect with trusted service providers in your area
          </p>
        </div>

        {/* Search Bar */}
        <div style={styles.searchWrapper} className="fade-up fade-up-delay-1">
          <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
            <div style={styles.searchInputContainer}>
              <div className="search-row" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} style={styles.searchIcon} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by service, provider name, or location..."
                    value={filters.searchText}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
                    onFocus={() => filters.searchText.length > 1 && setShowSuggestions(true)}
                    style={styles.searchInput}
                    className="search-input input-focus"
                  />
                </div>
                <div className="action-buttons" style={styles.actionButtons}>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    style={styles.filterButton(showAdvancedFilters)}
                    className="filter-button"
                  >
                    <SlidersHorizontal size={14} />
                    <span>Filters</span>
                    {filterCount > 0 && (
                      <span style={{
                        background: '#ef4444',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '4px',
                      }}>
                        {filterCount}
                      </span>
                    )}
                  </button>
                  <button type="submit" style={styles.searchButton} className="search-button btn-hover">
                    <Search size={14} />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
                <div ref={suggestionsRef} style={styles.suggestionsDropdown}>
                  {recentSearches.length > 0 && filters.searchText.length <= 1 && (
                    <div style={styles.suggestionSection}>
                      <div style={styles.suggestionTitle}>Recent Searches</div>
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => applySuggestion(search)}
                          style={styles.suggestionItem}
                          className="suggestion-item"
                        >
                          <Clock size={14} />
                          {search}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchSuggestions.length > 0 && (
                    <div style={styles.suggestionSection}>
                      <div style={styles.suggestionTitle}>Suggestions</div>
                      {searchSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => applySuggestion(suggestion)}
                          style={styles.suggestionItem}
                          className="suggestion-item"
                        >
                          <Search size={14} />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div style={styles.advancedFiltersPanel} className="fade-up fade-up-delay-1">
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>
                <Filter size={18} color="#6366f1" />
                Advanced Filters
              </h3>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                style={{ padding: '0.25rem', cursor: 'pointer', background: 'none', border: 'none' }}
                className="close-btn"
              >
                <ChevronUp size={20} color="#94a3b8" />
              </button>
            </div>
            
            <div className="filter-grid" style={styles.filterGrid}>
              <div>
                <label style={styles.filterLabel}>Service Type</label>
                <select
                  value={filters.serviceType}
                  onChange={(e) => setFilters(p => ({ ...p, serviceType: e.target.value }))}
                  style={styles.filterSelect}
                >
                  <option value="">All Services</option>
                  {uniqueServices.map((service) => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={styles.filterLabel}>Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(p => ({ ...p, location: e.target.value }))}
                  style={styles.filterSelect}
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={styles.filterLabel}>Experience (Years)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minExperience}
                    onChange={(e) => setFilters(p => ({ ...p, minExperience: e.target.value }))}
                    style={{ ...styles.filterInput, width: '50%' }}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxExperience}
                    onChange={(e) => setFilters(p => ({ ...p, maxExperience: e.target.value }))}
                    style={{ ...styles.filterInput, width: '50%' }}
                  />
                </div>
              </div>

              <div>
                <label style={styles.filterLabel}>Price Range (PKR)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    placeholder={`Min (${priceRange.min})`}
                    value={filters.minPrice}
                    onChange={(e) => setFilters(p => ({ ...p, minPrice: e.target.value }))}
                    style={{ ...styles.filterInput, width: '50%' }}
                  />
                  <input
                    type="number"
                    placeholder={`Max (${priceRange.max})`}
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(p => ({ ...p, maxPrice: e.target.value }))}
                    style={{ ...styles.filterInput, width: '50%' }}
                  />
                </div>
              </div>
            </div>

            <div style={styles.filterActions}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={filters.availableOnly}
                  onChange={(e) => setFilters(p => ({ ...p, availableOnly: e.target.checked }))}
                />
                Available for booking only
              </label>
              
              {hasActiveFilters() && (
                <button onClick={clearAllFilters} style={styles.clearButton} className="clear-btn">
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="toolbar" style={styles.toolbar}>
          <p style={styles.resultCount}>
            Found <span style={styles.resultCountNumber}>{filteredOfferings.length}</span> services
          </p>
          
          <div className="toolbar-right" style={styles.toolbarRight}>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(p => ({ ...p, sortBy: e.target.value }))}
              style={styles.sortSelect}
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="experience_high">Experience: Most to Least</option>
              <option value="experience_low">Experience: Least to Most</option>
            </select>

            <div style={styles.viewToggle}>
              <button
                onClick={() => setViewMode('grid')}
                style={styles.viewButton(viewMode === 'grid')}
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={styles.viewButton(viewMode === 'list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <AlertCircle size={20} color="#dc2626" />
            <p style={{ fontSize: '0.875rem', color: '#b91c1c' }}>{error}</p>
          </div>
        )}

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingContent}>
              <Loader2 size={48} style={{ color: '#6366f1' }} className="spin" />
              <p style={{ color: '#64748b', marginTop: '1rem' }}>Loading services...</p>
            </div>
          </div>
        )}

        {!loading && offerings.length === 0 && (
          <div style={styles.emptyState}>
            <p style={{ color: '#64748b' }}>No services available yet.</p>
          </div>
        )}

        {!loading && offerings.length > 0 && filteredOfferings.length === 0 && (
          <div style={styles.emptyState}>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>No services match your filters. Try adjusting your search criteria.</p>
            <button onClick={clearAllFilters} style={{ ...styles.searchButton, padding: '0.5rem 1.5rem' }}>
              Clear all filters
            </button>
          </div>
        )}

        {/* Services Display */}
        {!loading && filteredOfferings.length > 0 && (
          <div className={viewMode === 'grid' ? 'services-grid' : 'services-list'} style={viewMode === 'grid' ? styles.servicesGrid : styles.servicesList}>
            {filteredOfferings.map((offering, idx) => (
              <div
                key={offering.id}
                style={styles.serviceCard(viewMode)}
                className={`card-hover ${viewMode === 'list' ? 'service-card-list' : ''}`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    {offering.service?.image ? (
                      <img
                        src={resolveMediaUrl(offering.service.image)}
                        alt={offering.service?.name || 'Service'}
                        style={styles.serviceImage}
                      />
                    ) : (
                      <div style={{ ...styles.serviceImage, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Briefcase size={32} color="#94a3b8" />
                      </div>
                    )}
                    
                    <h3 style={styles.serviceTitle}>{offering.service?.name || 'Service'}</h3>
                    <p style={styles.serviceDescription}>
                      {offering.service?.description || 'Professional service offering by a verified provider.'}
                    </p>

                    <div>
                      <p style={styles.servicePrice}>PKR {offering.price}</p>
                      
                      <div style={styles.providerInfo}>
                        {offering.provider_profile_picture ? (
                          <img
                            src={resolveMediaUrl(offering.provider_profile_picture)}
                            alt={offering.provider_name || 'Provider'}
                            style={styles.providerAvatar}
                          />
                        ) : (
                          <div style={styles.providerAvatarPlaceholder}>
                            <UserRound size={14} color="#64748b" />
                          </div>
                        )}
                        <span style={styles.providerName}>
                          {offering.provider_name || offering.provider_email || `Provider #${offering.user}`}
                        </span>
                      </div>
                      
                      <div style={styles.locationInfo}>
                        <MapPin size={14} />
                        <span>
                          {Array.isArray(offering.location) && offering.location.length > 0
                            ? offering.location.map((l) => `${l.city}, ${l.area}`).join(' | ')
                            : 'Location not specified'}
                        </span>
                      </div>
                      
                      <div style={styles.metaRow}>
                        <span style={styles.experienceBadge}>
                          <Briefcase size={12} />
                          {offering.experience_year ?? 0} years exp
                        </span>
                        <span style={styles.availabilityBadge(offering.is_available)}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: offering.is_available ? '#10b981' : '#ef4444' }} />
                          {offering.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>

                    <div style={styles.buttonGroup}>
                      <button
                        onClick={() => navigate(`/provider/${offering.user}`)}
                        style={styles.primaryButton}
                        className="btn-hover"
                      >
                        View Provider
                      </button>
                      {(() => {
                        const isOwn = currentUser && String(currentUser.id) === String(offering.user)
                        return (
                          <button
                            onClick={() => !isOwn && handleBookService(offering)}
                            disabled={isOwn}
                            style={styles.secondaryButton(isOwn)}
                          >
                            <CalendarDays size={14} />
                            {isOwn ? 'Own Service' : 'Book'}
                          </button>
                        )
                      })()}
                    </div>
                  </>
                ) : (
                  // List View
                  <>
                    {offering.service?.image ? (
                      <img
                        src={resolveMediaUrl(offering.service.image)}
                        alt={offering.service?.name || 'Service'}
                        style={styles.serviceImageList}
                        className="service-image-list"
                      />
                    ) : (
                      <div style={{ ...styles.serviceImageList, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="service-image-list">
                        <Briefcase size={24} color="#94a3b8" />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <h3 style={{ ...styles.serviceTitle, marginBottom: 0 }}>{offering.service?.name || 'Service'}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <UserRound size={12} />
                              {offering.provider_name || offering.provider_email}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={12} />
                              {Array.isArray(offering.location) && offering.location.length > 0
                                ? offering.location[0].city
                                : 'Location N/A'}
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#6366f1' }}>PKR {offering.price}</p>
                      </div>
                      <p style={{ ...styles.serviceDescription, marginTop: '0.5rem' }}>
                        {offering.service?.description || 'Professional service offering by a verified provider.'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
                          <span>Experience: {offering.experience_year ?? 0} years</span>
                          <span style={{ color: offering.is_available ? '#10b981' : '#ef4444' }}>
                            {offering.is_available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => navigate(`/provider/${offering.user}`)}
                            style={{ ...styles.primaryButton, padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            View Provider
                          </button>
                          {(() => {
                            const isOwn = currentUser && String(currentUser.id) === String(offering.user)
                            return (
                              <button
                                onClick={() => !isOwn && handleBookService(offering)}
                                disabled={isOwn}
                                style={{ ...styles.secondaryButton(isOwn), padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                              >
                                <CalendarDays size={12} />
                                {isOwn ? 'Own Service' : 'Book'}
                              </button>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {bookingOffering && (
          <div style={styles.modalOverlay} onClick={closeBookingModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <p style={styles.modalTitle}>Book Service</p>
                  <h3 style={styles.modalSubtitle}>{bookingOffering.service?.name || 'Service'}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Pick a date and time for your booking request.
                  </p>
                </div>
                <button onClick={closeBookingModal} style={styles.closeButton} className="close-btn">
                  <X size={20} color="#94a3b8" />
                </button>
              </div>

              <div style={styles.bookingInfo}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: '#0f172a' }}>
                  <CheckCircle2 size={14} color="#10b981" />
                  Provider: {bookingOffering.provider_name || bookingOffering.provider_email || `Provider #${bookingOffering.user}`}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>Price: PKR {bookingOffering.price}</p>
              </div>

              <form onSubmit={submitBooking}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Scheduled date and time</label>
                  <input
                    type="datetime-local"
                    value={bookingForm.scheduled_at}
                    onChange={(event) => setBookingForm({ scheduled_at: event.target.value })}
                    style={styles.datetimeInput}
                    min={new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 16)}
                    required
                  />
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Booking must be at least 15 minutes in the future.
                  </p>
                </div>

                <div style={styles.modalButtons}>
                  <button type="button" onClick={closeBookingModal} style={styles.modalCancelButton}>
                    Cancel
                  </button>
                  <button type="submit" disabled={bookingSubmitting} style={styles.modalConfirmButton}>
                    {bookingSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Services











