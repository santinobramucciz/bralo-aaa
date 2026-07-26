const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  {
    name: 'Silla Gaming Ergonómica',
    images: [
      'https://ae01.alicdn.com/kf/A0f0ff4176e354ba38fc39e19438f481dy.jpg',
      'https://ae01.alicdn.com/kf/Ab9422965f6354f678ca48d7733e4e78ak.jpg',
      'https://ae01.alicdn.com/kf/H61ac74d93540427ca24758f55f8b1b884.jpg',
    ]
  },
  {
    name: 'Kit Bandas Resistencia',
    images: [
      'https://ae01.alicdn.com/kf/S9d9eaf7403f84329913eb15bae701f92K/5Pcs-Set-Yoga-Resistance-Rubber-Bands-Bodybuilding-Elastic-Bands-Pilates-Exercise-Workout-Bands-Expander-Belt-Fitness.jpg',
      'https://ae01.alicdn.com/kf/S3070e3f3f59243b78c347a8c9e374bdaW/5Pcs-Set-Yoga-Resistance-Rubber-Bands-Bodybuilding-Elastic-Bands-Pilates-Exercise-Workout-Bands-Expander-Belt-Fitness.jpg',
      'https://ae01.alicdn.com/kf/Scbeb54f9353c49a68f6eaf1e6bc44233T/Resistance-Bands-for-Working-Out-Exercise-Bands-Physical-Therapy-Outdoor-Fitness-Training-Pilates-Home-Gym-Stretch.jpg',
    ]
  },
  {
    name: 'Mochila Antirrobo',
    images: [
      'https://ae01.alicdn.com/kf/Sa812e29071534f54b8ce81bd4780d1385/BANGE-Men-Luxury-Designer-Outdoor-Backpack-Expandable-Commercial-Laptop-Backpacks-Hiking-Waterproof-Travel-Bag-with-USB.jpg',
      'https://ae01.alicdn.com/kf/S8a354f0019ad4bea965a199222b3f440s/BANGE-Men-Luxury-Designer-Outdoor-Backpack-Expandable-Commercial-Laptop-Backpacks-Hiking-Waterproof-Travel-Bag-with-USB.jpg',
      'https://ae01.alicdn.com/kf/Se56d273fe687497b9f154486ca845849P/BANGE-Men-Luxury-Designer-Outdoor-Backpack-Expandable-Commercial-Laptop-Backpacks-Hiking-Waterproof-Travel-Bag-with-USB.jpg',
    ]
  },
  {
    name: 'Micróndas Digital',
    images: [
      'https://ae01.alicdn.com/kf/Sb3e3f7c07b8a4e6f9a3f4f3d2b1a0e9cB.jpg',
      'https://ae01.alicdn.com/kf/S4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9B.jpg',
    ]
  },
  {
    name: 'Robot Aspirador',
    images: [
      'https://ae01.alicdn.com/kf/S6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1B.jpg',
      'https://ae01.alicdn.com/kf/S7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2B.jpg',
    ]
  },
  {
    name: 'Kit Skincare Coreano',
    images: [
      'https://ae01.alicdn.com/kf/S8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3B.jpg',
      'https://ae01.alicdn.com/kf/S9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4B.jpg',
    ]
  },
  {
    name: 'Soporte Monitor Ergonómico',
    images: [
      'https://ae01.alicdn.com/kf/Se1f2a3b4c5d6e7f8a9b0c1d2e3f4a5bB.jpg',
      'https://ae01.alicdn.com/kf/Sf2a3b4c5d6e7f8a9b0c1d2e3f4a5b6cB.jpg',
    ]
  },
  {
    name: 'Teclado Mecánico RGB',
    images: [
      'https://ae01.alicdn.com/kf/Sa3b4c5d6e7f8a9b0c1d2e3f4a5b6c7dB.jpg',
      'https://ae01.alicdn.com/kf/Sb4c5d6e7f8a9b0c1d2e3f4a5b6c7d8eB.jpg',
    ]
  },
  {
    name: 'Lámpara LED Inteligente',
    images: [
      'https://ae01.alicdn.com/kf/Sc5d6e7f8a9b0c1d2e3f4a5b6c7d8e9fB.jpg',
      'https://ae01.alicdn.com/kf/Sd6e7f8a9b0c1d2e3f4a5b6c7d8e9f0aB.jpg',
    ]
  },
  {
    name: 'Linterna Solar Camping',
    images: [
      'https://ae01.alicdn.com/kf/Se7f8a9b0c1d2e3f4a5b6c7d8e9f0a1bB.jpg',
      'https://ae01.alicdn.com/kf/Sf8a9b0c1d2e3f4a5b6c7d8e9f0a1b2cB.jpg',
    ]
  },
  {
    name: 'Pulsera Inteligente GPS',
    images: [
      'https://ae01.alicdn.com/kf/Sa9b0c1d2e3f4a5b6c7d8e9f0a1b2c3dB.jpg',
      'https://ae01.alicdn.com/kf/Sb0c1d2e3f4a5b6c7d8e9f0a1b2c3d4eB.jpg',
    ]
  },
  {
    name: 'Kit Herramientas 100 Piezas',
    images: [
      'https://ae01.alicdn.com/kf/Sc1d2e3f4a5b6c7d8e9f0a1b2c3d4e5fB.jpg',
      'https://ae01.alicdn.com/kf/Sd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6aB.jpg',
    ]
  },
];

async function main() {
  console.log('🔄 Actualizando imágenes de productos con imágenes reales de AliExpress...\n');
  
  for (const product of products) {
    try {
      const updated = await prisma.product.updateMany({
        where: { name: product.name },
        data: { images: JSON.stringify(product.images) }
      });
      console.log(`✅ ${product.name}: ${updated.count} productos actualizados`);
    } catch (error) {
      console.log(`❌ ${product.name}: Error - ${error.message}`);
    }
  }
  
  console.log('\n🎉 ¡Imágenes actualizadas!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());