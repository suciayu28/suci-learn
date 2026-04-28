import React, { Suspense } from "react"; 
import { Routes, Route } from "react-router-dom";
import "./assets/tailwind.css";
import Loading from "./components/Loading";
// import MainLayout from "./layouts/MainLayout";
// import AuthLayout from "./layouts/AuthLayout";
//  format Lazy
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Customers = React.lazy(() => import("./pages/Customers"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const ErrorPage = React.lazy(() => import("./pages/NotFound"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));




// Import Gambar
import img400 from "./assets/400.png";
import img401 from "./assets/401.png";
import img403 from "./assets/403.png";
import img404 from "./assets/404.png";

function App() {
  return (
    
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />

          <Route
            path="/400"
            element={
              <ErrorPage
                code="400"
                title="Oops! Halaman Tidak Ditemukan"
                description="Halaman yang Anda cari tidak dapat ditemukan."
                image={img400}
              />
            }
          />
          <Route
            path="/401"
            element={
              <ErrorPage
                code="401"
                title="Akses Tidak Sah"
                description="Maaf, Anda harus masuk terlebih dahulu."
                image={img401}
              />
            }
          />
          <Route
            path="/403"
            element={
              <ErrorPage
                code="403"
                title="Akses Ditolak"
                description="Ups! Anda tidak memiliki izin."
                image={img403}
              />
            }
          />
          <Route
            path="*"
            element={
              <ErrorPage
                code="404"
                title="Page Not Found"
                description="Ups! Halaman tidak ditemukan."
                image={img404}
              />
            }
          />
        </Route>

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