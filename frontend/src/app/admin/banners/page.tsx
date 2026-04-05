"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import LivePreviewPanel from "@/components/admin/LivePreviewPanel";
import BannerPreview from "@/components/admin/BannerPreview";
import ImageUpload from "@/components/ImageUpload";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { getApiErrorMessage } from "@/lib/api-errors";
import { resolveMediaUrl } from "@/lib/media";
import { Banner } from "@/lib/types";

type BannerFormData = {
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
};

const emptyFormData: BannerFormData = {
  title: "",
  subtitle: "",
  image_url: "",
  link_url: "",
  is_active: true,
  display_order: 0,
};

export default function BannersPage() {
  const { showToast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<BannerFormData>(emptyFormData);

  const fetchBanners = async () => {
    try { const res = await api.get("/admin/banners"); setBanners(res.data); } finally { setLoading(false); }
  };

  useEffect(() => { void fetchBanners(); }, []);

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditBanner(banner);
      setFormData({
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        image_url: banner.image_url || "",
        link_url: banner.link_url || "",
        is_active: banner.is_active,
        display_order: banner.display_order || 0,
      });
    } else {
      setEditBanner(null);
      setFormData(emptyFormData);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editBanner) { await api.put(`/admin/banners/${editBanner.id}`, formData); }
      else { await api.post("/admin/banners", formData); }
      await fetchBanners();
      setIsModalOpen(false);
      showToast({
        variant: "success",
        title: editBanner ? "Banner updated" : "Banner created",
        description: "The banner has been saved successfully.",
      });
    } catch (error) {
      showToast({
        variant: "error",
        title: "Banner save failed",
        description: getApiErrorMessage(error, "Review the banner details and try again."),
      });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/admin/banners/${bannerToDelete.id}`);
      await fetchBanners();
      showToast({
        variant: "success",
        title: "Banner deleted",
        description: `"${bannerToDelete.title || "Banner"}" has been removed.`,
      });
      setBannerToDelete(null);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Delete failed",
        description: getApiErrorMessage(error, "The banner could not be deleted."),
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-bold text-primary tracking-tight">Visual <span className="italic text-primary/40">Assets</span></h2>
          <p className="text-primary/40 text-sm font-light mt-1">Manage hero carousel banners and promotional imagery</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800">
          <Plus className="w-4 h-4" /> Create Banner
        </button>
      </div>

      {/* Banner Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {banners.map((b, i) => {
          const bannerImage = resolveMediaUrl(b.image_url);

          return (
            <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group relative rounded-[32px] overflow-hidden h-52 cursor-pointer" onClick={() => openModal(b)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : undefined}
              >
                <div className={`absolute inset-0 ${bannerImage ? "bg-gradient-to-t from-black/80 via-black/30 to-transparent" : "bg-gradient-to-br from-black via-neutral-900 to-neutral-700"}`} />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <span className={`mb-2 self-start rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${b.is_active ? 'bg-black/80 text-white' : 'bg-white/30 text-white'}`}>
                  {b.is_active ? 'Live' : 'Draft'}
                </span>
                <h3 className="text-xl font-bold tracking-tight">{b.title}</h3>
                {b.subtitle && <p className="text-white/60 text-sm mt-1 line-clamp-1">{b.subtitle}</p>}
              </div>
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); setBannerToDelete(b); }} className="rounded-xl bg-white/90 p-2 text-primary/35 transition hover:bg-black hover:text-white"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </motion.div>
          );
        })}
        {banners.length === 0 && (
          <div className="col-span-full text-center py-20 text-primary/20">
            <ImageIcon className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-serif italic">No visual assets created</p>
          </div>
        )}
      </div>

      {/* SPLIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#fcfcfc] rounded-[32px] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex">
              <div className="w-1/2 p-10 overflow-y-auto border-r border-primary/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-serif font-bold text-primary">{editBanner ? "Edit Banner" : "New Banner"}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-primary/5"><X className="w-5 h-5 text-primary/40" /></button>
                </div>
                <form onSubmit={handleSave} className="space-y-6">
                  <Field label="Headline" value={formData.title} onChange={v => setFormData({...formData, title: v})} required placeholder="Bold headline text" />
                  <Field label="Subtitle" value={formData.subtitle} onChange={v => setFormData({...formData, subtitle: v})} placeholder="Supporting tagline" />
                  
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest">Banner Image *</label>
                    <ImageUpload value={formData.image_url} onChange={v => setFormData({...formData, image_url: v})} label="Upload Banner Image" className="max-w-full" />
                  </div>

                  <Field label="Click-through URL" value={formData.link_url} onChange={v => setFormData({...formData, link_url: v})} placeholder="e.g. /courses" />
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl">
                    <label className="flex items-center gap-3 text-sm font-medium text-primary">
                      <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 rounded accent-black" />
                      Visible on site
                    </label>
                    <div className="flex items-center gap-2 text-xs text-primary/40">
                      Order: <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: Number(e.target.value)})} className="w-16 input-premium text-center" />
                    </div>
                  </div>
                  <button type="submit" disabled={saving} className="w-full rounded-2xl bg-primary py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 disabled:opacity-50">
                    {saving ? "Saving..." : "Save Banner"}
                  </button>
                </form>
              </div>
              <div className="w-1/2 bg-slate-50">
                <LivePreviewPanel title="Hero Banner Preview">
                  <div className="p-4">
                    <BannerPreview formData={formData} />
                  </div>
                </LivePreviewPanel>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={bannerToDelete !== null}
        title="Delete banner"
        description={
          bannerToDelete
            ? `Delete "${bannerToDelete.title || "this banner"}" from the hero rotation?`
            : "Delete this banner?"
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        confirmTone="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleting) {
            setBannerToDelete(null);
          }
        }}
      />
      <style jsx global>{`.input-premium { @apply w-full bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-accent transition-all placeholder:text-primary/20; }`}</style>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest">{label}</label>
      <input type="text" required={required} value={value} onChange={e => onChange(e.target.value)} className="input-premium" placeholder={placeholder} />
    </div>
  );
}
