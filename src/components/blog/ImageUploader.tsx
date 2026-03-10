"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    onClear: () => void;
}

export default function ImageUploader({ value, onChange, onClear }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast("Only image files are allowed", "error");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast("Image must be under 10MB", "error");
            return;
        }

        setUploading(true);
        try {
            const form = new FormData();
            form.append("image", file);

            const res = await fetch("/api/upload", { method: "POST", body: form });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Upload failed");

            onChange(data.url);
            toast("Image uploaded successfully! 🎉", "success");
        } catch (err: any) {
            toast(err.message || "Upload failed", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    };

    return (
        <div className="space-y-3">
            <AnimatePresence>
                {value ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative rounded-2xl overflow-hidden border border-base-300/50 group"
                    >
                        <img src={value} alt="Blog cover" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="btn btn-sm btn-primary rounded-xl gap-1"
                            >
                                <Upload className="w-3.5 h-3.5" /> Change
                            </button>
                            <button
                                type="button"
                                onClick={onClear}
                                className="btn btn-sm btn-error btn-outline rounded-xl gap-1"
                            >
                                <X className="w-3.5 h-3.5" /> Remove
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => !uploading && inputRef.current?.click()}
                        className={`relative h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${dragOver
                            ? "border-primary bg-primary/10 scale-[1.02]"
                            : "border-base-300 hover:border-primary/50 hover:bg-base-200/50"
                            }`}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                <p className="text-sm text-base-content/60">Uploading to imgbb...</p>
                            </>
                        ) : (
                            <>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? "bg-primary text-white" : "bg-base-200 text-base-content/40"}`}>
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-base-content/70">Drop image here or click to upload</p>
                                    <p className="text-xs text-base-content/40 mt-1">PNG, JPG, WEBP — max 10MB</p>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.target.value = "";
                }}
            />

            {/* Or paste URL */}
            <div className="flex gap-2">
                <input
                    type="url"
                    placeholder="Or paste image URL directly..."
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="input input-bordered input-sm rounded-xl flex-1 text-xs"
                />
                {value && (
                    <button type="button" onClick={onClear} className="btn btn-ghost btn-sm btn-circle">
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}