import React, { Suspense } from "react"; 
import { Routes, Route } from "react-router-dom";
import "./assets/tailwind.css";
import Loading from "./components/Loading";

// --- LAZY LOADING PAGES ---

// Admin & Core Pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Customers = React.lazy(() => import("./pages/Customers"));
const CustomersDetail = React.lazy(() => import("./pages/CustomersDetail"));
const Orders = React.lazy(() => import("./pages/Orders"));
const OrderDetail = React.lazy(() => import("./pages/OrdersDetail"));

// Auth Pages
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

// Modul 10: Lumière Showcase (Ganti dari AtelierLaboratory)
const LumiereShowcase = React.lazy(() => import("./pages/LumiereShowcase"));

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
        
        {/* AREA GUEST: Menggunakan Showcase sebagai halaman utama tamu */}
        <Route path="/welcome" element={<LumiereShowcase />} />

        {/* AREA ADMIN: Menggunakan MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          
          {/* IMPLEMENTASI MODUL 10: Sekarang panggil Showcase di sini juga boleh atau hapus saja lab-nya */}
          <Route path="/atelier-lab" element={<LumiereShowcase />} />
          
          {/* Orders Management */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          
          {/* Customers Management */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomersDetail />} />

          {/* Fallback 404 Inside MainLayout */}
          <Route
            path="*"
            element={
              <ErrorPage
                code="404"
                title="Look Not Found"
                description="Halaman yang kamu cari sudah 'sold out' atau dipindahkan dari katalog kami."
                image={img404}
              />
            }
          />
        </Route>

        {/* AREA AUTH: Menggunakan AuthLayout */}
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