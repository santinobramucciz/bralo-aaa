"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  orderId: string | null;
  read: boolean;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: "{}" });
    fetchNotifications();
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notificaciones</h2>
          <p className="text-sm text-gray-500">{unread} sin leer</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-bralo text-sm">
            Marcar todo como leido
          </button>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
            No hay notificaciones aun. Cuando alguien compre en tu tienda, aparecera aqui.
          </div>
        ) : notifications.map(n => (
          <div key={n.id} className={`bg-white rounded-xl border p-4 ${n.read ? "border-gray-100" : "border-bralo-300 bg-bralo-50"}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{n.type === "new_order" ? "🛒" : "🔔"}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{n.title}</h3>
                  {!n.read && <span className="bg-bralo-600 text-white text-xs px-2 py-0.5 rounded-full">Nuevo</span>}
                </div>
                <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString("es-ES")}</span>
                  {n.orderId && (
                    <Link href="/admin/orders" className="text-xs text-bralo-600 hover:text-bralo-800 font-medium">
                      Ver pedido
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
