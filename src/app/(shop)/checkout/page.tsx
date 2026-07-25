"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    priceEUR: number;
    imageUrl: string;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerLastName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "España",
    notes: "",
  });

  useEffect(() => {
    const sid = localStorage.getItem("bralo_session");
    if (!sid) { setLoading(false); return; }
    fetch(`/api/cart?sessionId=${sid}`)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.product.priceEUR * item.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map(item => ({
            productId: item.productId,
            productName: item.product.name,
            productImage: item.product.imageUrl,
            quantity: item.quantity,
            priceEUR: item.product.priceEUR,
          })),
        }),
      });

      const order = await res.json();
      if (order.orderNumber) {
        setOrderNumber(order.orderNumber);
        setSuccess(true);
        const sid = localStorage.getItem("bralo_session");
        if (sid) {
          await fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: sid }),
          });
        }
      }
    } catch (error) {
      alert("Error procesando el pedido. Inténtalo de nuevo.");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido confirmado!</h1>
        <p className="text-gray-500 text-lg mb-2">Tu número de pedido es:</p>
        <p className="text-2xl font-bold text-bralo-600 mb-8">{orderNumber}</p>
        <p className="text-gray-500 mb-8">
          Recibirás un email de confirmación en <strong>{form.customerEmail}</strong>.
          Nuestros agentes procesaran tu pedido y lo enviaran lo antes posible.
        </p>
        <button onClick={() => router.push("/")} className="btn-bralo">
          Volver a BraLo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {items.length === 0 && !loading ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-6">Tu carrito está vacío</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Datos de contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input type="text" required value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bralo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                  <input type="text" required value={form.customerLastName} onChange={e => setForm({...form, customerLastName: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bralo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" required value={form.customerEmail} onChange={e => setForm({...form, customerEmail: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bralo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input type="tel" required value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bralo-500 focus:border-transparent" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Dirección de envío</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input type="text" required value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bralo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input type="text" required value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bralo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código postal *</label>
                  <input type="text" required value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bralo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                  <input type="text" value={form.country} disabled
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500" />
                  <p className="text-xs text-gray-400 mt-1">Solo envíos en EUR a España</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                  <input type="text" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bralo-500 focus:border-transparent" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tu pedido</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.product.name} x{item.quantity}</span>
                    <span className="font-medium">{(item.product.priceEUR * item.quantity).toFixed(2)} EUR</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{subtotal.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Envío</span>
                  <span>{shipping === 0 ? "Gratis" : `${shipping.toFixed(2)} EUR`}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-bralo-600">{total.toFixed(2)} EUR</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting || items.length === 0}
                className="btn-bralo w-full mt-6 text-center disabled:opacity-50"
              >
                {submitting ? "Procesando..." : "Confirmar pedido"}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Pago contra reembolso. Procesaremos tu pedido lo antes posible.
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
