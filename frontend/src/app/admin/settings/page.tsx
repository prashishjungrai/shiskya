"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { SiteSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/settings").then(res => {
      setSettings(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/admin/settings", settings);
      setSettings(res.data);
      alert("Settings globally saved and cached.");
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <p className="text-gray-500">Configure global website aesthetics and info</p>
      </div>

      {settings && (
        <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border">
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">General Branding</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
              <input type="text" value={settings.institute_name} onChange={(e) => setSettings({...settings, institute_name: e.target.value})} className="w-full border rounded-lg p-2.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                <input type="text" value={settings.hero_title} onChange={(e) => setSettings({...settings, hero_title: e.target.value})} className="w-full border rounded-lg p-2.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                <input type="text" value={settings.hero_subtitle} onChange={(e) => setSettings({...settings, hero_subtitle: e.target.value})} className="w-full border rounded-lg p-2.5" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="email" value={settings.contact_email} onChange={(e) => setSettings({...settings, contact_email: e.target.value})} className="w-full border rounded-lg p-2.5" placeholder="Email" />
              <input type="text" value={settings.contact_phone} onChange={(e) => setSettings({...settings, contact_phone: e.target.value})} className="w-full border rounded-lg p-2.5" placeholder="Phone" />
              <input type="text" value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} className="w-full border rounded-lg p-2.5 col-span-2" placeholder="Physical Address" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Theme Colors</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Primary Color</label>
                <div className="flex gap-2">
                  <input type="color" value={settings.colors.primary} onChange={(e) => setSettings({...settings, colors: {...settings.colors, primary: e.target.value}})} className="h-10 w-10 border rounded cursor-pointer" />
                  <input type="text" value={settings.colors.primary} onChange={(e) => setSettings({...settings, colors: {...settings.colors, primary: e.target.value}})} className="w-full border rounded-lg p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Secondary Color</label>
                <div className="flex gap-2">
                  <input type="color" value={settings.colors.secondary} onChange={(e) => setSettings({...settings, colors: {...settings.colors, secondary: e.target.value}})} className="h-10 w-10 border rounded cursor-pointer" />
                  <input type="text" value={settings.colors.secondary} onChange={(e) => setSettings({...settings, colors: {...settings.colors, secondary: e.target.value}})} className="w-full border rounded-lg p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Accent</label>
                <div className="flex gap-2">
                  <input type="color" value={settings.colors.accent} onChange={(e) => setSettings({...settings, colors: {...settings.colors, accent: e.target.value}})} className="h-10 w-10 border rounded cursor-pointer" />
                  <input type="text" value={settings.colors.accent} onChange={(e) => setSettings({...settings, colors: {...settings.colors, accent: e.target.value}})} className="w-full border rounded-lg p-2" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {saving ? "Deploying Configuration..." : "Save Settings Globally"}
          </button>
        </form>
      )}
    </div>
  );
}
