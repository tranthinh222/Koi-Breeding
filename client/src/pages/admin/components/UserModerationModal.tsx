import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { updateStatusUser } from "../../../api/admin"
import type { AdminModerationUserRequest, AdminUserDto, AdminUserStatus } from "../../../api/admin";

import ReasonForm from "./ReasonForm";
import Notification from "./AdminNotification";
import "../Admin.css";

interface UserModerationModalProps {
    isOpen: boolean;
    action: "ban" | "unban" | "delete" | "restore"; // Bổ sung 2 trạng thái mới
    userId: number;
    onClose: () => void;
    onSuccess: (updatedUser: AdminUserDto) => void
}

const UserModerationModal: React.FC<UserModerationModalProps> = ({
    isOpen,
    action,
    userId,
    onClose,
    onSuccess
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [notification, setNotification] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const handleClose = () => {
        if (loading) return;
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 250);
    };

    const handleSubmit = async (reason: string) => {
        setLoading(true);
        setNotification(null);

        try {
            // 1. CHUYỂN ĐỔI ACTION TỪ GIAO DIỆN SANG STATUS CỦA API
            let newStatus: AdminUserStatus = "ACTIVE";
            if (action === "ban") newStatus = "BANNED";
            if (action === "delete") newStatus = "DELETED";
            if (action === "restore" || action === "unban") newStatus = "ACTIVE";

            const request: AdminModerationUserRequest = {
                id: userId,
                status: newStatus,
                reason: reason || null
            }
            
            const updatedUser = await updateStatusUser(request);
            if (!updatedUser) {
                throw new Error("Request failed");
            }

            // 2. TẠO CÂU THÔNG BÁO TƯƠNG ỨNG
            let successMsg = "Action completed successfully.";
            if (action === "ban") successMsg = "User has been banned successfully.";
            if (action === "unban") successMsg = "User has been unbanned successfully.";
            if (action === "delete") successMsg = "User has been deleted successfully.";
            if (action === "restore") successMsg = "User has been restored successfully.";

            setNotification({
                type: "success",
                message: successMsg,
            });
            onSuccess(updatedUser);

            setTimeout(() => {
                setIsClosing(true);
                setTimeout(() => {
                    setIsClosing(false);
                    setNotification(null);
                    onClose();
                }, 250);
            }, 1200);

        } catch (error) {
            let errorMsg = "Action failed.";
            if (action === "ban") errorMsg = "Failed to ban user.";
            if (action === "unban") errorMsg = "Failed to unban user.";
            if (action === "delete") errorMsg = "Failed to delete user.";
            if (action === "restore") errorMsg = "Failed to restore user.";

            setNotification({
                type: "error",
                message: errorMsg,
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setNotification(null);
            setLoading(false);
            setIsClosing(false);
        }
    }, [isOpen]);

    if (!isOpen && !isClosing) {
        return null;
    }

    return createPortal(
        <>
            <div
                className={`modal-overlay ${isClosing ? "closing" : ""}`}
                onClick={handleClose}
            />

            <div
                className={`modal-container ${isClosing ? "closing" : ""}`}
            >
                <ReasonForm
                    action={action}
                    loading={loading}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                />
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                />
            )}
        </>,
        document.body
    );
};

export default UserModerationModal;
