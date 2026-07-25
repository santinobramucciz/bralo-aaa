import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMAGE_MAP: Record<string, string> = {
  "Auriculares Bluetooth": "https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "auriculares bluetooth": "https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Lampara LED": "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "lampara led": "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Lampara Inteligente": "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "lampara inteligente": "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Bandas de Resistencia": "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "bandas de resistencia": "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Organizador": "https://images.pexels.com/photos/6046205/pexels-photo-6046205.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "organizador": "https://images.pexels.com/photos/6046205/pexels-photo-6046205.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Webcam": "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "webcam": "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Skincare": "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "skincare": "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Mochila": "https://images.pexels.com/photos/1294847/pexels-photo-1294847.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "mochila": "https://images.pexels.com/photos/1294847/pexels-photo-1294847.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Comedero": "https://images.pexels.com/photos/4588053/pexels-photo-4588053.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "comedero": "https://images.pexels.com/photos/4588053/pexels-photo-4588053.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Set Cocina": "https://images.pexels.com/photos/4491135/pexels-photo-4491135.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "set cocina": "https://images.pexels.com/photos/4491135/pexels-photo-4491135.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Soporte Monitor": "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "soporte monitor": "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Drone": "https://images.pexels.com/photos/1826471/pexels-photo-1826471.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "drone": "https://images.pexels.com/photos/1826471/pexels-photo-1826471.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Silla Gaming": "https://images.pexels.com/photos/8553862/pexels-photo-8553862.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "silla gaming": "https://images.pexels.com/photos/8553862/pexels-photo-8553862.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Robot Aspirador": "https://images.pexels.com/photos/5463579/pexels-photo-5463579.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "robot aspirador": "https://images.pexels.com/photos/5463579/pexels-photo-5463579.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Teclado Mecanico": "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "teclado mecanico": "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Linterna Solar": "https://images.pexels.com/photos/162539/architecture-building-amsterdam-blue-sky-162539.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "linterna solar": "https://images.pexels.com/photos/2693526/pexels-photo-2693526.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Pulsera Inteligente": "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "pulsera inteligente": "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Kit Herramientas": "https://images.pexels.com/photos/1669858/pexels-photo-1669858.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "kit herramientas": "https://images.pexels.com/photos/1669858/pexels-photo-1669858.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Microondas": "https://images.pexels.com/photos/5591879/pexels-photo-5591879.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "microondas": "https://images.pexels.com/photos/5591879/pexels-photo-5591879.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Impresora 3D": "https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "impresora 3d": "https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
};

const DEFAULT_IMAGES: Record<string, string> = {
  "Tecnologia": "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Hogar": "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Fitness": "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Belleza": "https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Moda": "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Mascotas": "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Cocina": "https://images.pexels.com/photos/4491135/pexels-photo-4491135.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Oficina": "https://images.pexels.com/photos/389818/pexels-photo-389818.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Juguetes": "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
  "Electronica": "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
};

function findImage(productName: string, category: string): string {
  for (const [keyword, url] of Object.entries(IMAGE_MAP)) {
    if (productName.toLowerCase().includes(keyword.toLowerCase())) {
      return url;
    }
  }
  return DEFAULT_IMAGES[category] || DEFAULT_IMAGES["Electronica"];
}

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to update`);

  let updated = 0;
  for (const product of products) {
    const newImage = findImage(product.name, product.category);
    if (product.imageUrl !== newImage) {
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: newImage },
      });
      console.log(`Updated: ${product.name} -> ${newImage.substring(0, 60)}...`);
      updated++;
    }
  }

  console.log(`\nDone! Updated ${updated} products`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
