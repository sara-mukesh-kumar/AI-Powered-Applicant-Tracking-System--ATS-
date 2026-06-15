import { useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BriefcaseIcon,
  ChartBarSquareIcon,
  DocumentArrowUpIcon,
  HomeIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", path: "/applicant/dashboard", icon: HomeIcon },
  { label: "Find Jobs", path: "/applicant/joblisting", icon: BriefcaseIcon },
  { label: "Tracking", path: "/applicant/jobDetails", icon: ChartBarSquareIcon },
  { label: "Resume", path: "/applicant/resumeupload", icon: DocumentArrowUpIcon },
  { label: "Profile", path: "/applicant/profile", icon: UserCircleIcon },
];

function NavigationLinks({ location, onNavigate }) {
  return (
    <ul className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();

        return (
          <li key={item.label}>
            <button
              aria-current={isActive ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                isActive
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => onNavigate(item.path)}
              type="button"
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ApplicantNavbar({ section = "Applicant Portal", title = "ATS Portal", description }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white shadow-lg lg:block">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-8 py-5">
          <button
            className="min-w-0 text-left"
            onClick={() => navigate("/applicant/dashboard")}
            type="button"
          >
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-200">
              {section}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-1 max-w-xl text-sm text-blue-100">{description}</p>
            )}
          </button>

          <ul className="flex shrink-0 flex-wrap gap-2 text-sm font-semibold">
            {navigationItems.map((item) => {
              const isActive =
                location.pathname.toLowerCase() === item.path.toLowerCase();

              return (
                <li key={item.label}>
                  <button
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-full px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-white/70 ${
                      isActive
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-blue-50 hover:bg-white/15"
                    }`}
                    onClick={() => navigate(item.path)}
                    type="button"
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                className="rounded-full border border-white/30 px-4 py-2 text-blue-50 transition hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-white/70"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button className="flex min-w-0 items-center gap-3 text-left" onClick={() => navigate("/applicant/dashboard")} type="button">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
              ATS
            </span>
            <span className="min-w-0">
                <span className="block truncate text-xs font-bold uppercase tracking-wider text-blue-600">{section}</span>
              <span className="block truncate font-bold text-slate-900">{title}</span>
            </span>
          </button>
          <button
            aria-expanded={menuOpen}
            aria-label="Open applicant navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            onClick={() => setMenuOpen(true)}
            type="button"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close applicant navigation"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            type="button"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col bg-gradient-to-b from-blue-700 via-indigo-800 to-slate-950 p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <button
                className="flex items-center gap-3 text-left"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/applicant/dashboard");
                }}
                type="button"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-black text-blue-700">
                  ATS
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-blue-200">Applicant</span>
                  <span className="block font-bold">Career Portal</span>
                </span>
              </button>
              <button
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
                onClick={() => setMenuOpen(false)}
                type="button"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-8">
              <NavigationLinks
                location={location}
                onNavigate={(path) => {
                  setMenuOpen(false);
                  navigate(path);
                }}
              />
            </div>

            <div className="mt-auto space-y-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">{section}</p>
                <p className="mt-1 font-bold">{title}</p>
                {description && <p className="mt-2 text-xs leading-5 text-blue-100">{description}</p>}
              </div>
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-700"
                onClick={handleLogout}
                type="button"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default ApplicantNavbar;
