"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [email, setEmail] = useState("admin@bralo.es");
  const [storeName, setStoreName] = useState("BraLo");
  const [currency, setCurrency] = useState("EUR");
  const [autoAgents, setAutoAgents] = useState(true);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
        <h3 className="font-bold text-gray-900">Configuración de BraLo</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la tienda</label>
          <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email del administrador</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
          <input type="text" value="EUR - Euro (€)" disabled
            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500" />
          <p className="text-xs text-gray-400 mt-1">BraLo solo opera en euros. Esta configuración no se puede cambiar.</p>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div>
            <p className="font-medium text-gray-900">Ejecución automática de agentes</p>
            <p className="text-sm text-gray-500">Ejecutar pipeline de IA automáticamente cada día</p>
          </div>
          <button
            onClick={() => setAutoAgents(!autoAgents)}
            className={`w-12 h-6 rounded-full transition-colors ${autoAgents ? "bg-bralo-600" : "bg-gray-300"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${autoAgents ? "translate-x-6" : "translate-x-0.5"}`}></div>
          </button>
        </div>

        <div className="bg-bralo-50 rounded-lg p-4 text-sm text-bralo-700">
          <p className="font-medium mb-1">Moneda: EUR</p>
          <p>Todos los precios, costes, márgenes y reportes económicos de BraLo se muestran y calculan exclusivamente en euros (EUR). No se permiten otras monedas en ningún punto del sistema.</p>
        </div>

        <button className="btn-bralo">Guardar configuración</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Información del sistema</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Versión</span><span className="font-medium">BraLo v1.0.0</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Base de datos</span><span className="font-medium">SQLite (local)</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Agentes IA</span><span className="font-medium">8 activos</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Moneda</span><span className="font-medium">EUR (Euro)</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Framework</span><span className="font-medium">Next.js 14</span></div>
        </div>
      </div>
    </div>
  );
}
