import React, { useState } from "react";
import "../../../style/admin.css";

interface ReasonFormProps {
    action: "ban" | "unban";
    loading?: boolean;
    onSubmit: (reason: string) => void;
    onCancel: () => void;
}

const DEFAULT_REASONS = {
    ban: "Violation of community standards.",
    unban: "Penalty period expired or pardoned."
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

    const isBan = action === "ban";

    return (
        <form className="reason-form" onSubmit={handleSubmit}>
            <div className="reason-form-header">
                <h3>
                    {isBan ? "Ban User" : "Unban User"}
                </h3>

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
                    <span className="optional">
                        Optional
                    </span>
                </label>

                <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={
                        isBan
                            ? "Enter the reason for banning this user..."
                            : "Enter the reason for unbanning this user..."
                    }
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
                    className={`submit-button ${
                        isBan ? "ban" : "unban"
                    }`}
                    disabled={loading}
                >
                    {loading
                        ? "Processing..."
                        : isBan
                            ? "Ban User"
                            : "Unban User"}
                </button>
            </div>
        </form>
    );
};

export default ReasonForm;