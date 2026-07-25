import { Suspense } from "react";
import ProductsContent from "@/components/shop/ProductsContent";

export default function ProductsPage({ searchParams }: { searchParams?: { category?: string; search?: string } }) {
  const category = searchParams?.category || "";
  const search = searchParams?.search || "";
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><div className="animate-pulse space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 h-64 rounded-xl"></div>)}</div></div>}>
      <ProductsContent initialCategory={category} initialSearch={search} />
    </Suspense>
  );
}
