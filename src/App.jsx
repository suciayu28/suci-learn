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

// New CRM Pages
const Membership = React.lazy(() => import("./pages/Membership"));
const Feedback = React.lazy(() => import("./pages/Feedback"));
const Marketing = React.lazy(() => import("./pages/Marketing"));
const AdminCatalog = React.lazy(() => import("./pages/AdminCatalog"));
const PromoSales = React.lazy(() => import("./pages/PromoSales")); // 1. LAZY IMPORT UNTUK PROMO & SALES

// Lazy Import untuk Halaman ManageUsers Baru
const ManageUsers = React.lazy(() => import("./pages/admin/ManageUsers"));

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
        
        {/* 1. PUBLIC AREA: Halaman Showcase dipasang kembali ke root "/" */}
        <Route path="/" element={<LumiereShowcase />} />
        <Route path="/welcome" element={<Navigate to="/" replace />} />

        {/* 2. ADMIN & USER HISTORY AREA: Dibungkus MainLayout (Ada Sidebar) */}
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Navigate to="/admin" replace />} />
          
          {/* Implementasi Modul 10 & History */}
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="atelier-lab" element={<LumiereShowcase />} /> 
          
          {/* Orders Management */}
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          
          {/* Customers Management */}
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomersDetail />} />

          {/* Membership Management */}
          <Route path="membership" element={<Membership />} />

          {/* Feedback & Review */}
          <Route path="feedback" element={<Feedback />} />

          {/* Marketing & Engagement */}
          <Route path="marketing" element={<Marketing />} />

          {/* --- 2. ADDED ROUTE: Promo & Sales --- */}
          <Route path="promo" element={<PromoSales />} />

          {/* Catalog Management */}
          <Route path="catalog" element={<AdminCatalog />} />

          {/* Rute Navigasi Menu Notes untuk ManageUsers */}
          <Route path="notes" element={<ManageUsers />} />

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

        {/* 3. CORE AUTHENTICATION AREA (FULL SPLIT SCREEN) */}
        {/* Mengeluarkan halaman auth ke tingkat atas bebas agar simetris penuh monitor */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />

      </Routes>
    </Suspense>
  );
}

export default App;