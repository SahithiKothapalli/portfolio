"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminResumePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    setUploadedUrl(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/admin/upload-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUploadedUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Resume Upload</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a PDF or DOC/DOCX resume. It will be served at <code className="text-accent-violet text-xs">/resume.pdf</code> and linked from your profile.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          isDragging ? "border-violet-500/60 bg-violet-500/5" : "border-white/[0.08] hover:border-violet-500/30 hover:bg-white/[0.02]"
        }`}
      >
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onFileChange} />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-accent-violet" />
            <p className="text-sm text-muted-foreground">Uploading resume...</p>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
              <Upload size={24} className="text-accent-violet" />
            </div>
            <p className="text-sm font-semibold text-foreground">Drop your resume here</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse · PDF, DOC, DOCX · max 10MB</p>
          </>
        )}
      </div>

      {/* Result */}
      <AnimatePresence>
        {uploadedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-300">Resume uploaded successfully!</p>
                <p className="text-xs text-emerald-400/70">Available at: {uploadedUrl}</p>
              </div>
            </div>
            <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors">
              <ExternalLink size={14} />
            </a>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-2">
          <FileText size={13} className="text-accent-violet" />
          <span className="font-semibold text-foreground">After uploading:</span>
        </div>
        <ul className="pl-5 space-y-0.5 list-disc">
          <li>Your profile&apos;s Resume URL will auto-update</li>
          <li>The &ldquo;Download Resume&rdquo; button on the homepage will serve the new file</li>
          <li>Public resume page at <code className="text-accent-violet">/resume</code> will reflect the new file</li>
        </ul>
      </div>
    </div>
  );
}
