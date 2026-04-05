"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, Star, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import LivePreviewPanel from "@/components/admin/LivePreviewPanel";
import TestimonialPreview from "@/components/admin/TestimonialPreview";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { getApiErrorMessage } from "@/lib/api-errors";
import { Testimonial } from "@/lib/types";

type TestimonialFormData = {
  student_name: string;
  content: string;
  rating: number;
  course: string;
  is_active: boolean;
};

const emptyFormData: TestimonialFormData = {
  student_name: "",
  content: "",
  rating: 5,
  course: "",
  is_active: true,
};

export default function TestimonialsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>(emptyFormData);

  const fetchItems = async () => {
    try {
      const res = await api.get("/admin/testimonials");
      setItems(res.data);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Could not load testimonials",
        description: getApiErrorMessage(error, "Refresh the page and try again."),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchItems(); }, []);

  const openModal = (item?: Testimonial) => {
    if (item) {
      setEditItem(item);
      setFormData({
        student_name: item.student_name,
        content: item.content,
        rating: item.rating,
        course: item.course || "",
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
      if (editItem) { await api.put(`/admin/testimonials/${editItem.id}`, formData); }
      else { await api.post("/admin/testimonials", formData); }
      await fetchItems();
      setIsModalOpen(false);
      showToast({
        variant: "success",
        title: editItem ? "Testimonial updated" : "Testimonial created",
        description: "The testimonial has been saved successfully.",
      });
    } catch (error) {
      showToast({
        variant: "error",
        title: "Testimonial save failed",
        description: getApiErrorMessage(error, "Review the testimonial details and try again."),
      });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!testimonialToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/admin/testimonials/${testimonialToDelete.id}`);
      await fetchItems();
      showToast({
        variant: "success",
        title: "Testimonial deleted",
        description: `The testimonial from "${testimonialToDelete.student_name}" has been removed.`,
      });
      setTestimonialToDelete(null);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Delete failed",
        description: getApiErrorMessage(error, "The testimonial could not be deleted."),
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
          <h2 className="text-4xl font-serif font-bold text-primary tracking-tight">Institutional <span className="italic text-primary/40">Evidence</span></h2>
          <p className="text-primary/40 text-sm font-light mt-1">Manage student testimonials and success stories</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800">
          <Plus className="w-4 h-4" /> Record Testimony
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group bg-white rounded-[32px] p-8 border border-primary/5 hover:shadow-premium transition-all relative cursor-pointer" onClick={() => openModal(item)}>
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); setTestimonialToDelete(item); }} className="rounded-xl bg-white p-2 text-primary/35 transition hover:bg-primary hover:text-white"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <div className="mb-4 flex text-primary">{Array(item.rating).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}</div>
            <p className="text-primary/60 italic text-sm leading-relaxed mb-6 line-clamp-4">&ldquo;{item.content}&rdquo;</p>
            <div className="flex items-center gap-3 border-t border-primary/5 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{item.student_name.charAt(0)}</div>
              <div>
                <h4 className="font-bold text-primary text-sm">{item.student_name}</h4>
                {item.course && <span className="text-primary/30 text-xs">{item.course}</span>}
              </div>
            </div>
            <span className={`mt-4 inline-block rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${item.is_active ? 'bg-primary text-white' : 'bg-primary/[0.06] text-primary/55'}`}>
              {item.is_active ? 'Published' : 'Hidden'}
            </span>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-20 text-primary/20">
            <MessageSquare className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-serif italic">No testimonials recorded</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#fcfcfc] rounded-[32px] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex">
              <div className="w-1/2 p-10 overflow-y-auto border-r border-primary/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-serif font-bold text-primary">{editItem ? "Edit Testimony" : "Record Testimony"}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-primary/5"><X className="w-5 h-5 text-primary/40" /></button>
                </div>
                <form onSubmit={handleSave} className="space-y-6">
                  <Field label="Student Name" value={formData.student_name} onChange={v => setFormData({...formData, student_name: v})} required placeholder="e.g. Sita Adhikari" />
                  <Field label="Course Context" value={formData.course} onChange={v => setFormData({...formData, course: v})} placeholder="e.g. +2 Science Batch 2025" />
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest">Feedback Quote</label>
                    <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="input-premium min-h-[120px] py-4" placeholder="Write the student's feedback..." />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest">Rating (1-5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" onClick={() => setFormData({...formData, rating: n})}
                          className={`rounded-xl p-3 transition-all ${formData.rating >= n ? 'text-primary' : 'text-primary/15'}`}>
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-primary/5 rounded-2xl">
                    <label className="flex items-center gap-3 text-sm font-medium text-primary">
                      <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 rounded accent-black" />
                      Publish on website
                    </label>
                  </div>
                  <button type="submit" disabled={saving} className="w-full rounded-2xl bg-primary py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 disabled:opacity-50">
                    {saving ? "Saving..." : "Save Testimony"}
                  </button>
                </form>
              </div>
              <div className="w-1/2 bg-slate-50">
                <LivePreviewPanel title="Testimonial Card Preview">
                  <div className="p-6">
                    <TestimonialPreview formData={formData} />
                  </div>
                </LivePreviewPanel>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={testimonialToDelete !== null}
        title="Delete testimonial"
        description={
          testimonialToDelete
            ? `Delete the testimonial from "${testimonialToDelete.student_name}"?`
            : "Delete this testimonial?"
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        confirmTone="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleting) {
            setTestimonialToDelete(null);
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
