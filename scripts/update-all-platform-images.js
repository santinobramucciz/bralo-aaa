const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  {
    name: 'Banda de Resistencia Premium Set',
    images: JSON.stringify([
      'https://ae01.alicdn.com/kf/S9d9eaf7403f84329913eb15bae701f92K/5Pcs-Set-Yoga-Resistance-Rubber-Bands-Bodybuilding-Elastic-Bands-Pilates-Exercise-Workout-Bands-Expander-Belt-Fitness.jpg',
      'https://ae01.alicdn.com/kf/S3070e3f3f59243b78c347a8c9e374bdaW/5Pcs-Set-Yoga-Resistance-Rubber-Bands-Bodybuilding-Elastic-Bands-Pilates-Exercise-Workout-Bands-Expander-Belt-Fitness.jpg',
      'https://ae01.alicdn.com/kf/Scbeb54f9353c49a68f6eaf1e6bc44233T/Resistance-Bands-for-Working-Out-Exercise-Bands-Physical-Therapy-Outdoor-Fitness-Training-Pilates-Home-Gym-Stretch.jpg',
    ])
  },
  {
    name: 'Mochila Antirrobo USB Carga',
    images: JSON.stringify([
      'https://ae01.alicdn.com/kf/Sa812e29071534f54b8ce81bd4780d1385/BANGE-Men-Luxury-Designer-Outdoor-Backpack-Expandable-Commercial-Laptop-Backpacks-Hiking-Waterproof-Travel-Bag-with-USB.jpg',
      'https://ae01.alicdn.com/kf/S8a354f0019ad4bea965a199222b3f440s/BANGE-Men-Luxury-Designer-Outdoor-Backpack-Expandable-Commercial-Laptop-Backpacks-Hiking-Waterproof-Travel-Bag-with-USB.jpg',
      'https://ae01.alicdn.com/kf/Se56d273fe687497b9f154486ca845849P/BANGE-Men-Luxury-Designer-Outdoor-Backpack-Expandable-Commercial-Laptop-Backpacks-Hiking-Waterproof-Travel-Bag-with-USB.jpg',
    ])
  },
  {
    name: 'Microondas Digital 20L',
    images: JSON.stringify([
      'https://ae01.alicdn.com/kf/S7cad41dd1fcd473385cb9f27ab1336d71.jpg',
      'https://ae01.alicdn.com/kf/S84c893bd670849508b3feeb7268be4f3S.jpg',
      'https://ae01.alicdn.com/kf/S08f2b8753a6c43c3bb6e713e4efdb6024.jpg',
    ])
  },
  {
    name: 'Robot Aspirador Smart Map',
    images: JSON.stringify([
      'https://ae01.alicdn.com/kf/S7cad41dd1fcd473385cb9f27ab1336d71.jpg',
      'https://ae01.alicdn.com/kf/S84c893bd670849508b3feeb7268be4f3S.jpg',
      'https://ae01.alicdn.com/kf/S08f2b8753a6c43c3bb6e713e4efdb6024.jpg',
    ])
  },
  {
    name: 'Kit Skincare Coreano 5 Pasos',
    images: JSON.stringify([
      'https://ae01.alicdn.com/kf/S0427c2ac4a7a48009b9be75d5af76b2aS/Bubble-Moisturizing-Face-Cream-Face-Toner-Eye-cream-spray-50-15-55ml-Repairing-Nourishing-Dry-Skin.jpg',
      'https://ae01.alicdn.com/kf/S0c4a822a8d044794a80ad5d51b101da0E/Bubble-Moisturizing-Face-Cream-Face-Toner-Eye-cream-spray-50-15-55ml-Repairing-Nourishing-Dry-Skin.jpg',
      'https://ae01.alicdn.com/kf/S3a6e18b1b5b64b59907763f88ebf0e850/Bubble-Moisturizing-Face-Cream-Face-Toner-Eye-cream-spray-50-15-55ml-Repairing-Nourishing-Dry-Skin.jpg',
    ])
  },
  {
    name: 'Soporte Monitor Ergonomico',
    images: JSON.stringify([
      'https://ae01.alicdn.com/kf/S9d9eaf7403f84329913eb15bae701f92K/5Pcs-Set-Yoga-Resistance-Rubber-Bands-Bodybuilding-Elastic-Bands-Pilates-Exercise-Workout-Bands-Expander-Belt-Fitness.jpg',
      'https://ae01.alicdn.com/kf/S3070e3f3f59243b78c347a8c9e374bdaW/5Pcs-Set-Yoga-Resistance-Rubber-Bands-Bodybuilding-Elastic-Bands-Pilates-Exercise-Workout-Bands-Expander-Belt-Fitness.jpg',
    ])
  },
  {
    name: 'Teclado Mecanico RGB Gaming',
    images: JSON.stringify([
      'https://ae04.alicdn.com/kf/Hb2bce41a10a64438948e3b29589d2fdfk.jpg',
      'https://ae04.alicdn.com/kf/H76ad22142e614664917283eee35bc5c6O.jpg',
      'https://ae04.alicdn.com/kf/H02058139c21d466b843c615be947cd22T.jpg',
    ])
  },
  {
    name: 'Lampara LED Inteligente RGB',
    images: JSON.stringify([
      'https://ae04.alicdn.com/kf/S3d0c889fff234a458d79f3dd72700973g.jpg',
      'https://ae04.alicdn.com/kf/Sc2f591faa6fa4d83b69f0fe907cdc69fK.jpg',
      'https://ae04.alicdn.com/kf/Sf9853f994db04e3784b5065e7bbd04ecr.jpg',
    ])
  },
  {
    name: 'Webcam 4K Ultra HD con Microfono',
    images: JSON.stringify([
      'https://ae01.alicdn.com/kf/Sb52d56e4557744a0a043df05cca7d416a.jpg',
      'https://ae01.alicdn.com/kf/Se67531d859cd49eba610897a8c14d342U.jpg',
    ])
  },
  {
    name: 'Impresora 3D Mini Desktop',
    images: JSON.stringify([
      'https://ae01.alicdn.com/kf/Sb52d56e4557744a0a043df05cca7d416a.jpg',
      'https://ae01.alicdn.com/kf/Se67531d859cd49eba610897a8c14d342U.jpg',
    ])
  },
];

async function main() {
  console.log('Actualizando imagenes de productos con imagenes reales de AliExpress...\n');
  
  for (const product of products) {
    try {
      const updated = await prisma.product.updateMany({
        where: { name: product.name },
        data: { images: product.images }
      });
      console.log(`OK ${product.name}: ${updated.count} productos actualizados`);
    } catch (error) {
      console.log(`FAIL ${product.name}: Error - ${error.message}`);
    }
  }
  
  console.log('\nDone!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());