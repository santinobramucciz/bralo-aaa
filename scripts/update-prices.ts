import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UPDATES: Record<string, { price: number; cost: number; sourceUrl: string }> = {
  "Mochila Antirrobo USB Carga": { price: 39.99, cost: 23.19, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=mochila+antirrobo+USB+carga" },
  "Auriculares Bluetooth Pro Max": { price: 34.99, cost: 9.80, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=auriculares+bluetooth+cancelacion+ruido" },
  "Lampara LED Inteligente RGB": { price: 27.99, cost: 7.20, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=lampara+LED+inteligente+RGB" },
  "Banda de Resistencia Premium Set": { price: 22.99, cost: 5.50, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=bandas+resistencia+set+fitness" },
  "Organizador Magnético Multiusos": { price: 18.99, cost: 4.00, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=organizador+magnetico+cocina" },
  "Webcam 4K Ultra HD con Microfono": { price: 44.99, cost: 14.00, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=webcam+4k+microfono" },
  "Kit Skincare Coreano 5 Pasos": { price: 39.99, cost: 11.00, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=kit+skincare+coreano" },
  "Comedero Automatico Mascotas": { price: 39.99, cost: 12.50, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=comedero+automatico+mascotas" },
  "Set Cocina 7 Piezas Antiadherente": { price: 54.99, cost: 18.50, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=set+cocina+antiadherente+piezas" },
  "Soporte Monitor Ergonomico": { price: 27.99, cost: 6.80, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=soporte+monitor+ergonomico" },
  "Drone Mini con Camara 1080p": { price: 64.99, cost: 22.00, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=drone+mini+camara+1080p" },
  "Silla Gaming Ergonómica": { price: 99.99, cost: 35.00, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=silla+gaming+ergonomica" },
  "Robot Aspirador Smart Map": { price: 89.99, cost: 32.00, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=robot+aspirador+mapeo+laser" },
  "Teclado Mecanico RGB Gaming": { price: 44.99, cost: 13.50, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=teclado+mecanico+RGB+gaming" },
  "Linterna Solar Camping": { price: 19.99, cost: 4.50, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=linterna+solar+camping" },
  "Pulsera Inteligente Fitness Pro": { price: 32.99, cost: 9.00, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=pulsera+inteligente+fitness+GPS" },
  "Kit Herramientas 100 Piezas": { price: 36.99, cost: 11.00, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=kit+herramientas+100+piezas" },
  "Microondas Digital 20L": { price: 64.99, cost: 28.00, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=microondas+digital+20l" },
  "Impresora 3D Mini Desktop": { price: 139.99, cost: 55.00, sourceUrl: "https://es.aliexpress.com/wholesale?SearchText=impresora+3d+mini+desktop" },
};

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products`);

  for (const product of products) {
    const update = UPDATES[product.name];
    if (update) {
      const margin = +(((update.price - update.cost) / update.price) * 100).toFixed(1);
      await prisma.product.update({
        where: { id: product.id },
        data: {
          priceEUR: update.price,
          costEUR: update.cost,
          marginPct: margin,
          sourceUrl: update.sourceUrl,
          source: "AliExpress",
        },
      });
      console.log(`Updated: ${product.name} | Cost: ${update.cost} EUR | Price: ${update.price} EUR | Margin: ${margin}%`);
    }
  }

  console.log("\nDone!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
