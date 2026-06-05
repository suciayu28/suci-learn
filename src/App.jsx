import React, { Suspense } from "react"; 
import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/tailwind.css";
import Loading from "./components/Loading";

// --- LAZY LOADING PAGES ---

// Showcase (Landing Page Utama)
const LumiereShowcase = React.lazy(() => import("./pages/LumiereShowcase"));

// Admin & Core Pages (Masing-masing panggil file yang benar)
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Customers = React.lazy(() => import("./pages/Customers"));
const CustomersDetail = React.lazy(() => import("./pages/CustomersDetail"));
const Orders = React.lazy(() => import("./pages/Orders"));
const OrderDetail = React.lazy(() => import("./pages/OrdersDetail"));
const OrderHistory = React.lazy(() => import("./pages/OrderHistory"));

// Auth Pages
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

// Error & Layouts
const ErrorPage = React.lazy(() => import("./pages/NotFound"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout.jsx"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout.jsx"));

// Assets
import img404 from "./assets/404.png";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        
        {/* 1. PUBLIC AREA: Halaman Showcase dipindah ke "/welcome" agar root "/" bisa dipakai Dashboard */}
        <Route path="/welcome" element={<LumiereShowcase />} />

        {/* 2. ADMIN & USER HISTORY AREA: Dibungkus MainLayout (Ada Sidebar) */}
        <Route element={<MainLayout />}>
          {/* PERBAIKAN: Mengubah path dari "/dashboard" menjadi "/" agar langsung terbuka saat aplikasi dijalankan */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Mengarahkan sisa traffic lama /dashboard ke root "/" agar tidak patah/error */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          
          {/* Implementasi Modul 10 & History */}
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/atelier-lab" element={<LumiereShowcase />} /> 
          
          {/* Orders Management */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          
          {/* Customers Management */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomersDetail />} />

          {/* Fallback 404 (Di dalam MainLayout) */}
          <Route
            path="*"
            element={
              <ErrorPage
                code="404"
                title="Look Not Found"
                description="Halaman tidak ditemukan di dalam sistem."
                image={img404}
              />
            }
          />
        </Route>

        {/* 3. AUTH AREA: Menggunakan AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

      </Routes>
    </Suspense>
  );
}

export default App;