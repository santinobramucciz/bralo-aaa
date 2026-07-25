"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  priceEUR: number;
  imageUrl: string;
  category: string;
  shortDesc: string;
  rating: number;
  salesCount: number;
  featured: boolean;
  stock: number;
}

const CATEGORIES = ["Tecnología", "Hogar", "Fitness", "Belleza", "Moda", "Mascotas", "Cocina", "Oficina", "Juguetes", " IA y Software"];

export default function ProductsContent({ initialCategory, initialSearch }: { initialCategory: string; initialSearch: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState("createdAt");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    params.set("sort", sort);
    params.set("page", page.toString());
    params.set("limit", "12");

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [category, search, sort, page]);

  const addToCart = async (productId: string) => {
    const sid = localStorage.getItem("bralo_session") || crypto.randomUUID();
    localStorage.setItem("bralo_session", sid);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sid, productId, quantity: 1 }),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {category || "Todos los productos"}
        </h1>
        <p className="text-gray-500 mt-1">
          {search ? `Resultados para "${search}"` : "Descubre lo que nuestros agentes de IA han seleccionado para ti"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => { setCategory(""); setPage(1); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !category ? "bg-bralo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-bralo-300"
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => { setCategory(c); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              category === c ? "bg-bralo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-bralo-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="createdAt">Más recientes</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="popular">Más vendidos</option>
          <option value="rating">Mejor valorados</option>
        </select>
        <span className="text-sm text-gray-500">{products.length} productos</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No se encontraron productos</p>
          <button onClick={() => { setCategory(""); setSearch(""); }} className="text-bralo-600 hover:text-bralo-700 font-medium mt-4">
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <Link key={p.id} href={`/products/${p.slug}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover block">
              <div className="aspect-[4/3] bg-gradient-to-br from-bralo-50 to-bralo-100 flex items-center justify-center">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-bralo-300">{p.name.charAt(0)}</span>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-bralo-600 font-medium">{p.category}</span>
                <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2">{p.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-bralo-600">{p.priceEUR.toFixed(2)} EUR</span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p.id); }}
                    className="text-sm font-medium py-1.5 px-3 rounded-lg bg-bralo-100 text-bralo-700 hover:bg-bralo-600 hover:text-white transition-all"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 hover:border-bralo-300"
          >
            Anterior
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                page === i + 1 ? "bg-bralo-600 text-white" : "border border-gray-200 hover:border-bralo-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 hover:border-bralo-300"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
