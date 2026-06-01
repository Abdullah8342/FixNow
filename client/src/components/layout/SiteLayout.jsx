import { Link, NavLink, Outlet } from "react-router-dom";
import { PhoneCall, UserCircle, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useState, useEffect } from "react";

const links = [
  { to: "/profile", label: "Profile" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function SiteLayout() {
  const { isAuthenticated, logout } = useAuth();
  const [role, setRole] = useState("");
  const [visibleLinks, setVisibleLinks] = useState(links);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      if (!isAuthenticated) {
        setRole("");
        setVisibleLinks(links.filter((l) => l.to !== "/profile"));
        return;
      }
      try {
        const p = await api.profile.current();
        if (!mounted) return;
        setRole(p.roll || "");
        setVisibleLinks(links);
      } catch (e) {
        setVisibleLinks(links.filter((l) => l.to !== "/profile"));
      }
    };
    loadProfile();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_30%_10%,#d8f1ef_0%,#f7f4e8_45%,#f2f4f8_100%)]">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/85 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 md:px-8">
          <Link to="/about" className="text-xl font-bold text-zinc-900">
            FixNow
          </Link>

          <nav className="flex items-center justify-center gap-1">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm ${isActive ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button size="sm" variant="outline">
                    <UserCircle className="h-4 w-4" /> Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            ) : (
              <>
                {/* Admin Menu */}
                {role === "A" && (
                  <div className="flex gap-2 mr-2 border-r border-zinc-200 pr-2">
                    <Link to="/admin/locations">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Settings className="w-4 h-4" />
                        Locations
                      </Button>
                    </Link>
                    <Link to="/admin/services">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Settings className="w-4 h-4" />
                        Services
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Service Provider Menu */}
                {role === "SP" && (
                  <div className="flex gap-2 mr-2 border-r border-zinc-200 pr-2">
                    <Link to="/create-service">
                      <Button size="sm" variant="outline">
                        Create Service
                      </Button>
                    </Link>
                  </div>
                )}

                <Link to="/profile" aria-label="Profile">
                  <Button size="icon" variant="outline" className="rounded-full">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </Link>
                <Button size="sm" variant="outline" onClick={logout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-200 bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-sm text-zinc-600 md:px-8">
          <span>FixNow Frontend</span>
          <span className="flex items-center gap-1">
            <PhoneCall className="h-4 w-4" /> +92 300 0000000
          </span>
        </div>
      </footer>
    </div>
  );
}
