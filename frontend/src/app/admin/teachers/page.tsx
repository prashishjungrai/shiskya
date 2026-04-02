"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import api from "@/lib/api";

type Teacher = {
  _id: string;
  name: string;
  subject: string;
  bio?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    bio: "",
    is_active: true,
    display_order: 0,
  });

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/admin/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const openModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditTeacher(teacher);
      setFormData({
        name: teacher.name,
        subject: teacher.subject,
        bio: teacher.bio || "",
        is_active: teacher.is_active,
        display_order: teacher.display_order || 0,
      });
    } else {
      setEditTeacher(null);
      setFormData({
        name: "",
        subject: "",
        bio: "",
        is_active: true,
        display_order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditTeacher(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editTeacher) {
        await api.put(`/admin/teachers/${editTeacher._id}`, formData);
      } else {
        await api.post("/admin/teachers", formData);
      }
      fetchTeachers();
      closeModal();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save teacher.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this specific instructor profile?")) {
      try {
        await api.delete(`/admin/teachers/${id}`);
        fetchTeachers();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  if (loading) return <div className="animate-pulse">Loading teachers...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Teachers</h2>
          <p className="text-gray-500 text-sm">Manage instructor profiles and biographies</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-lg">
                  {teacher.name.charAt(0)}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(teacher)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(teacher._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{teacher.name}</h3>
              <p className="text-sm font-medium text-blue-600 mb-3">{teacher.subject}</p>
              <p className="text-sm text-gray-500 line-clamp-3">{teacher.bio || "No biography provided."}</p>
            </div>
            <div className="border-t bg-gray-50 px-6 py-3 flex justify-between items-center">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${teacher.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {teacher.is_active ? 'Active on site' : 'Hidden'}
              </span>
              <span className="text-xs text-gray-400 font-mono">Rank: {teacher.display_order}</span>
            </div>
          </div>
        ))}
        {teachers.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-400 border-2 border-dashed rounded-xl">
            No instructors added yet.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold">{editTeacher ? "Edit Profile" : "Register Teacher"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input 
                  type="text" required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. Dr. Rajesh Sharma"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Specialization *</label>
                <input 
                  type="text" required 
                  value={formData.subject} 
                  onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                  className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. Advanced Mathematics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                <textarea 
                  value={formData.bio} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                  className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" 
                  placeholder="Educational background, achievements..."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.is_active} 
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium">Visible</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Display Order</label>
                  <input 
                    type="number" 
                    value={formData.display_order} 
                    onChange={(e) => setFormData({...formData, display_order: Number(e.target.value)})} 
                    className="w-16 border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 text-center" 
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">
                  {editTeacher ? "Save" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
