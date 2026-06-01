// import { useState, useEffect } from "react";
// import { api, resolveMediaUrl } from "@/services/api";
// import { useNavigate } from "react-router-dom";
// import { Header } from "@/pages/public/Header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Check, AlertCircle } from "lucide-react";
// import { useToast } from "@/context/ToastContext";

// export default function CreateServicePage() {
//   const navigate = useNavigate();
//   const { addToast } = useToast();
//   const [services, setServices] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [selectedService, setSelectedService] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     service_id: "",
//     location_ids: [],
//     price: "",
//     experience_year: "",
//     is_available: true,
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const [servicesData, locationsData, profileData] = await Promise.all([
//         api.service.list(),
//         api.helper.locationList(),
//         api.profile.current(),
//       ]);
//       // Handle both array and paginated responses
//       const allServices = Array.isArray(servicesData) ? servicesData : servicesData?.results || [];
//       const locations = Array.isArray(locationsData) ? locationsData : locationsData?.results || [];
//       const existingHelperServices = Array.isArray(profileData?.service) ? profileData.service : [];
//       const existingServiceIds = new Set(
//         existingHelperServices
//           .map((helperService) => helperService?.service?.id)
//           .filter(Boolean)
//       );
//       const services = allServices.filter((service) => !existingServiceIds.has(service.id));

//       setServices(services);
//       setLocations(locations);
//       setSelectedService((current) => {
//         if (!current) return null;
//         return services.find((service) => service.id === current.id) || null;
//       });
//     } catch (err) {
//       const message = err?.payload?.detail || "Failed to load services, locations, and profile data";
//       setError(message);
//       addToast(message, "error");
//       setServices([]);
//       setLocations([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name === "service_id") {
//       const matchedService = services.find((service) => String(service.id) === value) || null;
//       setSelectedService(matchedService);
//     }
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleLocationToggle = (locationId) => {
//     setFormData((prev) => ({
//       ...prev,
//       location_ids: prev.location_ids.includes(locationId)
//         ? prev.location_ids.filter((id) => id !== locationId)
//         : [...prev.location_ids, locationId],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     // Validation
//     if (!formData.service_id) {
//       const message = "Please select a service";
//       setError(message);
//       addToast(message, "error");
//       return;
//     }
//     if (formData.location_ids.length === 0) {
//       const message = "Please select at least one location";
//       setError(message);
//       addToast(message, "error");
//       return;
//     }
//     if (!formData.price || parseFloat(formData.price) <= 0) {
//       const message = "Please enter a valid price";
//       setError(message);
//       addToast(message, "error");
//       return;
//     }
//     if (!formData.experience_year || parseInt(formData.experience_year) < 0) {
//       const message = "Please enter valid years of experience";
//       setError(message);
//       addToast(message, "error");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       await api.helper.helperServiceCreate({
//         service_id: parseInt(formData.service_id),
//         location_id: formData.location_ids,
//         price: parseFloat(formData.price),
//         experience_year: parseInt(formData.experience_year),
//         is_available: formData.is_available,
//       });
//       setMessage("✓ Service created successfully!");
//       setSelectedService(null);
//       setFormData({
//         service_id: "",
//         location_ids: [],
//         price: "",
//         experience_year: "",
//         is_available: true,
//       });
//       addToast("Service created successfully!", "success");
//       setTimeout(() => {
//         navigate("/services");
//       }, 1500);
//     } catch (err) {
//       const message = err?.payload?.detail || JSON.stringify(err?.payload || {}) || "Failed to create service";
//       setError(message);
//       addToast(message, "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <h1 className="text-3xl font-bold text-zinc-900">Create Service</h1>
//         <div className="flex justify-center items-center h-96">
//           <div className="animate-spin">
//             <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Header />
//       <div className="space-y-6 pb-8 max-w-2xl mx-auto px-4">
//       <div>
//         <h1 className="text-3xl font-bold text-zinc-900">Create Your Service</h1>
//         <p className="text-zinc-600 mt-2">Define your service offering and availability</p>
//       </div>

//       {message && (
//         <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3">
//           <Check className="w-5 h-5 text-emerald-600" />
//           <p className="text-sm text-emerald-700">{message}</p>
//         </div>
//       )}

//       {error && (
//         <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
//           <AlertCircle className="w-5 h-5 text-red-600" />
//           <p className="text-sm text-red-700">{error}</p>
//         </div>
//       )}

//       <Card>
//         <CardHeader>
//           <CardTitle>Service Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Service Selection */}
//             <div>
//               <Label htmlFor="service_id" className="block mb-2 font-medium">
//                 Select Service Type *
//               </Label>
//               <select
//                 id="service_id"
//                 name="service_id"
//                 value={formData.service_id}
//                 onChange={handleChange}
//                 className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               >
//                 <option value="">-- Choose a service --</option>
//                 {services.length === 0 && (
//                   <option value="" disabled>
//                     No service types available
//                   </option>
//                 )}
//                 {services.map((service) => (
//                   <option key={service.id} value={service.id}>
//                     {service.name}
//                   </option>
//                 ))}
//               </select>
//               <p className="text-xs text-zinc-500 mt-1">
//                 Can't find your service? Contact admin to add it.
//               </p>
//               {services.length === 0 && (
//                 <p className="mt-2 text-xs text-amber-600">
//                   You already have helper services for all available service types.
//                 </p>
//               )}
//             </div>

//             {selectedService && (
//               <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
//                 {selectedService.image ? (
//                   <img
//                     src={resolveMediaUrl(selectedService.image)}
//                     alt={selectedService.name}
//                     className="h-48 w-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-48 items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-200 text-zinc-500">
//                     No service image uploaded yet
//                   </div>
//                 )}
//                 <div className="p-4">
//                   <p className="text-sm font-semibold text-zinc-900">{selectedService.name}</p>
//                   {selectedService.description && (
//                     <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3">
//                       <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
//                         Service Description
//                       </p>
//                       <p className="mt-1 text-sm text-zinc-700">{selectedService.description}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Location Selection */}
//             <div>
//               <Label className="block mb-3 font-medium">Select Operating Locations *</Label>
//               {locations.length === 0 ? (
//                 <p className="text-sm text-red-600">
//                   No locations available. Ask admin to add locations first.
//                 </p>
//               ) : (
//                 <div className="grid grid-cols-2 gap-3">
//                   {locations.map((location) => (
//                     <label
//                       key={location.id}
//                       className="flex items-center gap-2 p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={formData.location_ids.includes(location.id)}
//                         onChange={() => handleLocationToggle(location.id)}
//                         className="w-4 h-4"
//                       />
//                       <span className="text-sm text-zinc-900">
//                         {location.city}, {location.area}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Price */}
//             <div>
//               <Label htmlFor="price" className="block mb-2 font-medium">
//                 Price (PKR) *
//               </Label>
//               <Input
//                 id="price"
//                 name="price"
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 placeholder="e.g., 5000"
//                 value={formData.price}
//                 onChange={handleChange}
//                 required
//               />
//               <p className="text-xs text-zinc-500 mt-1">Enter your service rate in Pakistani Rupees</p>
//             </div>

//             {/* Experience */}
//             <div>
//               <Label htmlFor="experience_year" className="block mb-2 font-medium">
//                 Years of Experience *
//               </Label>
//               <Input
//                 id="experience_year"
//                 name="experience_year"
//                 type="number"
//                 min="0"
//                 placeholder="e.g., 5"
//                 value={formData.experience_year}
//                 onChange={handleChange}
//                 required
//               />
//               <p className="text-xs text-zinc-500 mt-1">How many years have you been doing this service?</p>
//             </div>

//             {/* Availability */}
//             <div>
//               <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-zinc-50">
//                 <input
//                   type="checkbox"
//                   name="is_available"
//                   checked={formData.is_available}
//                   onChange={handleChange}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium text-zinc-900">
//                   I am available to accept jobs
//                 </span>
//               </label>
//             </div>

//             {/* Submit */}
//             <Button
//               type="submit"
//               disabled={submitting}
//               className="w-full h-10"
//             >
//               {submitting ? "Creating Service..." : "Create Service"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   </div>
//   );
// }





import { useState, useEffect } from "react";
import { api, resolveMediaUrl } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Header } from "@/pages/public/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, AlertCircle, Sparkles, MapPin, Briefcase, DollarSign, Clock, Wrench } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function CreateServicePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    service_id: "",
    location_ids: [],
    price: "",
    experience_year: "",
    is_available: true,
  });

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
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'clamp(1rem, 4vw, 2rem)',
    },
    heroSection: {
      textAlign: 'center',
      marginBottom: 'clamp(1.5rem, 5vw, 2rem)',
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
      fontSize: 'clamp(1.5rem, 5vw, 2rem)',
      fontWeight: 700,
      color: '#0f172a',
      letterSpacing: '-0.03em',
      margin: 0,
    },
    heroSubtitle: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      color: '#64748b',
      marginTop: '0.5rem',
    },
    messageSuccess: {
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '16px',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem',
    },
    messageError: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '16px',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem',
    },
    card: {
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: 'clamp(1rem, 4vw, 1.5rem)',
      borderBottom: '1px solid #e2e8f0',
    },
    cardTitle: {
      fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
      fontWeight: 600,
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    cardContent: {
      padding: 'clamp(1rem, 4vw, 1.5rem)',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#475569',
      marginBottom: '0.5rem',
    },
    select: {
      width: '100%',
      padding: '0.625rem 0.75rem',
      borderRadius: '12px',
      border: '1.5px solid #e2e8f0',
      fontSize: '0.875rem',
      fontFamily: "'DM Sans', sans-serif",
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      background: '#fff',
    },
    helperText: {
      fontSize: '0.7rem',
      color: '#94a3b8',
      marginTop: '0.25rem',
    },
    warningText: {
      fontSize: '0.7rem',
      color: '#d97706',
      marginTop: '0.25rem',
    },
    servicePreview: {
      overflow: 'hidden',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      background: '#f8fafc',
      marginBottom: '1.5rem',
    },
    serviceImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
    },
    serviceImagePlaceholder: {
      width: '100%',
      height: '200px',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      fontSize: '0.875rem',
    },
    serviceInfo: {
      padding: '1rem',
    },
    serviceName: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: '0.5rem',
    },
    descriptionBox: {
      marginTop: '0.75rem',
      padding: '0.75rem',
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    },
    descriptionLabel: {
      fontSize: '0.7rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#64748b',
      marginBottom: '0.25rem',
    },
    descriptionText: {
      fontSize: '0.875rem',
      color: '#475569',
      lineHeight: 1.5,
      margin: 0,
    },
    locationsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '0.75rem',
      marginTop: '0.5rem',
    },
    locationCheckbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 0.875rem',
      border: '1.5px solid #e2e8f0',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    input: {
      width: '100%',
      padding: '0.625rem 0.75rem',
      borderRadius: '12px',
      border: '1.5px solid #e2e8f0',
      fontSize: '0.875rem',
      fontFamily: "'DM Sans', sans-serif",
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    availabilityCheckbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      border: '1.5px solid #e2e8f0',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    submitButton: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '40px',
      border: 'none',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      color: '#fff',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.2s',
    },
    submitButtonDisabled: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '40px',
      border: 'none',
      background: '#94a3b8',
      color: '#fff',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'not-allowed',
      opacity: 0.6,
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #e2e8f0',
      borderTopColor: '#6366f1',
      borderRadius: '50%',
    },
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [servicesData, locationsData, profileData] = await Promise.all([
        api.service.list(),
        api.helper.locationList(),
        api.profile.current(),
      ]);
      const allServices = Array.isArray(servicesData) ? servicesData : servicesData?.results || [];
      const locations = Array.isArray(locationsData) ? locationsData : locationsData?.results || [];
      const existingHelperServices = Array.isArray(profileData?.service) ? profileData.service : [];
      const existingServiceIds = new Set(
        existingHelperServices
          .map((helperService) => helperService?.service?.id)
          .filter(Boolean)
      );
      const services = allServices.filter((service) => !existingServiceIds.has(service.id));

      setServices(services);
      setLocations(locations);
      setSelectedService((current) => {
        if (!current) return null;
        return services.find((service) => service.id === current.id) || null;
      });
    } catch (err) {
      const message = err?.payload?.detail || "Failed to load services, locations, and profile data";
      setError(message);
      addToast(message, "error");
      setServices([]);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "service_id") {
      const matchedService = services.find((service) => String(service.id) === value) || null;
      setSelectedService(matchedService);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLocationToggle = (locationId) => {
    setFormData((prev) => ({
      ...prev,
      location_ids: prev.location_ids.includes(locationId)
        ? prev.location_ids.filter((id) => id !== locationId)
        : [...prev.location_ids, locationId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!formData.service_id) {
      const message = "Please select a service";
      setError(message);
      addToast(message, "error");
      return;
    }
    if (formData.location_ids.length === 0) {
      const message = "Please select at least one location";
      setError(message);
      addToast(message, "error");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      const message = "Please enter a valid price";
      setError(message);
      addToast(message, "error");
      return;
    }
    if (!formData.experience_year || parseInt(formData.experience_year) < 0) {
      const message = "Please enter valid years of experience";
      setError(message);
      addToast(message, "error");
      return;
    }

    setSubmitting(true);
    try {
      await api.helper.helperServiceCreate({
        service_id: parseInt(formData.service_id),
        location_id: formData.location_ids,
        price: parseFloat(formData.price),
        experience_year: parseInt(formData.experience_year),
        is_available: formData.is_available,
      });
      setMessage("✓ Service created successfully!");
      setSelectedService(null);
      setFormData({
        service_id: "",
        location_ids: [],
        price: "",
        experience_year: "",
        is_available: true,
      });
      addToast("Service created successfully!", "success");
      setTimeout(() => {
        navigate("/services");
      }, 1500);
    } catch (err) {
      const message = err?.payload?.detail || JSON.stringify(err?.payload || {}) || "Failed to create service";
      setError(message);
      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={styles.container}>
          <div style={styles.decorativeBlob1} />
          <div style={styles.decorativeBlob2} />
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} className="spin" />
          </div>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin {
            animation: spin 1s linear infinite;
          }
          .input-focus:focus {
            border-color: #6366f1 !important;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important;
          }
          .checkbox-hover:hover {
            background: #f8fafc !important;
            border-color: #6366f1 !important;
          }
          .btn-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-up {
            animation: fadeInUp 0.5s ease both;
          }
          .fade-up-delay-1 { animation-delay: 0.1s; }
          .fade-up-delay-2 { animation-delay: 0.2s; }
          @media (max-width: 640px) {
            .locations-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={styles.container}>
        <div style={styles.decorativeBlob1} />
        <div style={styles.decorativeBlob2} />

        <div style={styles.mainContent}>
          {/* Hero Section */}
          <div style={styles.heroSection} className="fade-up">
            <div style={styles.heroBadge}>
              <Sparkles size={12} />
              Create Service
            </div>
            <h1 style={styles.heroTitle}>Create Your Service</h1>
            <p style={styles.heroSubtitle}>Define your service offering and availability</p>
          </div>

          {/* Success Message */}
          {message && (
            <div style={styles.messageSuccess} className="fade-up fade-up-delay-1">
              <Check size={20} color="#059669" />
              <p style={{ fontSize: '0.875rem', color: '#065f46', margin: 0 }}>{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={styles.messageError} className="fade-up fade-up-delay-1">
              <AlertCircle size={20} color="#dc2626" />
              <p style={{ fontSize: '0.875rem', color: '#991b1b', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Main Form Card */}
          <div style={styles.card} className="fade-up fade-up-delay-2">
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <Wrench size={20} color="#6366f1" />
                Service Details
              </div>
            </div>
            <div style={styles.cardContent}>
              <form onSubmit={handleSubmit}>
                {/* Service Selection */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Service Type *</label>
                  <select
                    id="service_id"
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleChange}
                    style={styles.select}
                    className="input-focus"
                    required
                  >
                    <option value="">-- Choose a service --</option>
                    {services.length === 0 && (
                      <option value="" disabled>
                        No service types available
                      </option>
                    )}
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <p style={styles.helperText}>
                    Can't find your service? Contact admin to add it.
                  </p>
                  {services.length === 0 && (
                    <p style={styles.warningText}>
                      You already have helper services for all available service types.
                    </p>
                  )}
                </div>

                {/* Service Preview */}
                {selectedService && (
                  <div style={styles.servicePreview}>
                    {selectedService.image ? (
                      <img
                        src={resolveMediaUrl(selectedService.image)}
                        alt={selectedService.name}
                        style={styles.serviceImage}
                      />
                    ) : (
                      <div style={styles.serviceImagePlaceholder}>
                        No service image uploaded yet
                      </div>
                    )}
                    <div style={styles.serviceInfo}>
                      <p style={styles.serviceName}>{selectedService.name}</p>
                      {selectedService.description && (
                        <div style={styles.descriptionBox}>
                          <p style={styles.descriptionLabel}>Service Description</p>
                          <p style={styles.descriptionText}>{selectedService.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Location Selection */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Operating Locations *</label>
                  {locations.length === 0 ? (
                    <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>
                      No locations available. Ask admin to add locations first.
                    </p>
                  ) : (
                    <div className="locations-grid" style={styles.locationsGrid}>
                      {locations.map((location) => (
                        <label
                          key={location.id}
                          style={styles.locationCheckbox}
                          className="checkbox-hover"
                        >
                          <input
                            type="checkbox"
                            checked={formData.location_ids.includes(location.id)}
                            onChange={() => handleLocationToggle(location.id)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                            <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {location.city}, {location.area}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <DollarSign size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Price (PKR) *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 5000"
                    value={formData.price}
                    onChange={handleChange}
                    style={styles.input}
                    className="input-focus"
                    required
                  />
                  <p style={styles.helperText}>Enter your service rate in Pakistani Rupees</p>
                </div>

                {/* Experience */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Briefcase size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Years of Experience *
                  </label>
                  <input
                    id="experience_year"
                    name="experience_year"
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    value={formData.experience_year}
                    onChange={handleChange}
                    style={styles.input}
                    className="input-focus"
                    required
                  />
                  <p style={styles.helperText}>How many years have you been doing this service?</p>
                </div>

                {/* Availability */}
                <div style={styles.formGroup}>
                  <label style={styles.locationCheckbox} className="checkbox-hover">
                    <input
                      type="checkbox"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleChange}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      I am available to accept jobs
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={submitting ? styles.submitButtonDisabled : styles.submitButton}
                  className="btn-hover"
                >
                  {submitting ? "Creating Service..." : "Create Service"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&display=swap');
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        .input-focus:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important;
        }
        
        .checkbox-hover:hover {
          background: #f8fafc !important;
          border-color: #6366f1 !important;
        }
        
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-up {
          animation: fadeInUp 0.5s ease both;
        }
        .fade-up-delay-1 { animation-delay: 0.1s; }
        .fade-up-delay-2 { animation-delay: 0.2s; }
        
        @media (max-width: 640px) {
          .locations-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}