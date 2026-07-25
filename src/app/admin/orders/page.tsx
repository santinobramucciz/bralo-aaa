"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  postalCode: string;
  totalEUR: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { productName: string; quantity: number; priceEUR: number; productId: string | null; sourceUrl: string | null }[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  returned: "Devuelto",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  returned: "bg-orange-100 text-orange-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
    if (selectedOrder?.id === orderId) {
      const res = await fetch(`/api/orders/${orderId}`);
      setSelectedOrder(await res.json());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">{orders.length} pedidos</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Pedido</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Cliente</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Total</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-500">Estado</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-12 text-gray-400">Cargando...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-gray-400">No hay pedidos aún</td></tr>
                  ) : orders.map(o => (
                    <tr key={o.id} className={`hover:bg-gray-50 cursor-pointer ${selectedOrder?.id === o.id ? "bg-bralo-50" : ""}`}
                      onClick={() => setSelectedOrder(o)}>
                      <td className="px-4 py-3">
                        <p className="font-mono font-medium text-gray-900">{o.orderNumber}</p>
                        <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString("es-ES")}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{o.customerName} {o.customerLastName}</p>
                        <p className="text-xs text-gray-500">{o.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-bralo-600">{o.totalEUR.toFixed(2)} EUR</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-700"}`}>
                          {STATUS_LABELS[o.status] || o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={o.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateStatus(o.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded px-2 py-1"
                        >
                          {Object.entries(STATUS_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Detail */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24 space-y-4">
              <h3 className="font-bold text-gray-900">{selectedOrder.orderNumber}</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Cliente:</span> <span className="font-medium">{selectedOrder.customerName} {selectedOrder.customerLastName}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedOrder.customerEmail}</span></div>
                <div><span className="text-gray-500">Tel:</span> <span className="font-medium">{selectedOrder.customerPhone}</span></div>
                <div><span className="text-gray-500">Direccion:</span> <span className="font-medium">{selectedOrder.address}, {selectedOrder.postalCode} {selectedOrder.city}</span></div>
                <div><span className="text-gray-500">Fecha:</span> <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString("es-ES")}</span></div>
                <div><span className="text-gray-500">Pago:</span> <span className="font-medium">{selectedOrder.paymentStatus}</span></div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Artículos</h4>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-gray-600">{item.productName} x{item.quantity}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{(item.priceEUR * item.quantity).toFixed(2)} EUR</span>
                      {item.sourceUrl && (
                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-orange-500 hover:text-orange-600 underline"
                          onClick={e => e.stopPropagation()}>
                          AliExpress
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-bralo-600">{selectedOrder.totalEUR.toFixed(2)} EUR</span>
                </div>
              </div>

              {selectedOrder.status === "pending" && (
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    item.sourceUrl && (
                      <a key={i}
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
                      >
                        Comprar "{item.productName}" en AliExpress
                      </a>
                    )
                  ))}
                  <p className="text-xs text-gray-400 text-center">Compra cada producto en su enlace de AliExpress con la dirección del cliente</p>
                </div>
              )}

              {selectedOrder.status === "confirmed" && (
                <div className="border-t border-gray-100 pt-4">
                  <button
                    onClick={() => updateStatus(selectedOrder.id, "shipped")}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Marcar como enviado
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-gray-400">
              Selecciona un pedido para ver los detalles
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50">Anterior</button>
          <span className="text-sm text-gray-500">Página {page} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50">Siguiente</button>
        </div>
      )}
    </div>
  );
}
