import React, { useState } from "react";
import "../../../style/admin.css";

interface ReasonFormProps {
    action: "ban" | "unban" | "delete" | "restore";
    loading?: boolean;
    onSubmit: (reason: string) => void;
    onCancel: () => void;
}

const DEFAULT_REASONS = {
    ban: "Violation of community standards.",
    unban: "Penalty period expired or pardoned.",
    delete: "Severe Terms of Service violation.",
    restore: "Mistaken deletion reversed."
};

// Tạo một bộ từ điển để tự động thay đổi UI theo action
const UI_CONFIG = {
    ban: {
        title: "Ban User",
        placeholder: "Enter the reason for banning this user...",
        buttonText: "Ban User",
        buttonClass: "ban" // Class CSS màu đỏ
    },
    unban: {
        title: "Unban User",
        placeholder: "Enter the reason for unbanning this user...",
        buttonText: "Unban User",
        buttonClass: "unban" // Class CSS màu xanh lá
    },
    delete: {
        title: "Delete User",
        placeholder: "Enter the reason for deleting this user...",
        buttonText: "Delete User",
        buttonClass: "delete" // Class CSS màu đỏ đậm
    },
    restore: {
        title: "Restore User",
        placeholder: "Enter the reason for restoring this user...",
        buttonText: "Restore User",
        buttonClass: "restore" // Class CSS màu xanh dương/xanh lá
    }
};

const ReasonForm: React.FC<ReasonFormProps> = ({
    action,
    loading = false,
    onSubmit,
    onCancel,
}) => {
    const [reason, setReason] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalReason = reason.trim() || DEFAULT_REASONS[action];
        onSubmit(finalReason);
    };

    // Lấy cấu hình giao diện tương ứng với action hiện tại
    const config = UI_CONFIG[action];

    return (
        <form className="reason-form" onSubmit={handleSubmit}>
            <div className="reason-form-header">
                <h3>{config.title}</h3>

                <button
                    type="button"
                    className="close-button"
                    onClick={onCancel}
                    disabled={loading}
                >
                    ×
                </button>
            </div>

            <div className="reason-form-body">
                <label htmlFor="reason">
                    Reason
                    <span className="optional">Optional</span>
                </label>

                <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={config.placeholder}
                    rows={4}
                    disabled={loading}
                />
            </div>

            <div className="reason-form-actions">
                <button
                    type="button"
                    className="cancel-button"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className={`submit-button ${config.buttonClass}`}
                    disabled={loading}
                >
                    {loading ? "Processing..." : config.buttonText}
                </button>
            </div>
        </form>
    );
};

export default ReasonForm;