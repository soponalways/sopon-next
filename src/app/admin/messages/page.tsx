"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Trash2, Check, Mail, Clock } from "lucide-react";
import { toast } from "@/components/ui/Toaster";
import { formatDate } from "@/lib/utils";

interface Message { id: string; name: string; email: string; subject: string; message: string; read: boolean; createdAt: string; }

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchMessages = async () => {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: "PATCH" });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, read: true } : null);
    toast("Marked as read", "success");
  };

  const deleteMsg = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    toast("Message deleted", "success");
    if (selected?.id === id) setSelected(null);
    fetchMessages();
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3 mb-1">
          <MessageSquare className="w-7 h-7 text-primary" /> Messages
          {unreadCount > 0 && <span className="badge badge-primary">{unreadCount} new</span>}
        </h1>
        <p className="text-base-content/60">Contact form submissions from your portfolio</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message List */}
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-base-content/40 bg-base-100 rounded-2xl border border-base-300/50">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No messages yet</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => { setSelected(msg); if (!msg.read) markRead(msg.id); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    selected?.id === msg.id ? "border-primary/40 bg-primary/5" :
                    !msg.read ? "border-primary/20 bg-primary/5 hover:border-primary/40" :
                    "border-base-300/50 bg-base-100 hover:border-base-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm truncate">{msg.name}</p>
                        {!msg.read && <span className="badge badge-primary badge-xs flex-shrink-0">new</span>}
                      </div>
                      <p className="text-xs text-primary font-medium truncate mb-1">{msg.subject}</p>
                      <p className="text-xs text-base-content/50 line-clamp-2">{msg.message}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-base-content/40">
                        <Clock className="w-3 h-3" />
                        {formatDate(msg.createdAt)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {!msg.read && (
                        <button onClick={e => { e.stopPropagation(); markRead(msg.id); }} className="btn btn-ghost btn-xs text-success" title="Mark as read">
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                      <button onClick={e => { e.stopPropagation(); deleteMsg(msg.id); }} className="btn btn-ghost btn-xs text-error">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-base-100 rounded-2xl border border-base-300/50 p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-display font-bold text-lg">{selected.name}</h3>
                      <a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {selected.email}
                      </a>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-base-content/40">{formatDate(selected.createdAt)}</p>
                      {!selected.read && <span className="badge badge-primary badge-xs mt-1">Unread</span>}
                    </div>
                  </div>
                  <div className="bg-primary/5 rounded-xl px-4 py-2 mb-4 border border-primary/10">
                    <p className="text-xs text-base-content/50 mb-1">Subject</p>
                    <p className="font-semibold">{selected.subject}</p>
                  </div>
                  <div className="bg-base-200/50 rounded-xl p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-primary btn-sm flex-1 rounded-xl gap-2">
                      <Mail className="w-3.5 h-3.5" /> Reply
                    </a>
                    <button onClick={() => deleteMsg(selected.id)} className="btn btn-error btn-outline btn-sm rounded-xl gap-2">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-base-100 rounded-2xl border border-base-300/50 p-10 text-center text-base-content/40"
                >
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select a message to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
