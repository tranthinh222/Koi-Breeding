import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { updateStatusUser } from "../../../api/admin"
import type { AdminModerationUserRequest, AdminUserDto } from "../../../api/admin";

import ReasonForm from "./ReasonForm";
import Notification from "./AdminNotification";
import "../../../style/admin.css";

interface UserModerationModalProps {
    isOpen: boolean;
    action: "ban" | "unban";
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
            /*
             * Thay phần này bằng API thực tế của bạn.
             *
             * Ví dụ:
             *
             * await userService.updateBanStatus(
             *     userId,
             *     action,
             *     reason
             * );
             */
            const request: AdminModerationUserRequest = {
                id: userId,
                status: action === "ban" ? "BANNED" : "ACTIVE",
                reason: reason || null
            }
            const updatedUser = await updateStatusUser(request);
            if (!updatedUser) {
                throw new Error("Request failed");
            }

            setNotification({
                type: "success",
                message:
                    action === "ban"
                        ? "User has been banned successfully."
                        : "User has been unbanned successfully.",
            });
            onSuccess(updatedUser);
            /*
             * Cho notification hiện một chút
             * rồi đóng popup.
             */
            setTimeout(() => {
                setIsClosing(true);

                setTimeout(() => {
                    setIsClosing(false);
                    setNotification(null);
                    onClose();
                }, 250);
            }, 1200);

        } catch (error) {
            setNotification({
                type: "error",
                message:
                    action === "ban"
                        ? "Failed to ban user."
                        : "Failed to unban user.",
            });

            setLoading(false);
        }
    };

    /*
     * Xóa notification khi modal được mở lại.
     */
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