"use client";

import { useState, useEffect } from "react";

interface DailyReport {
  id: string;
  date: string;
  summary: string;
  productsFound: number;
  productsApproved: number;
  productsPublished: number;
  totalSalesEUR: number;
  totalOrders: number;
  messagesHandled: number;
  marketingPosts: number;
  incidents: number;
  details: string;
  createdAt: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DailyReport | null>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then(r => r.json())
      .then(data => { setReports(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{reports.length} reportes diarios</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Cargando reportes...</div>
          ) : reports.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
              No hay reportes todavía. Ejecuta el pipeline de agentes para generar el primer reporte.
            </div>
          ) : reports.map(r => (
            <button key={r.id} onClick={() => setSelected(r)}
              className={`w-full text-left bg-white rounded-xl border p-4 card-hover ${selected?.id === r.id ? "border-bralo-500 ring-2 ring-bralo-200" : "border-gray-100"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{r.date}</p>
                  <p className="text-xs text-gray-500 mt-1">{r.totalOrders} pedidos | {r.totalSalesEUR.toFixed(2)} EUR</p>
                </div>
                {r.incidents > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{r.incidents} incidencias</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Reporte {selected.date}</h3>
                <span className="text-sm text-gray-500">Generado por agente supervisor</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-bralo-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-bralo-600">{selected.productsFound}</p>
                  <p className="text-xs text-gray-600">Encontrados</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{selected.productsApproved}</p>
                  <p className="text-xs text-gray-600">Aprobados</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">{selected.productsPublished}</p>
                  <p className="text-xs text-gray-600">Publicados</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{selected.marketingPosts}</p>
                  <p className="text-xs text-gray-600">Posts marketing</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selected.totalSalesEUR.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">EUR facturados</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selected.totalOrders}</p>
                  <p className="text-xs text-gray-600">Pedidos totales</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selected.messagesHandled}</p>
                  <p className="text-xs text-gray-600">Mensajes respondidos</p>
                </div>
              </div>

              {selected.incidents > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-medium text-red-800">⚠️ {selected.incidents} incidencia(s) detectada(s)</p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Resumen del supervisor</h4>
                <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {selected.summary}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
              Selecciona un reporte para ver los detalles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
