import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Upload,
  History,
  BarChart3,
  User,
  Settings,
  LogOut,
  FolderSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Upload Files", icon: Upload, path: "/upload" },
  { label: "History", icon: History, path: "/history" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <FolderSearch className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold text-sidebar-accent-foreground text-sm">
            Semantic<span className="text-primary">File</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4", active && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
