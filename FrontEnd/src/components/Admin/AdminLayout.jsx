import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  // Mobile responsive sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col md:flex-row">
      
      {/* 1. DESKTOP SIDEBAR: Large screens par hamesha dikhega (md breakpoint se upar) */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen">
        <AdminSidebar />
      </aside>

      {/* 2. MOBILE DRAWER SIDEBAR: Small screens par toggle state par render hoga */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Black Transparent Backdrop Overlay - Tap outside to close panel */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
          
          {/* Sidebar Drawer Container Wrapper */}
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-gray-950 animate-slide-in">
            {/* Close Cross Trigger Button */}
            <div className="absolute top-2 right-2 pt-2 pr-2">
              <button
                type="button"
                className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                ✕
              </button>
            </div>
            {/* Actual Sidebar Content Inject Template */}
            <AdminSidebar closeMobileMenu={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Right Side Main Viewport Container (Navbar + Dynamic Body Views) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Navbar with embedded mobile hamburger activation switch trigger */}
        <AdminNavbar onMenuToggle={() => setIsMobileSidebarOpen(true)} />

        {/* Dynamic Nested Route Content Placement Wrapper */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
        
      </div>
    </div>
  );
}