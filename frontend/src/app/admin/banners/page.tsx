"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import api from "@/lib/api";

type Banner = {
  _id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  display_order: number;
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    link_url: "",
    is_active: true,
    display_order: 0,
  });

  const fetchBanners = async () => {
    try {
      const res = await api.get("/admin/banners");
      setBanners(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || "",
        image_url: banner.image_url,
        link_url: banner.link_url || "",
        is_active: banner.is_active,
        display_order: banner.display_order || 0,
      });
    } else {
      setEditBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        image_url: "",
        link_url: "",
        is_active: true,
        display_order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditBanner(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editBanner) {
        await api.put(`/admin/banners/${editBanner._id}`, formData);
      } else {
        await api.post("/admin/banners", formData);
      }
      fetchBanners();
      closeModal();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save banner.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this banner?")) {
      try {
        await api.delete(`/admin/banners/${id}`);
        fetchBanners();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  if (loading) return <div className="animate-pulse">Loading banners...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Promotional Banners</h2>
          <p className="text-gray-500 text-sm">Manage website carousel and advertisements</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-sm text-gray-500 uppercase tracking-wider">
              <th className="p-4 font-semibold w-1/3">Title & Subtitle</th>
              <th className="p-4 font-semibold">Image URL</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">No banners available.</td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{banner.title}</p>
                    <p className="text-sm text-gray-500">{banner.subtitle}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-400 font-mono truncate max-w-xs">{banner.image_url}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {banner.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-3">
                    <button onClick={() => openModal(banner)} className="text-blue-500 hover:text-blue-700 p-1">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(banner._id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-xl font-bold">{editBanner ? "Edit Banner" : "New Banner"}</h3>
              <button onClick={closeModal}><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg p-2.5" placeholder="Headline Title *" />
              <input type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full border rounded-lg p-2.5" placeholder="Subtitle text..." />
              <input type="text" required value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full border rounded-lg p-2.5" placeholder="Direct Image URL (e.g. Cloudinary) *" />
              <input type="text" value={formData.link_url} onChange={(e) => setFormData({...formData, link_url: e.target.value})} className="w-full border rounded-lg p-2.5" placeholder="Target destination URL via click" />
              
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} /> Visible</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Display Order:</span>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: Number(e.target.value)})} className="w-16 border rounded p-1 text-center" />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3"><button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
