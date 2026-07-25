"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  priceEUR: number;
  costEUR: number;
  marginPct: number;
  imageUrl: string;
  category: string;
  stock: number;
  status: string;
  salesCount: number;
  featured: boolean;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", priceEUR: 0, costEUR: 0, category: "Tecnología", stock: 20, imageUrl: "" });

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", "20");
    if (statusFilter) params.set("status", statusFilter);
    else params.set("status", "");
    if (search) params.set("search", search);
    if (categoryFilter) params.set("category", categoryFilter);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [page, statusFilter, categoryFilter]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setEditingProduct(null);
    setForm({ name: "", description: "", priceEUR: 0, costEUR: 0, category: "Tecnología", stock: 20, imageUrl: "" });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ name: p.name, description: "", priceEUR: p.priceEUR, costEUR: p.costEUR, category: p.category, stock: p.stock, imageUrl: p.imageUrl });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => { setShowForm(true); setEditingProduct(null); setForm({ name: "", description: "", priceEUR: 0, costEUR: 0, category: "Tecnología", stock: 20, imageUrl: "" }); }}
          className="btn-bralo">
          + Nuevo producto
        </button>
        <input type="text" placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchProducts()}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">Todas las categorías</option>
          {["Tecnología","Hogar","Fitness","Belleza","Moda","Mascotas","Cocina","Oficina","Juguetes"," IA y Software"].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="draft">Borrador</option>
          <option value="paused">Pausado</option>
          <option value="archived">Archivado</option>
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editingProduct ? "Editar producto" : "Nuevo producto"}</h3>
              <button onClick={() => { setShowForm(false); setEditingProduct(null); }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (EUR) *</label>
                  <input type="number" step="0.01" required value={form.priceEUR} onChange={e => setForm({...form, priceEUR: parseFloat(e.target.value)})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coste (EUR)</label>
                  <input type="number" step="0.01" value={form.costEUR} onChange={e => setForm({...form, costEUR: parseFloat(e.target.value)})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2">
                    {["Tecnología","Hogar","Fitness","Belleza","Moda","Mascotas","Cocina","Oficina","Juguetes"," IA y Software"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value)})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL imagen</label>
                <input type="url" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="https://..." />
              </div>
              {form.costEUR > 0 && form.priceEUR > 0 && (
                <div className="bg-bralo-50 rounded-lg p-3 text-sm">
                  <span className="text-bralo-700 font-medium">
                    Margen: {(((form.priceEUR - form.costEUR) / form.priceEUR) * 100).toFixed(1)}% | 
                    Beneficio: {(form.priceEUR - form.costEUR).toFixed(2)} EUR
                  </span>
                </div>
              )}
              <button type="submit" className="btn-bralo w-full">
                {editingProduct ? "Guardar cambios" : "Crear producto"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Producto</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Categoría</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Precio</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Coste</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Margen</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Stock</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Estado</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">Cargando...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No hay productos. Ejecuta el pipeline de IA para añadir productos.</td></tr>
              ) : products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-bralo-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <span className="text-bralo-400 font-bold">{p.name.charAt(0)}</span>}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[200px]">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.salesCount} vendidos</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-right font-bold text-bralo-600">{p.priceEUR.toFixed(2)} EUR</td>
                  <td className="px-4 py-3 text-right text-gray-600">{p.costEUR.toFixed(2)} EUR</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-medium ${p.marginPct >= 40 ? "text-green-600" : p.marginPct >= 20 ? "text-yellow-600" : "text-red-600"}`}>
                      {p.marginPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{p.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      p.status === "active" ? "bg-green-100 text-green-700" :
                      p.status === "draft" ? "bg-gray-100 text-gray-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => startEdit(p)} className="text-bralo-600 hover:text-bralo-800 text-sm">Editar</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-sm">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
