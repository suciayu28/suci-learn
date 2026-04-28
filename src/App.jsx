import React, { Suspense } from "react"; 
import { Routes, Route } from "react-router-dom";
import "./assets/tailwind.css";
import Loading from "./components/Loading";

// Format Lazy tetap dipertahankan sesuai struktur aslimu
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Customers = React.lazy(() => import("./pages/Customers"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const ErrorPage = React.lazy(() => import("./pages/NotFound"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));

// Import Gambar Assets
import img400 from "./assets/400.png";
import img401 from "./assets/401.png";
import img403 from "./assets/403.png";
import img404 from "./assets/404.png";

function App() {
  return (
    // Loading spinner akan muncul saat transisi antar halaman kosmetik
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* MainLayout: Area Admin Toko Make Up */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />

          <Route
            path="*"
            element={
              <ErrorPage
                code="404"
                title="Look Not Found"
                description="Halaman yang kamu cari sudah 'sold out' atau dipindahkan."
                image={img404}
              />
            }
          />
        </Route>

        {/* AuthLayout: Login/Register dengan nuansa Rose/Pink */}
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