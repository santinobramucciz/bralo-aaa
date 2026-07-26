import prisma from "@/lib/prisma";

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

async function fetchPageText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(15000),
    });
    return await res.text();
  } catch {
    return "";
  }
}

function extractImageUrls(html: string): string[] {
  const urls: string[] = [];
  const patterns = [
    /https?:\/\/ae0[0-9]\.alicdn\.com\/kf\/[A-Za-z0-9_-]+(?:\.[a-zA-Z]+)+(?:\?[^"'\s>]*)?/g,
    /https?:\/\/ae-pic-a1\.aliexpress-media\.com\/kf\/[A-Za-z0-9_-]+(?:\.[a-zA-Z]+)+(?:\?[^"'\s>]*)?/g,
    /https?:\/\/[a-z0-9.-]+\.amazon\.(?:es|com|co\.uk)\/[^"'\s>]*\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s>]*)?/gi,
    /https?:\/\/img\.temu\.com\/[^"'\s>]*\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s>]*)?/gi,
  ];

  for (const pattern of patterns) {
    const matches = html.match(pattern) || [];
    for (const url of matches) {
      const clean = url.split("?")[0];
      if (!urls.includes(clean) && clean.length > 30) {
        urls.push(clean);
      }
    }
  }
  return urls;
}

async function searchImagesForProduct(productName: string): Promise<{ imageUrl: string; images: string[]; source: string }> {
  const searchQueries = [
    `${productName} aliexpress`,
    `${productName} site:alitools.io`,
    `${productName} amazon`,
    `${productName} temu`,
  ];

  const allImageUrls: string[] = [];
  let source = "web";

  for (const query of searchQueries) {
    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=5`;
      const html = await fetchPageText(searchUrl);
      const urls = extractImageUrls(html);
      allImageUrls.push(...urls);

      const links = html.match(/href="([^"]*(?:aliexpress|amazon|temu|hipobuy)[^"]*)/gi) || [];
      for (const link of links) {
        const url = link.replace(/href="/i, "").split("&")[0];
        if (url.startsWith("http")) {
          const pageHtml = await fetchPageText(url);
          const pageUrls = extractImageUrls(pageHtml);
          allImageUrls.push(...pageUrls);
          if (pageUrls.length > 0) source = url.includes("aliexpress") ? "AliExpress" : url.includes("amazon") ? "Amazon" : url.includes("temu") ? "Temu" : "Hipobuy";
        }
      }
    } catch {
      continue;
    }
  }

  const uniqueUrls = Array.from(new Set(allImageUrls)).filter(u =>
    u.includes("alicdn.com") || u.includes("amazon.") || u.includes("temu.com") || u.includes("hipobuy.com")
  );

  return {
    imageUrl: uniqueUrls[0] || "",
    images: uniqueUrls.slice(0, 6),
    source,
  };
}

export async function runFotografo(): Promise<AgentResult> {
  const start = Date.now();
  try {
    const products = await prisma.product.findMany({
      where: { status: "active" },
      select: { id: true, name: true, imageUrl: true, images: true },
    });

    const updated = [];
    const failed = [];

    for (const product of products) {
      const existingImages = JSON.parse(product.images || "[]");
      if (existingImages.length >= 2 && product.imageUrl && !product.imageUrl.includes("pexels.com")) {
        continue;
      }

      console.log(`[Fotografo] Buscando imagenes para: ${product.name}`);
      const result = await searchImagesForProduct(product.name);

      if (result.images.length > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            imageUrl: result.imageUrl,
            images: JSON.stringify(result.images),
          },
        });
        updated.push({ name: product.name, source: result.source, imageCount: result.images.length });
        console.log(`[Fotografo] OK ${product.name}: ${result.images.length} imagenes de ${result.source}`);
      } else {
        failed.push(product.name);
        console.log(`[Fotografo] SKIP ${product.name}: no se encontraron imagenes`);
      }

      await new Promise(r => setTimeout(r, 2000));
    }

    const result: AgentResult = {
      agent: "fotografo",
      action: "buscar_imagenes",
      success: true,
      data: {
        input: { totalProducts: products.length },
        output: { updated: updated.length, failed: failed.length, details: updated, failedProducts: failed },
      },
      durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  } catch (error: any) {
    const result: AgentResult = {
      agent: "fotografo", action: "buscar_imagenes", success: false,
      error: error.message, durationMs: Date.now() - start,
    };
    await logAgent(result);
    return result;
  }
}

export async function runFotografoForProduct(productId: string): Promise<AgentResult> {
  const start = Date.now();
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Producto no encontrado");

    const result = await searchImagesForProduct(product.name);

    if (result.images.length > 0) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          imageUrl: result.imageUrl,
          images: JSON.stringify(result.images),
        },
      });
    }

    const agentResult: AgentResult = {
      agent: "fotografo",
      action: "buscar_imagenes_producto",
      success: result.images.length > 0,
      data: {
        input: { productId, productName: product.name },
        output: { imageCount: result.images.length, source: result.source, imageUrl: result.imageUrl },
      },
      durationMs: Date.now() - start,
    };
    await logAgent(agentResult);
    return agentResult;
  } catch (error: any) {
    const agentResult: AgentResult = {
      agent: "fotografo", action: "buscar_imagenes_producto", success: false,
      error: error.message, durationMs: Date.now() - start,
    };
    await logAgent(agentResult);
    return agentResult;
  }
}