"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, Mail, MailOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { getApiErrorMessage } from "@/lib/api-errors";
import { ContactSubmission } from "@/lib/types";

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleDateString() : "Unknown date";
}

function formatDateTime(value?: string) {
  return value ? new Date(value).toLocaleString() : "Unknown time";
}

export default function ContactsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContactSubmission | null>(null);
  const [contactToDelete, setContactToDelete] = useState<ContactSubmission | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async (preferredSelectedId?: string | null) => {
    try {
      const res = await api.get("/admin/contacts");
      const nextItems = res.data as ContactSubmission[];
      setItems(nextItems);

      if (preferredSelectedId !== undefined) {
        setSelectedItem(
          preferredSelectedId
            ? nextItems.find((item) => item.id === preferredSelectedId) || null
            : null,
        );
      }
    } catch (error) {
      showToast({
        variant: "error",
        title: "Could not load inquiries",
        description: getApiErrorMessage(error, "Refresh the page and try again."),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchItems(); }, []);

  const markRead = async (id: string) => {
    try {
      await api.put(`/admin/contacts/${id}/read`);
      await fetchItems(id);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Could not update inquiry",
        description: getApiErrorMessage(error, "The inquiry could not be marked as read."),
      });
    }
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;

    setDeleting(true);
    const nextSelectedId =
      selectedItem?.id === contactToDelete.id ? null : selectedItem?.id;

    try {
      await api.delete(`/admin/contacts/${contactToDelete.id}`);
      await fetchItems(nextSelectedId);
      showToast({
        variant: "success",
        title: "Inquiry deleted",
        description: `The message from "${contactToDelete.name}" has been removed.`,
      });
      setContactToDelete(null);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Delete failed",
        description: getApiErrorMessage(error, "The inquiry could not be deleted."),
      });
    } finally {
      setDeleting(false);
    }
  };

  const unreadCount = items.filter(i => !i.is_read).length;

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-serif font-bold text-primary tracking-tight">
          Admissions <span className="italic text-primary/40">Inquiries</span>
        </h2>
        <p className="text-primary/40 text-sm font-light mt-1">
          {unreadCount > 0 ? `${unreadCount} new inquiries awaiting review` : "All inquiries have been reviewed"}
        </p>
      </div>

      <div className="flex gap-6 h-[65vh]">
        {/* Left — Inbox list */}
        <div className="w-2/5 bg-white rounded-[32px] border border-primary/5 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-primary/5 bg-primary/[0.02]">
            <h3 className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
              Inbox <span className="text-primary/65">({items.length})</span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-primary/5">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  setSelectedItem(item);
                  if (!item.is_read) {
                    void markRead(item.id);
                  }
                }}
                className={`p-5 cursor-pointer transition-all duration-300 hover:bg-primary/[0.03] ${selectedItem?.id === item.id ? 'border-l-4 border-primary bg-primary/[0.05]' : ''} ${!item.is_read ? 'bg-primary/[0.025]' : ''}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {!item.is_read ? <Mail className="w-4 h-4 text-primary shrink-0" /> : <MailOpen className="w-4 h-4 text-primary/20 shrink-0" />}
                  <h4 className={`font-bold text-sm truncate ${!item.is_read ? 'text-primary' : 'text-primary/50'}`}>{item.name}</h4>
                </div>
                <p className="text-primary/40 text-xs line-clamp-1 ml-7">{item.message}</p>
                <div className="flex items-center gap-1 text-primary/20 text-[10px] mt-2 ml-7">
                  <Clock className="w-3 h-3" /> {formatDate(item.created_at)}
                </div>
              </motion.div>
            ))}
            {items.length === 0 && (
              <div className="p-12 text-center text-primary/20">
                <Mail className="w-12 h-12 mx-auto mb-3" />
                <p className="font-serif italic">Inbox empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Right — Message Detail */}
        <div className="w-3/5 bg-white rounded-[32px] border border-primary/5 overflow-hidden flex flex-col">
          {selectedItem ? (
            <>
              <div className="p-8 border-b border-primary/5 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-primary">{selectedItem.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-primary/40">
                    <span>{selectedItem.email}</span>
                    {selectedItem.phone && <span>• {selectedItem.phone}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-primary/20 text-xs mt-2">
                    <Clock className="w-3 h-3" /> {formatDateTime(selectedItem.created_at)}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!selectedItem.is_read && (
                    <button onClick={() => void markRead(selectedItem.id)} className="flex items-center gap-2 rounded-xl border border-primary/10 bg-primary/[0.04] px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white">
                      <Check className="w-3.5 h-3.5" /> Mark Read
                    </button>
                  )}
                  <button onClick={() => setContactToDelete(selectedItem)} className="rounded-xl bg-primary/[0.04] p-2.5 text-primary/35 transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="bg-primary/[0.02] rounded-2xl p-8 border border-primary/5">
                  <p className="text-primary/70 text-lg font-serif italic leading-relaxed whitespace-pre-wrap">
                    &ldquo;{selectedItem.message}&rdquo;
                  </p>
                </div>

                {selectedItem.extra_fields && selectedItem.extra_fields.length > 0 ? (
                  <div className="mt-6 rounded-2xl border border-primary/5 bg-white p-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/25">
                      Additional form fields
                    </p>
                    <div className="mt-4 grid gap-4">
                      {selectedItem.extra_fields.map((field) => (
                        <div
                          key={`${field.field_id}-${field.label}`}
                          className="rounded-2xl border border-primary/5 bg-primary/[0.02] px-5 py-4"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">
                            {field.label}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-primary/65 whitespace-pre-wrap">
                            {field.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-primary/10">
              <div className="text-center">
                <MailOpen className="w-16 h-16 mx-auto mb-4" />
                <p className="font-serif italic text-lg">Select an inquiry to view</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={contactToDelete !== null}
        title="Delete inquiry"
        description={
          contactToDelete
            ? `Delete the inquiry from "${contactToDelete.name}" permanently?`
            : "Delete this inquiry?"
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        confirmTone="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleting) {
            setContactToDelete(null);
          }
        }}
      />
    </div>
  );
}
