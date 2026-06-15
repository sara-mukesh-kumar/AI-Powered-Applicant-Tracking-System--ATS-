import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar"; // 1. Navbar ko import kiya

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="flex min-h-screen w-full">
        {/* Sidebar Left Side pe rahega */}
        <aside className="shrink-0">
          <AdminSidebar />
        </aside>

        {/* Right Side full container (Navbar + Content) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          
          {/* 2. Navbar top par chipka rahega */}
          <AdminNavbar />

          {/* 3. Main Content thoda padding ke saath niche aayega */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
}