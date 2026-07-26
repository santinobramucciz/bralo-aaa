const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { name: true, images: true } });
  products.forEach(p => console.log(`[${p.name}] images: ${p.images ? p.images.substring(0, 80) : 'none'}`));
  await prisma.$disconnect();
}

main();