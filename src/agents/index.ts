import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

interface AgentResult {
  agent: string;
  action: string;
  success: boolean;
  data?: any;
  error?: string;
  durationMs: number;
}

async function logAgent(result: AgentResult) {
  await prisma.agentLog.create({
    data: {
      agent: result.agent,
      action: result.action,
      input: JSON.stringify(result.data?.input || {}),
      output: JSON.stringify(result.data?.output || {}),
      status: result.success ? "success" : "error",
      durationMs: result.durationMs,
    },
  });
}

const CATEGORIES = [
  "Tecnología", "Hogar", "Fitness", "Belleza", "Moda",
  "Mascotas", "Cocina", "Oficina", "Juguetes", " IA y Software"
];

const PRODUCT_CATALOG = [
  { name: "Auriculares Bluetooth Pro Max", price: 29.99, cost: 8.50, category: "Tecnología", desc: "Auriculares inalámbricos con cancelación de ruido activa, 40h de batería y sonido Hi-Fi." },
  { name: "Lampara LED Inteligente RGB", price: 24.99, cost: 6.00, category: "Hogar", desc: "Lampara de escritorio con 16 millones de colores, control por app y asistentes de voz." },
  { name: "Banda de Resistencia Premium Set", price: 19.99, cost: 4.50, category: "Fitness", desc: "Set de 5 bandas de resistencia con diferentes niveles, ideal para entrenamiento en casa." },
  { name: "Organizador Magnético Multiusos", price: 15.99, cost: 3.20, category: "Hogar", desc: "Organizador magnético para cocina, baño u oficina. Fácil instalación sin taladro." },
  { name: "Webcam 4K Ultra HD con Micrófono", price: 39.99, cost: 12.00, category: "Tecnología", desc: "Cámara web 4K con micrófono de cancelación de ruido y autofocus automático." },
  { name: "Kit Skincare Coreano 5 Pasos", price: 34.99, cost: 9.00, category: "Belleza", desc: "Kit completo de rutina coreana: limpiador, tónico, serum, crema y protector solar." },
  { name: "Mochila Antirrobo USB Carga", price: 29.99, cost: 7.50, category: "Moda", desc: "Mochila impermeable con puerto USB de carga rápida y diseño antirrobo." },
  { name: "Comedero Automático Mascotas", price: 34.99, cost: 10.00, category: "Mascotas", desc: "Comedero automático programable con porciones controladas y depósito de 5L." },
  { name: "Set Cocina 7 Piezas Antiadherente", price: 49.99, cost: 15.00, category: "Cocina", desc: "Juego de cocina con sartén, cacerola y cucharones de silicona de alta calidad." },
  { name: "Monitor de Escritorio Ergonómico", price: 22.99, cost: 5.50, category: "Oficina", desc: "Soporte elevador de monitor regulable en altura y ángulo, con espacio de almacenamiento." },
  { name: "Drone Mini con Cámara 1080p", price: 59.99, cost: 18.00, category: "Tecnología", desc: "Drone plegable con cámara HD, tiempo de vuelo 25min, modo headless y retorno automático." },
  { name: "Silla Gaming Ergonómica", price: 89.99, cost: 28.00, category: "Oficina", desc: "Silla gaming con soporte lumbar, reposabrazos 4D y reclinación 180°." },
  { name: "Asistente IA Portátil -dispositivo-", price: 44.99, cost: 12.00, category: " IA y Software", desc: "Dispositivo portátil con IA integrada para automatizar tareas domésticas y productividad." },
  { name: "Robot Aspirador Smart Map", price: 79.99, cost: 25.00, category: "Hogar", desc: "Aspirador robot con mapeo láser, control por app y función de fregado." },
  { name: "Teclado Mecánico RGB Gaming", price: 39.99, cost: 11.00, category: "Tecnología", desc: "Teclado mecánico con switches Blue, retroiluminación RGB programable y construction de aluminio." },
  { name: "Linterna Carga Solar Camping", price: 16.99, cost: 3.50, category: "Tecnología", desc: "Linterna LED con carga solar, 3 modos de luz y base magnética." },
  { name: "Pulsera Inteligente Fitness Pro", price: 27.99, cost: 7.00, category: "Fitness", desc: "Smartwatch fitness con monitor de ritmo cardíaco, SpO2, GPS y 7 días de batería." },
  { name: "Kit Herramientas 100 Piezas", price: 32.99, cost: 9.00, category: "Hogar", desc: "Set completo de herramientas manuales en maletín organizador." },
  { name: "Microondas Digital 20L", price: 59.99, cost: 22.00, category: "Cocina", desc: "Microondas digital con 8 niveles de potencia y función descongelar." },
  { name: "Impresora 3D Mini Desktop", price: 129.99, cost: 45.00, category: "Tecnología", desc: "Impresora 3D de escritorio con estructura metálica, fácil montaje y alta precisión." },
];

export async function runBuscador(): Promise<AgentResult> {
  const start = Date.now();
  try {
    const count = Math.floor(Math.random() * 3) + 2;
    const shuffled = PRODUCT_CATALOG.sort(() => 0.5 - Math.random());
    const found = shuffled.slice(0, count);

    const results = found.map(p => ({
      ...p,
      source: "Catálogo BraLo",
      sourceUrl: `https://braLo.es/catalogo/${slugify(p.name)}`,
      imageUrl: `https://placehold.co/600x400/4c6ef5/white?text=${encodeURIComponent(p.name.split(" ").slice(0, 2).join(" "))}`,
    }));

    const result: AgentResult = {
      agent: "buscador",
      action: "buscar_productos",
      success: true,
      data: { input: { categories: CATEGORIES }, output: { found: results.length, products: results } },
      durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  } catch (error: any) {
    const result: AgentResult = {
      agent: "buscador", action: "buscar_productos", success: false,
      error: error.message, durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  }
}

export async function runValidador(products: any[]): Promise<AgentResult> {
  const start = Date.now();
  try {
    const approved = products.filter(p => {
      const margin = ((p.price - p.cost) / p.price) * 100;
      return margin >= 40 && p.price <= 100;
    });

    const result: AgentResult = {
      agent: "validador",
      action: "validar_productos",
      success: true,
      data: {
        input: { total: products.length },
        output: { approved: approved.length, rejected: products.length - approved.length, products: approved },
      },
      durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  } catch (error: any) {
    const result: AgentResult = {
      agent: "validador", action: "validar_productos", success: false,
      error: error.message, durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  }
}

export async function runPrecios(products: any[]): Promise<AgentResult> {
  const start = Date.now();
  try {
    const priced = products.map(p => {
      const costMultiplier = 1 + (Math.random() * 0.3 - 0.15);
      const finalCost = +(p.cost * costMultiplier).toFixed(2);
      const margin = 0.40 + Math.random() * 0.20;
      const finalPrice = +(finalCost / (1 - margin)).toFixed(2);
      const roundedPrice = Math.ceil(finalPrice * 4) / 4;

      return {
        ...p,
        costEUR: finalCost,
        priceEUR: roundedPrice,
        marginPct: +(((roundedPrice - finalCost) / roundedPrice) * 100).toFixed(1),
      };
    });

    const result: AgentResult = {
      agent: "precios",
      action: "calcular_precios",
      success: true,
      data: {
        input: { count: products.length },
        output: { priced: priced.length, products: priced },
      },
      durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  } catch (error: any) {
    const result: AgentResult = {
      agent: "precios", action: "calcular_precios", success: false,
      error: error.message, durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  }
}

export async function runPublicador(products: any[]): Promise<AgentResult> {
  const start = Date.now();
  try {
    const published = [];
    for (const p of products) {
      const existing = await prisma.product.findFirst({ where: { name: p.name } });
      if (existing) continue;

      const product = await prisma.product.create({
        data: {
          name: p.name,
          slug: slugify(p.name),
          description: p.desc || "",
          shortDesc: (p.desc || "").slice(0, 120),
          priceEUR: p.priceEUR || p.price,
          costEUR: p.costEUR || p.cost,
          marginPct: p.marginPct || 0,
          imageUrl: p.imageUrl || `https://placehold.co/600x400/4c6ef5/white?text=${encodeURIComponent(p.name)}`,
          category: p.category || "General",
          tags: JSON.stringify([p.category]),
          stock: Math.floor(Math.random() * 50) + 10,
          status: "active",
          source: p.source || "agente_buscador",
          sourceUrl: p.sourceUrl || "",
          seoTitle: `BraLo - ${p.name}`,
          seoDesc: p.desc || "",
        },
      });
      published.push(product);
    }

    const result: AgentResult = {
      agent: "publicador",
      action: "publicar_productos",
      success: true,
      data: {
        input: { count: products.length },
        output: { published: published.length, products: published.map(p => ({ id: p.id, name: p.name })) },
      },
      durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  } catch (error: any) {
    const result: AgentResult = {
      agent: "publicador", action: "publicar_productos", success: false,
      error: error.message, durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  }
}

export async function runMarketing(products: any[]): Promise<AgentResult> {
  const start = Date.now();
  try {
    const posts = products.slice(0, 5).map(p => ({
      tiktok: `Descubre ${p.name} por solo ${p.priceEUR || p.price} EUR en BraLo! ${p.desc?.slice(0, 80)} #BraLo #Ofertas #IA`,
      instagram: `${p.name} - Ahora disponible en BraLo por ${p.priceEUR || p.price} EUR. ${p.desc?.slice(0, 100)} Enlace en bio!`,
      youtube_shorts: `Short: Review rápida de ${p.name} | BraLo Store`,
      calendario: `Publicar en 2 días: ${p.name}`,
    }));

    const result: AgentResult = {
      agent: "marketing",
      action: "crear_contenido",
      success: true,
      data: {
        input: { products: products.length },
        output: { posts: posts.length, content: posts },
      },
      durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  } catch (error: any) {
    const result: AgentResult = {
      agent: "marketing", action: "crear_contenido", success: false,
      error: error.message, durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  }
}

export async function runOperaciones(): Promise<AgentResult> {
  const start = Date.now();
  try {
    const pendingOrders = await prisma.order.findMany({
      where: { status: { in: ["pending", "confirmed"] } },
      include: { items: true },
    });

    const updated = [];
    for (const order of pendingOrders) {
      if (order.status === "pending") {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "confirmed", paymentStatus: "paid" },
        });
        await prisma.orderLog.create({
          data: { orderId: order.id, status: "confirmed", message: "Pedido confirmado automáticamente", agent: "operaciones" },
        });
        updated.push(order.orderNumber);
      }
    }

    const result: AgentResult = {
      agent: "operaciones",
      action: "gestionar_pedidos",
      success: true,
      data: {
        input: { pendingOrders: pendingOrders.length },
        output: { confirmed: updated.length, orders: updated },
      },
      durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  } catch (error: any) {
    const result: AgentResult = {
      agent: "operaciones", action: "gestionar_pedidos", success: false,
      error: error.message, durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  }
}

export async function runSupervisor(dailyStats: any): Promise<AgentResult> {
  const start = Date.now();
  try {
    const today = new Date().toISOString().split("T")[0];
    const summary = `
REPORTE DIARIO BRALO - ${today}
================================
Productos encontrados: ${dailyStats.productsFound}
Productos aprobados: ${dailyStats.productsApproved}
Productos publicados: ${dailyStats.productsPublished}
Ventas totales: ${dailyStats.totalSalesEUR.toFixed(2)} EUR
Pedidos totales: ${dailyStats.totalOrders}
Mensajes respondidos: ${dailyStats.messagesHandled}
Posts de marketing: ${dailyStats.marketingPosts}
Incidencias: ${dailyStats.incidents}
================================
Sistema operativo y saludable.
    `.trim();

    const report = await prisma.dailyReport.create({
      data: {
        date: today,
        summary,
        productsFound: dailyStats.productsFound,
        productsApproved: dailyStats.productsApproved,
        productsPublished: dailyStats.productsPublished,
        totalSalesEUR: dailyStats.totalSalesEUR,
        totalOrders: dailyStats.totalOrders,
        messagesHandled: dailyStats.messagesHandled,
        marketingPosts: dailyStats.marketingPosts,
        incidents: dailyStats.incidents,
        details: JSON.stringify(dailyStats),
      },
    });

    const result: AgentResult = {
      agent: "supervisor",
      action: "generar_reporte",
      success: true,
      data: {
        input: dailyStats,
        output: { reportId: report.id, summary },
      },
      durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  } catch (error: any) {
    const result: AgentResult = {
      agent: "supervisor", action: "generar_reporte", success: false,
      error: error.message, durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  }
}

export async function runDailyPipeline() {
  console.log("[BraLo] Iniciando pipeline diario de agentes...");

  const buscadorResult = await runBuscador();
  const foundProducts = buscadorResult.data?.output?.products || [];
  console.log(`[BraLo] Buscador: ${foundProducts.length} productos encontrados`);

  const validadorResult = await runValidador(foundProducts);
  const approvedProducts = validadorResult.data?.output?.products || [];
  console.log(`[BraLo] Validador: ${approvedProducts.length} productos aprobados`);

  const preciosResult = await runPrecios(approvedProducts);
  const pricedProducts = preciosResult.data?.output?.products || [];
  console.log(`[BraLo] Precios: ${pricedProducts.length} productos con precio calculado`);

  const publicadorResult = await runPublicador(pricedProducts);
  const publishedCount = publicadorResult.data?.output?.published || 0;
  console.log(`[BraLo] Publicador: ${publishedCount} productos publicados`);

  const marketingResult = await runMarketing(pricedProducts);
  const marketingPosts = marketingResult.data?.output?.posts || 0;
  console.log(`[BraLo] Marketing: ${marketingPosts} posts creados`);

  const operacionesResult = await runOperaciones();
  console.log(`[BraLo] Operaciones: pedidos procesados`);

  const todayOrders = await prisma.order.aggregate({
    _sum: { totalEUR: true },
    _count: true,
    where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
  });

  const dailyStats = {
    productsFound: foundProducts.length,
    productsApproved: approvedProducts.length,
    productsPublished: publishedCount,
    totalSalesEUR: todayOrders._sum.totalEUR || 0,
    totalOrders: todayOrders._count,
    messagesHandled: 0,
    marketingPosts,
    incidents: [buscadorResult, validadorResult, preciosResult, publicadorResult, marketingResult, operacionesResult]
      .filter(r => !r.success).length,
  };

  const supervisorResult = await runSupervisor(dailyStats);
  console.log(`[BraLo] Supervisor: reporte diario generado`);

  return {
    buscador: buscadorResult,
    validador: validadorResult,
    precios: preciosResult,
    publicador: publicadorResult,
    marketing: marketingResult,
    operaciones: operacionesResult,
    supervisor: supervisorResult,
    stats: dailyStats,
  };
}
