import {
  Fish,
  LayoutDashboard,
  Users,
  Package,
  Settings,
  UserCircle2,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MenuTab, OtherTab } from "../Admin";
import { logoutRequest } from "../../../api/auth";
import { useNavigate } from "react-router-dom";

type AdminView = MenuTab | OtherTab;

const menuItems: Array<{ id: MenuTab; label: string; icon: LucideIcon }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "breeding", label: "Breeding", icon: Fish },
  { id: "items", label: "Items", icon: Package },
];

const otherItems: Array<{ id: OtherTab; label: string; icon: LucideIcon }> = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "account", label: "Account", icon: UserCircle2 },
];

interface AdminSidebarProps {
  activeView: AdminView;
  onSelectView: (view: AdminView) => void;
}

export function AdminSidebar({ activeView, onSelectView }: AdminSidebarProps) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutRequest();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Fish size={22} />
        </div>
        <div>
          <div className="sidebar-brand-title">KOI ADMIN</div>
          <div className="sidebar-brand-subtitle">Control center</div>
        </div>
      </div>

      <div className="sidebar-group">
        <div className="sidebar-group-label">MENU</div>
        <div className="sidebar-group-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`sidebar-item ${isActive ? "is-active" : ""}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-group">
        <div className="sidebar-group-label">OTHER</div>
        <div className="sidebar-group-list">
          {otherItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`sidebar-item ${isActive ? "is-active" : ""}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
