"use client";

import { useState, useEffect } from "react";

interface AgentLog {
  id: string;
  agent: string;
  action: string;
  input: string;
  output: string;
  status: string;
  durationMs: number;
  createdAt: string;
}

const AGENT_INFO: Record<string, { icon: string; label: string; color: string }> = {
  buscador: { icon: "🔍", label: "Buscador de productos", color: "bg-blue-100 text-blue-700" },
  comparador: { icon: "⚖️", label: "Comparador de plataformas", color: "bg-orange-100 text-orange-700" },
  validador: { icon: "✅", label: "Validador de productos", color: "bg-green-100 text-green-700" },
  precios: { icon: "💰", label: "Agente de precios", color: "bg-yellow-100 text-yellow-700" },
  publicador: { icon: "📝", label: "Agente publicador", color: "bg-purple-100 text-purple-700" },
  marketing: { icon: "📢", label: "Agente de marketing", color: "bg-pink-100 text-pink-700" },
  soporte: { icon: "💬", label: "Agente de soporte", color: "bg-cyan-100 text-cyan-700" },
  operaciones: { icon: "📦", label: "Agente de operaciones", color: "bg-indigo-100 text-indigo-700" },
  supervisor: { icon: "👔", label: "Agente supervisor", color: "bg-gray-100 text-gray-700" },
  sistema: { icon: "⚙️", label: "Sistema", color: "bg-gray-100 text-gray-700" },
};

export default function AdminAgentsPage() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    const res = await fetch("/api/agents");
    const data = await res.json();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const runPipeline = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/agents/run", { method: "POST" });
      const data = await res.json();
      alert(`Pipeline completado!\n${data.stats?.productsFound || 0} productos encontrados, ${data.stats?.productsPublished || 0} publicados`);
      fetchLogs();
    } catch {
      alert("Error ejecutando pipeline");
    }
    setRunning(false);
  };

  const filtered = filter ? logs.filter(l => l.agent === filter) : logs;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={runPipeline} disabled={running} className="btn-bralo flex items-center gap-2 disabled:opacity-50">
          <span className="text-lg">🤖</span>
          {running ? "Ejecutando pipeline..." : "Ejecutar pipeline completo"}
        </button>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">Todos los agentes</option>
          {Object.entries(AGENT_INFO).map(([k, v]) => (
            <option key={k} value={k}>{v.icon} {v.label}</option>
          ))}
        </select>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(AGENT_INFO).map(([key, info]) => {
          const count = logs.filter(l => l.agent === key).length;
          const errors = logs.filter(l => l.agent === key && l.status === "error").length;
          return (
            <button key={key} onClick={() => setFilter(filter === key ? "" : key)}
              className={`bg-white rounded-xl border p-4 text-center card-hover ${filter === key ? "border-bralo-500 ring-2 ring-bralo-200" : "border-gray-100"}`}>
              <span className="text-2xl">{info.icon}</span>
              <p className="font-medium text-sm text-gray-900 mt-1">{info.label}</p>
              <p className="text-xs text-gray-500">{count} acciones</p>
              {errors > 0 && <p className="text-xs text-red-500 mt-1">{errors} errores</p>}
            </button>
          );
        })}
      </div>

      {/* Logs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Agente</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Acción</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Duración</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Fecha</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Cargando logs...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No hay logs de agentes</td></tr>
              ) : filtered.slice(0, 50).map(log => {
                const info = AGENT_INFO[log.agent] || AGENT_INFO.sistema;
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${info.color}`}>
                        {info.icon} {info.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{log.action}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`w-2 h-2 inline-block rounded-full ${log.status === "success" ? "bg-green-400" : "bg-red-400"}`}></span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">{log.durationMs}ms</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(log.createdAt).toLocaleString("es-ES")}</td>
                    <td className="px-4 py-3">
                      <details className="group">
                        <summary className="text-bralo-600 text-xs cursor-pointer hover:text-bralo-800">Ver</summary>
                        <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 max-w-md overflow-x-auto whitespace-pre-wrap">
                          {log.output || log.input || "Sin datos"}
                        </div>
                      </details>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
