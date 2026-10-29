"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, Loader2, Check, AlertCircle, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Field {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "url";
  placeholder?: string;
  required?: boolean;
}

interface AdminCRUDPageProps {
  title: string;
  apiPath: string; // e.g. "/api/admin/projects"
  fields: Field[];
  displayKey: string; // Field to display as item title in list
  displaySubKey?: string; // Optional secondary display field
  emptyMessage?: string;
}

type ToastState = { type: "success" | "error"; message: string } | null;

export default function AdminCRUDPage({
  title, apiPath, fields, displayKey, displaySubKey, emptyMessage
}: AdminCRUDPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiPath);
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : [data].filter(Boolean));
      }
    } catch {
      showToast("error", "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => {
    setFormData({});
    setEditingItem(null);
    setIsCreating(true);
  };

  const openEdit = (item: any) => {
    setFormData({ ...item });
    setEditingItem(item);
    setIsCreating(false);
  };

  const closeForm = () => {
    setIsCreating(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const isNew = !editingItem;
      const res = await fetch(apiPath, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isNew ? formData : { ...formData, id: editingItem.id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      showToast("success", isNew ? "Created successfully! AI knowledge updating..." : "Updated! AI index refreshing...");
      closeForm();
      await fetchItems();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(apiPath, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "Deleted and removed from AI index");
      setDeleteId(null);
      await fetchItems();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-xl ${
              toast.type === "success"
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                : "bg-red-500/20 border border-red-500/30 text-red-300"
            }`}
          >
            {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} record{items.length !== 1 ? "s" : ""} · Changes auto-update public site & AI index
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-violet-500/20"
        >
          <Plus size={16} />
          <span>Add New</span>
        </button>
      </div>

      {/* Items List */}
      <div className="rounded-2xl bg-[#0F0F15] border border-white/[0.05] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-muted-foreground text-sm">{emptyMessage || "No records yet."}</p>
            <button onClick={openCreate} className="text-accent-violet text-sm hover:underline font-medium">
              Create your first entry →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                <div className="space-y-0.5 min-w-0 flex-1 mr-4">
                  <span className="text-sm font-medium text-white block truncate">
                    {item[displayKey]}
                  </span>
                  {displaySubKey && item[displaySubKey] && (
                    <span className="text-xs text-muted-foreground truncate block">
                      {item[displaySubKey]}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-xl border border-transparent text-muted-foreground hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-2 rounded-xl border border-transparent text-muted-foreground hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/[0.05] transition-all duration-200"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {(isCreating || editingItem) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0F0F15] border border-white/[0.08] shadow-luxury-dark"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between sticky top-0 bg-[#0F0F15]">
                <h2 className="text-base font-serif font-bold text-white">
                  {editingItem ? `Edit ${title.slice(0, -1)}` : `New ${title.slice(0, -1)}`}
                </h2>
                <button
                  onClick={closeForm}
                  className="p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Form */}
              <div className="p-6 space-y-5">
                {fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        rows={4}
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full bg-[#12121B] border border-white/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white placeholder:text-zinc-500 transition-colors resize-none font-sans"
                      />
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type={field.type}
                            value={formData[field.key] || ""}
                            onChange={(e) => setFormData((p) => ({
                              ...p,
                              [field.key]: field.type === "number" ? parseFloat(e.target.value) : e.target.value
                            }))}
                            placeholder={field.placeholder}
                            className="flex-1 bg-[#12121B] border border-white/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white placeholder:text-zinc-500 transition-colors font-sans"
                          />
                          {(field.key.toLowerCase().includes("image") || field.key.toLowerCase().includes("photo") || field.key.toLowerCase().includes("url")) && (
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-semibold transition-all flex-shrink-0">
                              <Upload size={14} />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const fd = new FormData();
                                  fd.append("file", file);
                                  try {
                                    const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
                                    const data = await res.json();
                                    if (data.url) {
                                      setFormData((p) => ({ ...p, [field.key]: data.url }));
                                      showToast("success", "Image uploaded successfully!");
                                    } else {
                                      showToast("error", data.error || "Upload failed");
                                    }
                                  } catch (err: any) {
                                    showToast("error", err.message || "Upload error");
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                        {formData[field.key] && (field.key.toLowerCase().includes("image") || field.key.toLowerCase().includes("photo")) && (
                          <div className="relative w-28 h-18 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={formData[field.key]} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-5 border-t border-white/[0.06] flex items-center justify-end space-x-3">
                <button
                  onClick={closeForm}
                  className="px-4 py-2 rounded-xl border border-white/[0.08] text-muted-foreground hover:text-white hover:bg-white/[0.04] text-sm font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold disabled:opacity-50 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{isSaving ? "Saving..." : "Save & Index"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#0F0F15] border border-white/[0.08] p-8 text-center space-y-5"
            >
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 w-fit mx-auto text-red-400">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-white">Delete this record?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This will also remove it from the AI knowledge index. This cannot be undone.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-muted-foreground hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
