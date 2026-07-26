import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchAliExpressImage(query: string): Promise<string | null> {
  try {
    const searchUrl = `https://es.aliexpress.com/wholesale?SearchText=${encodeURIComponent(query)}&SortType=price_asc`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9",
      },
    });
    const html = await response.text();

    const imageMatch = html.match(/"imageUrl"\s*:\s*"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/);
    if (imageMatch) {
      let url = imageMatch[1].replace(/\\\//g, "/");
      if (!url.startsWith("http")) url = "https:" + url;
      return url;
    }

    const imgMatch = html.match(/(https?:\/\/ae01\.alicdn\.com\/kf\/[^"'\s]+\.(?:jpg|jpeg|png|webp))/i);
    if (imgMatch) return imgMatch[1];

    return null;
  } catch (e) {
    console.error(`Error fetching AliExpress for "${query}":`, e);
    return null;
  }
}

const PRODUCT_SEARCH_QUERIES: Record<string, string> = {
  "Microondas Digital 20L": "microondas digital 20l led",
  "Robot Aspirador Smart Map": "robot aspirador lidar mapeo",
  "Kit Skincare Coreano 5 Pasos": "kit skincare coreano 5 pasos",
  "Silla Gaming Ergonómica": "silla gaming ergonomica lumbar",
  "Banda de Resistencia Premium Set": "bandas resistencia fitness set",
  "Mochila Antirrobo USB Carga": "mochila antirrobo USB carga",
};

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Buscando imágenes reales de AliExpress para ${products.length} productos...\n`);

  for (const product of products) {
    const query = PRODUCT_SEARCH_QUERIES[product.name] || product.name;
    console.log(`Buscando: ${query}...`);

    const imageUrl = await fetchAliExpressImage(query);
    if (imageUrl) {
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl },
      });
      console.log(`  ✓ Imagen actualizada: ${imageUrl.substring(0, 80)}...`);
    } else {
      console.log(`  ✗ No se encontró imagen, manteniendo la actual`);
    }

    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n¡Listo!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
