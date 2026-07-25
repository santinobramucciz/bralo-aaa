export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  priceEUR: number;
  costEUR: number;
  marginPct: number;
  imageUrl: string;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  sku: string | null;
  sourceUrl: string | null;
  source: string | null;
  status: string;
  featured: boolean;
  views: number;
  salesCount: number;
  rating: number;
  reviewCount: number;
  seoTitle: string | null;
  seoDesc: string | null;
  variants: ProductVariant[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  name: string;
  priceEUR: number;
  stock: number;
  sku?: string;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  totalEUR: number;
  subtotalEUR: number;
  shippingEUR: number;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  items: OrderItemType[];
  logs: OrderLogType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemType {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  priceEUR: number;
  totalEUR: number;
}

export interface OrderLogType {
  id: string;
  orderId: string;
  status: string;
  message: string | null;
  agent: string | null;
  createdAt: Date;
}

export interface AgentLogType {
  id: string;
  agent: string;
  action: string;
  input: string;
  output: string;
  status: string;
  durationMs: number;
  createdAt: Date;
}

export interface DailyReportType {
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
  details: Record<string, unknown>;
  createdAt: Date;
}

export interface MessageType {
  id: string;
  customerName: string;
  customerEmail: string | null;
  subject: string;
  body: string;
  reply: string | null;
  status: string;
  handledBy: string | null;
  orderId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemType {
  id: string;
  sessionId: string;
  productId: string;
  quantity: number;
  product: ProductType;
}

export type AgentName =
  | "buscador"
  | "validador"
  | "precios"
  | "publicador"
  | "marketing"
  | "soporte"
  | "operaciones"
  | "supervisor";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type ProductStatus =
  | "draft"
  | "active"
  | "paused"
  | "archived";
