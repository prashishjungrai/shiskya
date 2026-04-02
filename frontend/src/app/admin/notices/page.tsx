"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Pin } from "lucide-react";
import api from "@/lib/api";

type Notice = {
  _id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_active: boolean;
  created_at?: string;
};

export default function NoticesPage() {
  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Notice | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_pinned: false,
    is_active: true,
  });

  const fetchItems = async () => {
    try {
      const res = await api.get("/admin/notices");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item?: Notice) => {
    if (item) {
      setEditItem(item);
      setFormData({
        title: item.title,
        content: item.content,
        is_pinned: item.is_pinned,
        is_active: item.is_active,
      });
    } else {
      setEditItem(null);
      setFormData({ title: "", content: "", is_pinned: false, is_active: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/admin/notices/${editItem._id}`, formData);
      } else {
        await api.post("/admin/notices", formData);
      }
      fetchItems();
      closeModal();
    } catch {
      alert("Failed to save.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this notice?")) {
      await api.delete(`/admin/notices/${id}`);
      fetchItems();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="text-2xl font-bold">Public Notices</h2><p className="text-gray-500">Announcements / Alerts</p></div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" /> Emit Notice</button>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item._id} className={`bg-white border rounded-xl p-5 hover:shadow-sm ${item.is_pinned ? 'border-amber-200 bg-amber-50' : ''}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {item.is_pinned && <Pin className="w-4 h-4 text-amber-500 fill-amber-500"/>}
                <h3 className="font-bold text-lg">{item.title}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openModal(item)} className="p-2 text-blue-500"><Edit2 className="w-4 h-4"/></button>
                <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
            <p className="text-gray-600 mt-2 whitespace-pre-wrap">{item.content}</p>
            <div className="mt-4"><span className={`px-2 py-1 text-xs rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200'}`}>{item.is_active ? 'Published' : 'Hidden'}</span></div>
          </div>
        ))}
        {items.length === 0 && <div className="text-gray-400 p-8 text-center border-2 border-dashed rounded">No notices.</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h3 className="font-bold text-xl mb-4">{editItem ? 'Edit' : 'New'} Notice</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded" placeholder="Title" />
              <textarea required value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full border p-2 rounded min-h-32" placeholder="Announcement content..." />
              <div className="flex gap-6">
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_pinned} onChange={(e) => setFormData({...formData, is_pinned: e.target.checked})}/> Pin to Top</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})}/> Published</label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
