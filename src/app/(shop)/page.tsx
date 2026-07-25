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
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?limit=6&featured=true").then(r => r.json()),
      fetch("/api/products?limit=8&sort=createdAt").then(r => r.json()),
    ]).then(([feat, lat]) => {
      setFeatured(feat.products || []);
      setLatest(lat.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="gradient-bralo text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 mb-6 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Gestionado 100% por Inteligencia Artificial
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              BraLo
              <span className="block text-bralo-200 text-2xl md:text-3xl font-medium mt-2">Tu tienda inteligente</span>
            </h1>
            <p className="text-lg text-bralo-200 mb-8 max-w-lg">
              Productos curados por IA, precios calculados inteligentemente y atención automática. Descubre ofertas que otros no encuentran.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="bg-white text-bralo-700 hover:bg-bralo-50 font-bold py-3 px-8 rounded-lg transition-colors text-lg">
                Ver productos
              </Link>
              <Link href="/products?category=IA y Software" className="border-2 border-white/30 hover:border-white text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg">
                Productos IA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-bralo-600">IA Activa</div>
              <div className="text-sm text-gray-500">8 agentes trabajando</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bralo-600">EUR</div>
              <div className="text-sm text-gray-500">Solo euros, sin sorpresas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bralo-600">24/7</div>
              <div className="text-sm text-gray-500">Tienda siempre activa</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bralo-600">Gratis</div>
              <div className="text-sm text-gray-500">Envío en pedidos +50 EUR</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Destacados</h2>
              <p className="text-gray-500 mt-1">Productos seleccionados por nuestra IA</p>
            </div>
            <Link href="/products" className="text-bralo-600 hover:text-bralo-700 font-medium text-sm">Ver todos &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Últimos productos</h2>
            <p className="text-gray-500 mt-1">Recién añadidos por nuestros agentes</p>
          </div>
          <Link href="/products" className="text-bralo-600 hover:text-bralo-700 font-medium text-sm">Ver todos &rarr;</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-bralo-50 border-t border-bralo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Todo automatizado?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Sí. BraLo utiliza 8 agentes de IA que buscan productos, calculan precios, publican fichas, crean contenido de marketing y gestionan pedidos automáticamente.
          </p>
          <Link href="/admin" className="btn-bralo inline-block">
            Acceder al Panel Admin
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const sid = localStorage.getItem("bralo_session") || crypto.randomUUID();
    localStorage.setItem("bralo_session", sid);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sid, productId: product.id, quantity: 1 }),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/products/${product.slug}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover block">
      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-bralo-50 to-bralo-100 flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-bralo-300">{product.name.charAt(0)}</span>
          )}
        </div>
        {product.featured && (
          <span className="absolute top-2 left-2 bg-bralo-600 text-white text-xs px-2 py-1 rounded-full font-medium">Destacado</span>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-bralo-600 font-medium">{product.category}</span>
        <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.shortDesc}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-bralo-600">{product.priceEUR.toFixed(2)} EUR</span>
          <button
            onClick={addToCart}
            className={`text-sm font-medium py-1.5 px-3 rounded-lg transition-all ${
              added
                ? "bg-green-500 text-white"
                : "bg-bralo-100 text-bralo-700 hover:bg-bralo-600 hover:text-white"
            }`}
          >
            {added ? "Añadido" : "Añadir"}
          </button>
        </div>
      </div>
    </Link>
  );
}
