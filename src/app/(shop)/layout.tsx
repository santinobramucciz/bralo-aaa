"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const sid = localStorage.getItem("bralo_session") || crypto.randomUUID();
    localStorage.setItem("bralo_session", sid);
    fetch(`/api/cart?sessionId=${sid}`)
      .then(r => r.json())
      .then(items => setCartCount(items.reduce((s: number, i: any) => s + i.quantity, 0)))
      .catch(() => {});
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 gradient-bralo rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BraLo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-bralo-600 font-medium transition-colors">Inicio</Link>
            <Link href="/products" className="text-gray-600 hover:text-bralo-600 font-medium transition-colors">Productos</Link>
            <Link href="/products?category=IA y Software" className="text-gray-600 hover:text-bralo-600 font-medium transition-colors">IA & Tech</Link>
          </nav>

          <div className="flex items-center gap-3">
            {searchOpen ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-bralo-500 focus:border-transparent w-48"
                  autoFocus
                />
                <Link
                  href={`/products?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setSearchOpen(false)}
                  className="text-bralo-600 hover:text-bralo-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </Link>
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-gray-500 hover:text-bralo-600 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            )}

            <Link href="/cart" className="relative text-gray-500 hover:text-bralo-600 p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-bralo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-500 hover:text-bralo-600 p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-fade-in">
            <nav className="flex flex-col gap-3">
              <Link href="/" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-bralo-600 font-medium py-2">Inicio</Link>
              <Link href="/products" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-bralo-600 font-medium py-2">Productos</Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-bralo-600 font-medium py-2">Carrito</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-bralo rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-white font-bold text-lg">BraLo</span>
            </div>
            <p className="text-sm">Tu tienda online gestionada por inteligencia artificial. Productos de calidad, precios justos.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Tienda</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">Todos los productos</Link></li>
              <li><Link href="/products?category=Tecnología" className="hover:text-white transition-colors">Tecnología</Link></li>
              <li><Link href="/products?category=Hogar" className="hover:text-white transition-colors">Hogar</Link></li>
              <li><Link href="/products?category=IA y Software" className="hover:text-white transition-colors">IA & Software</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Ayuda</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Envíos</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Devoluciones</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Contacto</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">FAQ</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacidad</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Términos</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Cookies</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BraLo. Todos los derechos reservados. Gestionado por IA.</p>
        </div>
      </div>
    </footer>
  );
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
