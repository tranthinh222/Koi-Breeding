import { Bell, ChevronDown, Search } from "lucide-react";

interface AdminNavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  adminName: string;
  adminRole: string;
  adminEmail: string;
  adminAvatar: string;
}

export function AdminNavbar({
  searchTerm,
  onSearchChange,
  adminName,
  adminRole,
  adminEmail,
  adminAvatar,
}: AdminNavbarProps) {
  return (
    <header className="admin-navbar">
      <div className="navbar-search">
        <Search size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search dashboard, user, function..."
        />
      </div>

      <div className="navbar-actions">
        <button type="button" className="notification-button">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>
        <div className="admin-profile">
          <img src={adminAvatar} alt={adminName} />
          <div>
            <strong>{adminName}</strong>
            <span>{adminRole}</span>
            <small>{adminEmail}</small>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}