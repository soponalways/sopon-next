"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UserData { id: string; name: string; email: string; role: string; createdAt: string; image?: string; }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users").then(r => r.json()).then(data => {
      setUsers(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3 mb-1">
          <Users className="w-7 h-7 text-primary" /> Users
        </h1>
        <p className="text-base-content/60">All registered users in your portfolio system</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary" /></div>
      ) : (
        <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-9 h-9 rounded-full">
                            <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} alt={user.name} />
                          </div>
                        </div>
                        <span className="font-medium text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/60 font-mono">{user.email}</td>
                    <td>
                      <div className={`badge gap-1 ${user.role === "admin" ? "badge-primary" : "badge-ghost"}`}>
                        {user.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role}
                      </div>
                    </td>
                    <td className="text-sm text-base-content/50">{formatDate(user.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="text-center py-16 text-base-content/40">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No users found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
