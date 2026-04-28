import Sidebar from "../components/Sidebar"; 
import Header from "../components/Header";   
import { Outlet } from "react-router-dom";

// --- IMPORT GAMBAR UNTUK ERROR PAGES ---
import img400 from "../assets/400.png";
import img401 from "../assets/401.png"; 
import img403 from "../assets/403.png"; 
import img404 from "../assets/404.png";


export default  function MainLayout(){
    return(
              <div id="app-container" className="bg-gray-100 min-h-screen flex">
        <div id="layout-wrapper" className="flex flex-row flex-1">
          <Sidebar />
          <div id="main-content" className="flex-1 p-4">
            <Header />

            <Outlet>
             
            </Outlet>
          </div>
        </div>
      </div>
    )
}