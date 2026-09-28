import { RotateCcw, Search } from "lucide-react";
import type { AdminUserFilters } from "../../../api/admin";

export const defaultUserFilters: AdminUserFilters = {
    search: "", gender: "", role: "", status: "", location: "", sort: "createdAt,desc",
};

const locations = [
    ["HANOI", "Ha Noi"], ["HO_CHI_MINH_CITY", "Ho Chi Minh City"],
    ["DA_NANG", "Da Nang"], ["HAI_PHONG", "Hai Phong"], ["CAN_THO", "Can Tho"],
    ["HUE", "Hue"], ["NHA_TRANG", "Nha Trang"], ["DA_LAT", "Da Lat"],
    ["VUNG_TAU", "Vung Tau"], ["BIEN_HOA", "Bien Hoa"], ["QUY_NHON", "Quy Nhon"],
    ["BUON_MA_THUOT", "Buon Ma Thuot"],
];

interface Props {
    filters: AdminUserFilters;
    search: string;
    canManageAdmins: boolean;
    onSearchChange: (search: string) => void;
    onChange: (filters: AdminUserFilters) => void;
    onReset: () => void;
}

export default function UserFilters({ filters, search, canManageAdmins, onSearchChange, onChange, onReset }: Props) {
    const select = (key: keyof AdminUserFilters, label: string, options: string[][]) => (
        <label className="users-filter-field">
            <span>{label}</span>
            <select value={filters[key]} onChange={(event) => onChange({ ...filters, [key]: event.target.value })}>
                {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
            </select>
        </label>
    );
    return (
        <div className="items-filter-card users-filter-card">
            <label className="items-search">
                <Search size={18} aria-hidden="true" />
                <input aria-label="Search users by username or email" type="search"
                    placeholder="Search by username or email..." value={search}
                    onChange={(event) => onSearchChange(event.target.value)} />
            </label>
            <div className="users-filter-grid">
                {select("gender", "Gender", [["", "All genders"], ["MALE", "Male"], ["FEMALE", "Female"]])}
                {select("role", "Role", [["", "All permitted roles"], ["USER", "User"], ...(canManageAdmins ? [["ADMIN", "Admin"]] : [])])}
                {select("status", "Status", [["", "All statuses"], ["ACTIVE", "Active"], ["BANNED", "Banned"], ["DELETED", "Deleted"]])}
                {select("location", "Location", [["", "All locations"], ...locations])}
                {select("sort", "Sort by", [
                    ["createdAt,desc", "Created: newest first"], ["createdAt,asc", "Created: oldest first"],
                    ["username,asc", "Username: A–Z"], ["username,desc", "Username: Z–A"],
                    ["email,asc", "Email: A–Z"], ["email,desc", "Email: Z–A"],
                    ["level,asc", "Level: low to high"], ["level,desc", "Level: high to low"],
                ])}
                <button type="button" className="items-reset-button" onClick={onReset}>
                    <RotateCcw size={16} aria-hidden="true" /> Reset filters
                </button>
            </div>
        </div>
    );
}
