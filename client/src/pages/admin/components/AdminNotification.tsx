import React from "react";
import "../../../style/admin.css"

interface NotificationsProps {
    type: "success" | "error";
    message: string;
}

const Notification: React.FC<NotificationsProps> = (
    {
        type, message,
    }
) => {
    return (
        <div className={`notification ${type}`}>
            <span className="notification-icon">
                {type === "success" ? (
                    <span className="checkmark">

                    </span>
                ) : (
                    <span className="crossmark">

                    </span>
                )} 
            </span>
            <span className="notification-message">
                {message}
            </span>
        </div>
    );
};

export default Notification;