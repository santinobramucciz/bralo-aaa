"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    priceEUR: number;
    imageUrl: string;
    slug: string;
    stock: number;
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const sid = localStorage.getItem("bralo_session") || crypto.randomUUID();
    localStorage.setItem("bralo_session", sid);
    setSessionId(sid);
    fetch(`/api/cart?sessionId=${sid}`)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId }),
    });
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId, quantity }),
    });
    const res = await fetch(`/api/cart?sessionId=${sessionId}`);
    setItems(await res.json());
  };

  const removeFromCart = async (productId: string) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId }),
    });
    const res = await fetch(`/api/cart?sessionId=${sessionId}`);
    setItems(await res.json());
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.priceEUR * item.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 flex gap-4">
              <div className="bg-gray-200 h-20 w-20 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                <div className="bg-gray-200 h-3 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi carrito</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-500 text-lg mb-6">Tu carrito está vacío</p>
          <Link href="/products" className="btn-bralo inline-block">Ver productos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 animate-fade-in">
                <Link href={`/products/${item.product.slug}`} className="w-20 h-20 bg-gradient-to-br from-bralo-50 to-bralo-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-bralo-300">{item.product.name.charAt(0)}</span>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`} className="font-semibold text-gray-900 hover:text-bralo-600 line-clamp-1">{item.product.name}</Link>
                  <p className="text-bralo-600 font-bold mt-1">{item.product.priceEUR.toFixed(2)} EUR</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg text-sm">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:text-gray-700">-</button>
                      <span className="px-2 py-1 font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:text-gray-700">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700 text-sm font-medium">Eliminar</button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900">{(item.product.priceEUR * item.quantity).toFixed(2)} EUR</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} artículos)</span>
                  <span className="font-medium">{subtotal.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Envío</span>
                  <span className="font-medium">{shipping === 0 ? "Gratis" : `${shipping.toFixed(2)} EUR`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-bralo-600">Envío gratis en pedidos superiores a 50 EUR</p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-bralo-600">{total.toFixed(2)} EUR</span>
                </div>
              </div>
              <Link href="/checkout" className="btn-bralo block text-center mt-6">
                Ir al checkout
              </Link>
              <Link href="/products" className="text-bralo-600 hover:text-bralo-700 text-sm font-medium text-center block mt-3">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
