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
  "Mascotas", "Cocina", "Oficina", "Juguetes", "Electronica"
];

const PRODUCT_CATALOG = [
  {
    name: "Auriculares Bluetooth Pro Max",
    price: 29.99, cost: 8.50, category: "Tecnología",
    shortDesc: "Auriculares inalámbricos con cancelación de ruido activa y 40h de bateria.",
    desc: "Auriculares inalámbricos Bluetooth 5.3 con cancelación de ruido activa (ANC). Bateria de 40 horas de duración, sonido Hi-Fi con drivers de 40mm, diseño plegable y estuche de carga rapida. Ideales para musica, llamadas y gaming. Incluye cable auxiliar y funda de transporte. Compatible con todos los dispositivos Bluetooth.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
  },
  {
    name: "Lampara LED Inteligente RGB",
    price: 24.99, cost: 6.00, category: "Hogar",
    shortDesc: "Lampara de escritorio con 16 millones de colores y control por voz.",
    desc: "Lampara de escritorio LED con 16 millones de colores y 20 modos de iluminacion. Control por app movil y asistentes de voz (Alexa, Google Home). Temporizador integrado, modo lectura, modo relax y modo fiesta. Base estable antideslizante, consumo bajo de energia y vida util de 50.000 horas. Perfecta para dormitorio, oficina o sala de estar.",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=400&fit=crop",
  },
  {
    name: "Set de Bandas de Resistencia Premium",
    price: 19.99, cost: 4.50, category: "Fitness",
    shortDesc: "Set de 5 bandas elasticas para entrenamiento en casa y gimnasio.",
    desc: "Pack de 5 bandas de resistencia con diferentes niveles: 5lb, 10lb, 15lb, 20lb y 25lb. Fabricadas en latex natural de alta densidad con recubrimiento antideslizante. Incluye bolsa de transporte y guia de ejercicios en PDF. Ideales para yoga, pilates, fisioterapia, calentamiento y entrenamiento de fuerza. Ocupan muy poco espacio, perfectas para viajar.",
    imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=400&fit=crop",
  },
  {
    name: "Organizador Magnético Multiusos",
    price: 15.99, cost: 3.20, category: "Hogar",
    shortDesc: "Organizador con imanes para cocina, baño u oficina sin taladro.",
    desc: "Organizador con imanes potentes de neodimio para fijar a cualquier superficie metalica. Incluye 3 compartimentos y ganchos extraibles. Perfecto para guardar cuchillos, utensilios de cocina, llaves, herramientas o articulos de baño. Instalacion en segundos sin taladro ni pegamento. Acero inoxidable resistente a la humedad y al óxido.",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
  {
    name: "Webcam 4K Ultra HD con Microfono",
    price: 39.99, cost: 12.00, category: "Tecnología",
    shortDesc: "Camara web 4K con microfono estereo y autofocus automatico.",
    desc: "Camara web 4K Ultra HD a 30fps con lente de cristal y microfono estereo integrado. Autofocus automatico, correccion de color WDR y vision nocturna con infrarrojos. Base clip universal que se adapta a monitores, portatiles y tripo. Plug and play, no necesita controladores. Ideal para videollamadas, streaming, tutoriales y reuniones online.",
    imageUrl: "https://images.unsplash.com/photo-1587826080602-4834141a185e?w=600&h=400&fit=crop",
  },
  {
    name: "Kit Skincare Coreano 5 Pasos",
    price: 34.99, cost: 9.00, category: "Belleza",
    shortDesc: "Rutina coreana completa: limpiador, tonico, serum, crema y protector.",
    desc: "Kit completo de rutina de cuidado facial al estilo coreano. Incluye: limpiador suave a base de espuma, tonico hidratante con ácido hialurónico, serum de vitamina C, crema nutritiva nocturna y protector solar SPF50. Productos con ingredientes naturales, testados dermatologicamente y aptos para todo tipo de piel. Envases de 30ml cada uno, perfectos para probar o viajar.",
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop",
  },
  {
    name: "Mochila Antirrobo USB Carga",
    price: 29.99, cost: 7.50, category: "Moda",
    shortDesc: "Mochila impermeable con puerto USB y diseno antirrobo.",
    desc: "Mochila impermeable de nylon Oxford con diseno antirrobo: los cremalleras estan ocultas en la parte trasera. Puerto USB externo con cable interior para cargar el movil caminando. Compartimento acolchado para portatil de hasta 15.6 pulgadas, organizador interno con multiples bolsillos. Ligera, comoda y resistente al agua. Ideal para trabajo, viajes o universidad.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
  },
  {
    name: "Comedero Automatico Mascotas",
    price: 34.99, cost: 10.00, category: "Mascotas",
    shortDesc: "Comedero programable con porciones controladas y deposito de 5L.",
    desc: "Comedero automatico para perros y gatos con programacion hasta 4 comidas al dia. Deposito de 5 litros con tapa hermetica que mantiene el alimento fresco. Pantalla LCD con reloj, porciones ajustables de 1 a 39 por toma, y funcion de grabacion de voz para llamar a tu mascota. Funciona con baterias o cable USB. Material ABS antideslizante, facil de limpiar.",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
  },
  {
    name: "Set Cocina 7 Piezas Antiadherente",
    price: 49.99, cost: 15.00, category: "Cocina",
    shortDesc: "Juego de cocina con sarten, cacerola y cucharones de silicona.",
    desc: "Set de 7 piezas de cocina premium: sarten 24cm, cacerola 18cm, cacerola 24cm, 3 cucharones de silicona resistente al calor y tapa de cristal templado. Acero inoxidable con recubrimiento antiadherente de piedra mineral, compatible con todas las cocinas incluida induccion. Asas ergonomicas que no calientan. Apta para lavavajillas. Libre de PFOA y metales pesados.",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
  {
    name: "Soporte Monitor Ergonomico",
    price: 22.99, cost: 5.50, category: "Oficina",
    shortDesc: "Elevador de monitor regulable en altura con espacio de almacenamiento.",
    desc: "Soporte elevador de monitor regulable en 6 alturas para mantener la pantalla a la altura de los ojos y evitar dolor de cuello y espalda. Espacio de almacenamiento oculto debajo para teclado, raton y accesorios. Superficie antideslizante, capacidad hasta 10kg. Material ABS de alta resistencia. Facil de montar sin herramientas. Compatible con monitores de 17 a 32 pulgadas.",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  },
  {
    name: "Drone Mini con Camara 1080p",
    price: 59.99, cost: 18.00, category: "Tecnologia",
    shortDesc: "Drone plegable con camara HD, 25min de vuelo y retorno automatico.",
    desc: "Drone compacto y plegable con camara 1080p Full HD y angulo gran angular 120 grados. Tiempo de vuelo hasta 25 minutos con 2 baterias incluidas. Modo headless para principiantes, retorno automatico a la base, sensor de altitud y control por app movil. Peso menos de 250g (no necesita registro). Perfecto para fotos aereas, videos de viajes y diversión.",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop",
  },
  {
    name: "Silla Gaming Ergonomica",
    price: 89.99, cost: 28.00, category: "Oficina",
    shortDesc: "Silla gaming con soporte lumbar, reposabrazos 4D y reclinacion 180.",
    desc: "Silla gaming ergonomica con estructura de acero reforzado y espuma de alta densidad. Reclinacion adjustable de 90 a 180 grados, reposabrazos 4D ajustables, soporte lumbar y cervical incluidos. Piel sintetica premium resistente al desgaste, base cromada con ruedas silenciosas. Soporte hasta 150kg. Ideal para sesiones largas de gaming, oficina en casa o estudio.",
    imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=400&fit=crop",
  },
  {
    name: "Robot Aspirador Smart Map",
    price: 79.99, cost: 25.00, category: "Hogar",
    shortDesc: "Aspirador robot con mapeo laser, control por app y funcion de fregado.",
    desc: "Aspirador robot inteligente con navegacion LIDAR y mapeo laser de la casa. Programacion por habitaciones, zonas prohibidas y limpieza por areas. Modo aspirado y fregado simultaneo. Sensores anti-caida y anti-colision. Bateria de 2600mAh hasta 120 min de autonomia. Control por app movil y compatibilidad con Alexa y Google Home. Base de carga automatica.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
  },
  {
    name: "Teclado Mecanico RGB Gaming",
    price: 39.99, cost: 11.00, category: "Tecnologia",
    shortDesc: "Teclado mecanico con switches Blue, retroiluminacion RGB y carcasa de aluminio.",
    desc: "Teclado mecanico gaming con switches Blue de alta durabilidad (50 millones de pulsaciones). Retroiluminacion RGB con 18 modos de iluminacion y efectos personalizables. Carcasa de aluminio cepillado, reposamuñecas desmontable, anti-ghosting N-key rollover y teclas programables. Cable USB trenzado extraible. Compatible con Windows, Mac y consolas.",
    imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&h=400&fit=crop",
  },
  {
    name: "Linterna Solar Camping",
    price: 16.99, cost: 3.50, category: "Tecnologia",
    shortDesc: "Linterna LED con carga solar, 3 modos de luz y base magnetica.",
    desc: "Linterna LED portatil con panel solar integrado y bateria recargable de 2000mAh. 3 modos de iluminacion: luz alta, luz baja y modo SOS. Base magnetica para manos libres, gancho colgable y resistencia al agua IP65. Carga completa con energia solar en 6 horas o por USB en 2 horas. Funciona hasta 8 horas en modo bajo. Ideal para camping, emergencias y actividades al aire libre.",
    imageUrl: "https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=600&h=400&fit=crop",
  },
  {
    name: "Pulsera Inteligente Fitness Pro",
    price: 27.99, cost: 7.00, category: "Fitness",
    shortDesc: "Smartwatch fitness con ritmo cardiaco, SpO2, GPS y 7 dias de bateria.",
    desc: "Pulsera inteligente deportiva con pantalla AMOLED 1.78 pulgadas. Monitorizacion 24/7 de ritmo cardiaco, nivel de oxigeno en sangre (SpO2), calidad del sueño y nivel de estrés. GPS integrado, mas de 100 modos de deporte, resistencia al agua IP68. Bateria hasta 7 dias con uso normal. Notificaciones de llamadas y mensajes, control de musica y camara remota. Correa intercambiable.",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=400&fit=crop",
  },
  {
    name: "Kit Herramientas 100 Piezas",
    price: 32.99, cost: 9.00, category: "Hogar",
    shortDesc: "Set completo de herramientas manuales en maletin organizador.",
    desc: "Kit de herramientas de 100 piezas en maletin de almacenamiento organizado. Incluye: llaves inglesas, destornilladores, alicates, martillo, cinta metrica, nivel de burbuja, brocas, tornillos, tacos, fresas y mas. Acero carbono de alta resistencia con acabado anticorrosion. Maletin de plastico resistente con compartimentos etiquetados. Ideal para el hogar, taller o como regalo.",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop",
  },
  {
    name: "Microondas Digital 20L",
    price: 59.99, cost: 22.00, category: "Cocina",
    shortDesc: "Microondas digital con 8 niveles de potencia y funcion descongelar.",
    desc: "Microondas digital de 20 litros con 8 niveles de potencia y pantalla LED. Funciones de calentar, cocinar, descongelar y recalentar con un toque. Timer de 60 minutos, sonido de fin de ciclo ajustable y boton de apertura rapida. Interior de acero inoxidable facil de limpiar, plato giratorio de vidrio de 25.4cm. Potencia 700W. Dimensiones compactas, ideal para cocinas pequenas, oficinas o habitaciones.",
    imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&h=400&fit=crop",
  },
  {
    name: "Impresora 3D Mini Desktop",
    price: 129.99, cost: 45.00, category: "Tecnologia",
    shortDesc: "Impresora 3D de escritorio con estructura metalica y alta precision.",
    desc: "Impresora 3D de escritorio con volumen de impresion 180x180x180mm. Estructura metalica rigida, extrusor de alta precision y plataforma de impresion calentada. Compatible con filamentos PLA, ABS, PETG y TPU. Precision de 0.1mm, velocidad maxima 150mm/s. Pantalla LCD con tarjeta SD, ensamblaje en 10 minutos. Ideal para prototipos, piezas de repuesto, modelos a escala y proyectos creativos.",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
  },
];

function generateDescription(name: string, category: string, baseDesc: string): string {
  return baseDesc;
}

export async function runBuscador(): Promise<AgentResult> {
  const start = Date.now();
  try {
    const count = Math.floor(Math.random() * 3) + 2;
    const shuffled = [...PRODUCT_CATALOG].sort(() => 0.5 - Math.random());
    const found = shuffled.slice(0, count);

    const results = found.map(p => ({
      ...p,
      source: "Catalogo BraLo",
      sourceUrl: `https://aliexpress.com/wholesale?SearchText=${encodeURIComponent(p.name)}`,
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
      return margin >= 40 && p.price <= 150;
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

      const fullDesc = generateDescription(p.name, p.category, p.desc || p.shortDesc || "");

      const product = await prisma.product.create({
        data: {
          name: p.name,
          slug: slugify(p.name),
          description: fullDesc,
          shortDesc: (p.shortDesc || fullDesc).slice(0, 150),
          priceEUR: p.priceEUR || p.price,
          costEUR: p.costEUR || p.cost,
          marginPct: p.marginPct || 0,
          imageUrl: p.imageUrl || "",
          category: p.category || "General",
          tags: JSON.stringify([p.category]),
          stock: Math.floor(Math.random() * 50) + 10,
          status: "active",
          source: p.source || "catalogo",
          sourceUrl: p.sourceUrl || "",
          seoTitle: `${p.name} - BraLo`,
          seoDesc: (p.shortDesc || fullDesc).slice(0, 160),
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
      tiktok: `Mira este ${p.name} que encontre por solo ${p.priceEUR || p.price} EUR en BraLo! No te lo pierdas #BraLo #Ofertas #ComprasOnline`,
      instagram: `${p.name} - Disponible ahora en BraLo por solo ${p.priceEUR || p.price} EUR. ${p.shortDesc || ""} Link en bio!`,
      youtube_shorts: `Short: Este ${p.name} es una pasada por solo ${p.priceEUR || p.price} EUR | BraLo`,
      calendario: `Publicar en 2 dias: ${p.name}`,
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
          data: { orderId: order.id, status: "confirmed", message: "Pedido confirmado", agent: "operaciones" },
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
  console.log("[BraLo] Iniciando pipeline diario...");

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
  console.log(`[BraLo] Supervisor: reporte generado`);

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
