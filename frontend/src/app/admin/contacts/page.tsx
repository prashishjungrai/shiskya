"use client";

import { useEffect, useState } from "react";
import { Check, MailOpen, Trash2 } from "lucide-react";
import api from "@/lib/api";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await api.get("/admin/contacts");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const markRead = async (id: string, currentlyRead: boolean) => {
    if(currentlyRead) return;
    try {
      await api.put(`/admin/contacts/${id}/read`);
      fetchItems();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this message permanently?")) {
      await api.delete(`/admin/contacts/${id}`);
      fetchItems();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Contact Submissions</h2>
        <p className="text-gray-500">Inquiries sent from the public website</p>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item._id} className={`bg-white border rounded-xl p-5 ${item.is_read ? 'opacity-70' : 'border-blue-300 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {!item.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>}
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500">{item.email} {item.phone ? `• ${item.phone}` : ''}</p>
              </div>
              <div className="flex gap-2">
                {!item.is_read && (
                  <button onClick={() => markRead(item._id, item.is_read)} className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 transition">
                    <Check className="w-3 h-3"/> Mark Read
                  </button>
                )}
                <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed font-serif italic border border-gray-100 mt-4">
              "{item.message}"
            </div>
            <div className="mt-3 text-xs text-gray-400 text-right">
              Received on {new Date(item.created_at).toLocaleString()}
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center p-8 text-gray-400">Inbox is empty.</div>}
      </div>
    </div>
  );
}
