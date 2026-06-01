import { Navigate, Route, Routes } from "react-router-dom";
import AboutPage from "@/pages/public/Aboutus";
import { Contactus as ContactPage } from "@/pages/public/Contactus";
import { Login as LoginPage } from "@/pages/public/Login";
import RegisterPage from "@/pages/public/Register";
import { ForgotPassword as ForgotPasswordPage } from "@/pages/public/ForgotPassword";
import { Home as HomePage } from "@/pages/public/Home";
import { Services as ServicesListPage } from "@/pages/public/Services";
import ProviderProfilePage from "@/pages/public/ProviderProfile";
import ProfilePage from "@/pages/private/Profile";
import BookingsPage from "@/pages/private/Bookings";
import ReviewPage from "@/pages/private/ReviewPage";
import CreateServicePage from "@/pages/CreateServicePage";
import MyOfferingsPage from "@/pages/private/MyOfferings";
import LocationsPage from "@/pages/admin/LocationsPage";
import ServicesPage from "@/pages/admin/ServicesPage";
import { useAuth } from "@/context/AuthContext";
import { ToastContainer } from "@/components/ToastContainer";
import "./App.css";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/services" element={<ServicesListPage />} />
      <Route path="/provider/:providerId" element={<ProviderProfilePage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review/:bookingId"
        element={
          <ProtectedRoute>
            <ReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-service"
        element={
          <ProtectedRoute>
            <CreateServicePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-offerings"
        element={
          <ProtectedRoute>
            <MyOfferingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/locations"
        element={
          <AdminRoute>
            <LocationsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <AdminRoute>
            <ServicesPage />
          </AdminRoute>
        }
      />
      <Route path="/aboutus" element={<AboutPage />} />
      <Route path="/contactus" element={<ContactPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
