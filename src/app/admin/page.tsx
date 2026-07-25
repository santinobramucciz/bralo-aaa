"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenueEUR: number;
  agentActions24h: number;
  agentErrors: number;
  pendingMessages: number;
  topProducts: { name: string; salesCount: number; priceEUR: number }[];
  recentOrders: { orderNumber: string; customerName: string; totalEUR: number; status: string; createdAt: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningAgents, setRunningAgents] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const runAgents = async () => {
    setRunningAgents(true);
    try {
      const res = await fetch("/api/agents/run", { method: "POST" });
      const data = await res.json();
      alert(`Pipeline completado!\nProductos: ${data.stats?.productsFound || 0} encontrados, ${data.stats?.productsPublished || 0} publicados`);
      const statsRes = await fetch("/api/dashboard");
      setStats(await statsRes.json());
    } catch {
      alert("Error ejecutando agentes");
    }
    setRunningAgents(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="bg-gray-200 h-4 rounded w-1/2 mb-3"></div>
              <div className="bg-gray-200 h-8 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={runAgents} disabled={runningAgents}
          className="btn-bralo flex items-center gap-2 disabled:opacity-50">
          <span className="text-lg">🤖</span>
          {runningAgents ? "Ejecutando agentes..." : "Ejecutar pipeline de IA"}
        </button>
        <Link href="/admin/products" className="btn-bralo-outline flex items-center gap-2">
          <span className="text-lg">📦</span> Gestionar productos
        </Link>
        <Link href="/admin/orders" className="btn-bralo-outline flex items-center gap-2">
          <span className="text-lg">🛒</span> Ver pedidos
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-100 card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bralo-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Productos activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Facturación total</p>
              <p className="text-2xl font-bold text-gray-900">{(stats?.totalRevenueEUR || 0).toFixed(2)} EUR</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pedidos totales</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Acciones IA (24h)</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.agentActions24h || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {stats && stats.agentErrors > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-medium text-red-800">{stats.agentErrors} errores en agentes</p>
            <p className="text-sm text-red-600">Revisa los logs en la sección de agentes</p>
          </div>
          <Link href="/admin/agents" className="ml-auto text-red-600 hover:text-red-800 font-medium text-sm">Ver logs</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Pedidos recientes</h3>
            <Link href="/admin/orders" className="text-bralo-600 hover:text-bralo-700 text-sm font-medium">Ver todos</Link>
          </div>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map(order => (
                <div key={order.orderNumber} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-bralo-600">{order.totalEUR.toFixed(2)} EUR</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === "delivered" ? "bg-green-100 text-green-700" :
                      order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                      order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">No hay pedidos aún</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Productos más vendidos</h3>
            <Link href="/admin/products" className="text-bralo-600 hover:text-bralo-700 text-sm font-medium">Ver todos</Link>
          </div>
          {stats?.topProducts && stats.topProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                    <p className="font-medium text-sm text-gray-900 truncate max-w-[200px]">{p.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-bralo-600">{p.priceEUR.toFixed(2)} EUR</p>
                    <p className="text-xs text-gray-500">{p.salesCount} vendidos</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">No hay ventas aún</p>
          )}
        </div>
      </div>

      {/* Agent Status */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Estado de los agentes IA</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Buscador", icon: "🔍", desc: "Busca productos" },
            { name: "Validador", icon: "✅", desc: "Evalúa potencial" },
            { name: "Precios", icon: "💰", desc: "Calcula márgenes" },
            { name: "Publicador", icon: "📝", desc: "Crea fichas" },
            { name: "Marketing", icon: "📢", desc: "Crea contenido" },
            { name: "Soporte", icon: "💬", desc: "Responde clientes" },
            { name: "Operaciones", icon: "📦", desc: "Gestiona pedidos" },
            { name: "Supervisor", icon: "👔", desc: "Reporta diario" },
          ].map(agent => (
            <div key={agent.name} className="bg-gray-50 rounded-lg p-3 text-center">
              <span className="text-2xl">{agent.icon}</span>
              <p className="font-medium text-sm text-gray-900 mt-1">{agent.name}</p>
              <p className="text-xs text-gray-500">{agent.desc}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-xs text-green-600">Activo</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
