"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  priceEUR: number;
  imageUrl: string;
  category: string;
  tags: string;
  stock: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  const addToCart = async () => {
    if (!product) return;
    const sid = localStorage.getItem("bralo_session") || crypto.randomUUID();
    localStorage.setItem("bralo_session", sid);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sid, productId: product.id, quantity }),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-xl"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-6 rounded w-1/4"></div>
              <div className="bg-gray-200 h-8 rounded w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
        <Link href="/products" className="text-bralo-600 hover:text-bralo-700 font-medium">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-bralo-600">Inicio</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-bralo-600">Productos</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gradient-to-br from-bralo-50 to-bralo-100 rounded-2xl flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl font-bold text-bralo-300">{product.name.charAt(0)}</span>
          )}
        </div>

        <div>
          <span className="text-sm text-bralo-600 font-medium">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
            </div>
            <span className="text-sm text-gray-500">{product.salesCount} vendidos</span>
          </div>

          <div className="mt-6">
            <span className="text-4xl font-bold text-bralo-600">{product.priceEUR.toFixed(2)} EUR</span>
          </div>

          <p className="text-gray-600 mt-6 leading-relaxed">{product.description || product.shortDesc}</p>

          <div className="mt-6 flex items-center gap-4">
            <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.stock > 0 ? `${product.stock} en stock` : "Agotado"}
            </span>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-2 text-gray-500 hover:text-gray-700"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-3 py-2 text-gray-500 hover:text-gray-700"
              >
                +
              </button>
            </div>
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-3 rounded-lg font-bold text-lg transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : product.stock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "btn-bralo"
              }`}
            >
              {added ? "Añadido al carrito" : "Añadir al carrito"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Envío gratis en pedidos superiores a 50 EUR
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Devolución en 14 días
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Atención al cliente 24/7 por IA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
