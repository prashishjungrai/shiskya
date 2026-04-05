"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, Pin, BellRing, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import LivePreviewPanel from "@/components/admin/LivePreviewPanel";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { getApiErrorMessage } from "@/lib/api-errors";
import { Notice } from "@/lib/types";

type NoticeFormData = {
  title: string;
  content: string;
  is_pinned: boolean;
  is_active: boolean;
};

const emptyFormData: NoticeFormData = {
  title: "",
  content: "",
  is_pinned: false,
  is_active: true,
};

export default function NoticesPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Notice | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<NoticeFormData>(emptyFormData);

  const fetchItems = async () => {
    try {
      const res = await api.get("/admin/notices");
      setItems(res.data);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Could not load notices",
        description: getApiErrorMessage(error, "Refresh the page and try again."),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchItems(); }, []);

  const openModal = (item?: Notice) => {
    if (item) {
      setEditItem(item);
      setFormData({
        title: item.title,
        content: item.content || "",
        is_pinned: item.is_pinned,
        is_active: item.is_active,
      });
    } else {
      setEditItem(null);
      setFormData(emptyFormData);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) { await api.put(`/admin/notices/${editItem.id}`, formData); }
      else { await api.post("/admin/notices", formData); }
      await fetchItems();
      setIsModalOpen(false);
      showToast({
        variant: "success",
        title: editItem ? "Notice updated" : "Notice created",
        description: "The notice has been saved successfully.",
      });
    } catch (error) {
      showToast({
        variant: "error",
        title: "Notice save failed",
        description: getApiErrorMessage(error, "Review the notice details and try again."),
      });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!noticeToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/admin/notices/${noticeToDelete.id}`);
      await fetchItems();
      showToast({
        variant: "success",
        title: "Notice deleted",
        description: `"${noticeToDelete.title}" has been removed.`,
      });
      setNoticeToDelete(null);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Delete failed",
        description: getApiErrorMessage(error, "The notice could not be deleted."),
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-bold text-primary tracking-tight">Academic <span className="italic text-primary/40">Notifications</span></h2>
          <p className="text-primary/40 text-sm font-light mt-1">Publish announcements and alerts to the student body</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800">
          <Plus className="w-4 h-4" /> Emit Notice
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className={`group cursor-pointer rounded-[24px] border bg-white p-6 transition-all hover:shadow-premium ${item.is_pinned ? 'border-primary/15 bg-primary/[0.03]' : 'border-primary/5'}`}
            onClick={() => openModal(item)}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {item.is_pinned && <Pin className="w-4 h-4 fill-primary text-primary" />}
                <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                <span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${item.is_active ? 'bg-primary text-white' : 'bg-primary/[0.06] text-primary/55'}`}>
                  {item.is_active ? 'Live' : 'Draft'}
                </span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={e => { e.stopPropagation(); setNoticeToDelete(item); }} className="rounded-xl bg-white p-2 text-primary/35 transition hover:bg-primary hover:text-white"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p className="text-primary/50 mt-3 text-sm whitespace-pre-wrap line-clamp-3">{item.content}</p>
            {item.created_at && <p className="text-primary/20 text-xs mt-3">{new Date(item.created_at).toLocaleDateString()}</p>}
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-20 text-primary/20 border-2 border-dashed border-primary/10 rounded-[32px]">
            <BellRing className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-serif italic">No notifications emitted</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#fcfcfc] rounded-[32px] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex">
              <div className="w-1/2 p-10 overflow-y-auto border-r border-primary/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-serif font-bold text-primary">{editItem ? "Edit Notice" : "Emit Notice"}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-primary/5"><X className="w-5 h-5 text-primary/40" /></button>
                </div>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest">Title</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-premium" placeholder="Announcement Headline" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest">Content</label>
                    <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="input-premium min-h-[180px] py-4" placeholder="Full announcement text..." />
                  </div>
                  <div className="flex gap-6 p-4 bg-primary/5 rounded-2xl">
                    <label className="flex items-center gap-3 text-sm font-medium text-primary">
                      <input type="checkbox" checked={formData.is_pinned} onChange={e => setFormData({...formData, is_pinned: e.target.checked})} className="w-5 h-5 rounded accent-black" />
                      <Pin className="w-4 h-4 text-primary" /> Pin to Top
                    </label>
                    <label className="flex items-center gap-3 text-sm font-medium text-primary">
                      <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 rounded accent-black" />
                      <Eye className="w-4 h-4 text-primary" /> Published
                    </label>
                  </div>
                  <button type="submit" disabled={saving} className="w-full rounded-2xl bg-primary py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 disabled:opacity-50">
                    {saving ? "Emitting..." : "Emit Notice"}
                  </button>
                </form>
              </div>
              <div className="w-1/2 bg-slate-50">
                <LivePreviewPanel title="Notice Preview">
                  <div className="p-6">
                    <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-widest text-primary/30">As seen by students</p>
                    <div className={`rounded-2xl border p-6 ${formData.is_pinned ? 'border-primary/15 bg-primary/[0.03]' : 'border-slate-100 bg-white'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        {formData.is_pinned && <Pin className="w-4 h-4 fill-primary text-primary" />}
                        <BellRing className="w-4 h-4 text-primary" />
                        <h3 className="font-bold text-slate-900 text-lg">{formData.title || "Notice Title"}</h3>
                      </div>
                      <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{formData.content || "Notice content will appear here..."}</p>
                      <div className="mt-4 flex items-center gap-2">
                        {!formData.is_active && <span className="rounded-full bg-primary/[0.08] px-2 py-1 text-[9px] font-bold uppercase text-primary/65">Draft — Hidden from public</span>}
                        {formData.is_active && <span className="text-slate-400 text-xs">Published just now</span>}
                      </div>
                    </div>
                  </div>
                </LivePreviewPanel>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={noticeToDelete !== null}
        title="Delete notice"
        description={
          noticeToDelete
            ? `Delete "${noticeToDelete.title}" permanently?`
            : "Delete this notice?"
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        confirmTone="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleting) {
            setNoticeToDelete(null);
          }
        }}
      />
      <style jsx global>{`.input-premium { @apply w-full bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-accent transition-all placeholder:text-primary/20; }`}</style>
    </div>
  );
}
