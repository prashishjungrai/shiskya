"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Star } from "lucide-react";
import api from "@/lib/api";

type Testimonial = {
  _id: string;
  student_name: string;
  content: string;
  rating: number;
  course_taken?: string;
  is_active: boolean;
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    student_name: "",
    content: "",
    rating: 5,
    course_taken: "",
    is_active: true,
  });

  const fetchItems = async () => {
    try {
      const res = await api.get("/admin/testimonials");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item?: Testimonial) => {
    if (item) {
      setEditItem(item);
      setFormData({
        student_name: item.student_name,
        content: item.content,
        rating: item.rating,
        course_taken: item.course_taken || "",
        is_active: item.is_active,
      });
    } else {
      setEditItem(null);
      setFormData({
        student_name: "",
        content: "",
        rating: 5,
        course_taken: "",
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/admin/testimonials/${editItem._id}`, formData);
      } else {
        await api.post("/admin/testimonials", formData);
      }
      fetchItems();
      closeModal();
    } catch (err) {
      alert("Failed to save.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this?")) {
      await api.delete(`/admin/testimonials/${id}`);
      fetchItems();
    }
  };

  if (loading) return <div className="animate-pulse">Loading testimonials...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="text-2xl font-bold">Student Testimonials</h2><p className="text-gray-500">Manage feedback shown on site</p></div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" /> Add Testimonial</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white border p-6 rounded-xl hover:shadow-md">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">{item.student_name}</h3>
              <div className="flex gap-2 text-gray-400">
                <button onClick={() => openModal(item)} className="hover:text-blue-500"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item._id)} className="hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex text-amber-500 mb-2">{Array(item.rating).fill(0).map((_,i) => <Star key={i} className="w-4 h-4 fill-current"/>)}</div>
            <p className="text-sm text-gray-600 line-clamp-4 italic">"{item.content}"</p>
            {item.course_taken && <p className="text-xs font-mono text-gray-400 mt-4">Course: {item.course_taken}</p>}
          </div>
        ))}
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between border-b pb-4 mb-4">
              <h3 className="font-bold">{editItem ? "Edit Testimonial" : "New Testimonial"}</h3>
              <button onClick={closeModal}><X className="w-4 h-4"/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" required value={formData.student_name} onChange={(e) => setFormData({...formData, student_name: e.target.value})} className="w-full border rounded p-2" placeholder="Student Name" />
              <input type="text" value={formData.course_taken} onChange={(e) => setFormData({...formData, course_taken: e.target.value})} className="w-full border rounded p-2" placeholder="Course context (optional)" />
              <textarea required value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full border rounded p-2 min-h-24" placeholder="Feedback quote..." />
              <div>
                <label className="text-sm w-full block">Rating 1-5:</label>
                <input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})} className="w-full border rounded p-2" />
              </div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} /> Visible on site</label>
              <button className="w-full bg-blue-600 text-white rounded p-2">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
