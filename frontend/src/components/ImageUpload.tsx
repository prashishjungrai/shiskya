import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";
import { usePreviewSync } from "@/components/admin/PreviewSyncContext";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
  previewTarget?: string;
}

export default function ImageUpload({
  value,
  onChange,
  className = "",
  label = "Upload Image",
  previewTarget,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { focusPreviewSection } = usePreviewSync();

  const handlePreviewFocus = () => {
    if (previewTarget) {
      focusPreviewSection(previewTarget);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional client-side validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use multipart/form-data explicitly so Axios overrides the default application/json
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // The backend returns { url: "...", public_id: "..." }
      if (res.data && res.data.url) {
        onChange(res.data.url);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.detail || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    // Optionally call backend DELETE /upload/:public_id if we have public_id stored
    // For now, simply clear the value from the form
    onChange("");
  };

  const previewUrl = resolveMediaUrl(value);
  const hasStoredValue = Boolean(value?.trim());

  return (
    <div
      onPointerDownCapture={handlePreviewFocus}
      onFocusCapture={handlePreviewFocus}
      className={`space-y-2 ${className}`}
    >
      {hasStoredValue ? (
        <div className="relative inline-block w-full max-w-sm border border-slate-200 rounded-xl overflow-hidden group">
          {previewUrl ? (
            <img src={previewUrl} alt="Uploaded preview" className="w-full h-auto object-cover max-h-64 bg-slate-50" />
          ) : (
            <div className="flex min-h-48 w-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Image URL is not renderable yet</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Replace it with a valid upload or remove the current value.
                </p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              title="Replace Image"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white rounded-full text-slate-700 hover:text-blue-600 hover:scale-110 transition shadow-lg"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              title="Remove Image"
              type="button"
              onClick={handleRemove}
              className="p-2 bg-white rounded-full text-slate-700 hover:text-red-500 hover:scale-110 transition shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-sm border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50/50 transition cursor-pointer flex flex-col items-center justify-center text-center group"
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-blue-600">
              <Loader2 className="w-8 h-8 mb-3 animate-spin" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
              </div>
              <p className="text-sm font-bold text-slate-600 mb-1">{label}</p>
              <p className="text-xs text-slate-400">Click to browse (Max 10MB)</p>
            </>
          )}
        </div>
      )}
      {error && <p className="text-sm font-medium text-red-500 mt-2">{error}</p>}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={isUploading}
      />
    </div>
  );
}
