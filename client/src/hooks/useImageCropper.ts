import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { ACCEPTED_AVATAR_TYPES } from "../types/profile.types";

export function useImageCropper({
  onUpload,
}: {
  onUpload: (blob: Blob) => Promise<void>;
}) {
  const [uploading, setUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastObjectUrlRef = useRef<string | null>(null);
  const previousAvatarRef = useRef<string | null>(null);

  const triggerFileInput = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>, currentAvatarUrl?: string | null) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setError("Only PNG, JPG, JPEG, SVG files are allowed.");
      return;
    }
    setError(null);

    const imageUrl = URL.createObjectURL(file);
    lastObjectUrlRef.current = imageUrl;
    previousAvatarRef.current = currentAvatarUrl ?? null;

    setSelectedImage(imageUrl);
    setShowEditor(true);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const cleanup = () => {
    if (lastObjectUrlRef.current) {
      try {
        URL.revokeObjectURL(lastObjectUrlRef.current);
      } catch (e) {}
      lastObjectUrlRef.current = null;
    }
    setSelectedImage(null);
    setShowEditor(false);
    previousAvatarRef.current = null;
  };

  const handleSaveCroppedImage = async (blob: Blob) => {
    try {
      setUploading(true);
      setError(null);
      await onUpload(blob);
      cleanup();
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      setError(err.message === "Định dạng file không được hỗ trợ." ? err.message : "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return {
    fileInputRef, previousAvatarRef, uploading, showEditor, selectedImage, error,
    triggerFileInput, handleImageSelect, handleSaveCroppedImage, cleanup, setError
  };
}