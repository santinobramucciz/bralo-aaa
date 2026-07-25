import { runDailyPipeline } from "./index";

async function main() {
  console.log("=== BraLo - Ejecución diaria de agentes ===");
  console.log(`Fecha: ${new Date().toISOString()}`);
  console.log("");

  const result = await runDailyPipeline();

  console.log("");
  console.log("=== Resumen ===");
  console.log(`Productos encontrados: ${result.stats.productsFound}`);
  console.log(`Productos aprobados: ${result.stats.productsApproved}`);
  console.log(`Productos publicados: ${result.stats.productsPublished}`);
  console.log(`Posts de marketing: ${result.stats.marketingPosts}`);
  console.log(`Incidencias: ${result.stats.incidents}`);
  console.log("");
  console.log("Pipeline completado.");

  process.exit(0);
}

main().catch((e) => {
  console.error("Error en pipeline diario:", e);
  process.exit(1);
});
