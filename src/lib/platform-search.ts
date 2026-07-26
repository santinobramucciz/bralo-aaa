export interface PlatformResult {
  platform: string;
  productName: string;
  priceEUR: number;
  imageUrl: string;
  productUrl: string;
  shipping: number;
  totalCost: number;
}

export async function searchAliExpress(query: string): Promise<PlatformResult | null> {
  try {
    const searchUrl = `https://es.aliexpress.com/wholesale?SearchText=${encodeURIComponent(query)}&SortType=price_asc`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9",
      },
    });
    const html = await response.text();

    const productMatch = html.match(/"formattedActivityPrice":\s*\[?"EUR\s*([\d.]+)/);
    const imageMatch = html.match(/"imageUrl"\s*:\s*"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/);
    const titleMatch = html.match(/"subject"\s*:\s*"([^"]+)"/);
    const linkMatch = html.match(/"productUrl"\s*:\s*"([^"]+)"/);

    if (!productMatch) return null;

    const price = parseFloat(productMatch[1]);
    let imageUrl = imageMatch ? imageMatch[1].replace(/\\\//g, "/") : "";
    if (imageUrl && !imageUrl.startsWith("http")) imageUrl = "https:" + imageUrl;

    let productUrl = linkMatch ? linkMatch[1].replace(/\\\//g, "/") : searchUrl;
    if (productUrl && !productUrl.startsWith("http")) productUrl = "https:" + productUrl;

    return {
      platform: "AliExpress",
      productName: titleMatch?.[1] || query,
      priceEUR: price,
      imageUrl,
      productUrl,
      shipping: 0,
      totalCost: price,
    };
  } catch {
    return null;
  }
}

export async function searchAmazon(query: string): Promise<PlatformResult | null> {
  try {
    const searchUrl = `https://www.amazon.es/s?k=${encodeURIComponent(query)}&s=price-asc-rank`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9",
      },
    });
    const html = await response.text();

    const priceMatch = html.match(/"priceAmount":\s*([\d.]+)/);
    const imageMatch = html.match(/"imageUrl"\s*:\s*"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/);
    const titleMatch = html.match(/"title"\s*:\s*"([^"]+)"/);

    if (!priceMatch) return null;

    const price = parseFloat(priceMatch[1]);
    const imageUrl = imageMatch ? imageMatch[1].replace(/\\\//g, "") : "";

    return {
      platform: "Amazon",
      productName: titleMatch?.[1] || query,
      priceEUR: price,
      imageUrl,
      productUrl: searchUrl,
      shipping: 0,
      totalCost: price,
    };
  } catch {
    return null;
  }
}

export async function searchTemu(query: string): Promise<PlatformResult | null> {
  try {
    const searchUrl = `https://www.temu.com/es/search_result.html?search_key=${encodeURIComponent(query)}&search_method=user`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9",
      },
    });
    const html = await response.text();

    const priceMatch = html.match(/"minSalePrice"\s*:\s*([\d.]+)/);
    const imageMatch = html.match(/"thumbUrl"\s*:\s*"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/);

    if (!priceMatch) return null;

    const price = parseFloat(priceMatch[1]);
    const imageUrl = imageMatch ? imageMatch[1].replace(/\\\//g, "") : "";

    return {
      platform: "Temu",
      productName: query,
      priceEUR: price,
      imageUrl,
      productUrl: searchUrl,
      shipping: 0,
      totalCost: price,
    };
  } catch {
    return null;
  }
}

export async function searchHipobuy(query: string): Promise<PlatformResult | null> {
  try {
    const searchUrl = `https://www.hipobuy.com/search?keyword=${encodeURIComponent(query)}&sort=price_asc`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9",
      },
    });
    const html = await response.text();

    const priceMatch = html.match(/"price"\s*:\s*([\d.]+)/);
    const imageMatch = html.match(/"(?:imageUrl|thumbUrl|imgUrl)"\s*:\s*"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/);
    const titleMatch = html.match(/"title"\s*:\s*"([^"]+)"/);

    if (!priceMatch) return null;

    const priceCNY = parseFloat(priceMatch[1]);
    const priceEUR = +(priceCNY * 0.13).toFixed(2);
    const imageUrl = imageMatch ? imageMatch[1].replace(/\\\//g, "") : "";

    let productUrl = searchUrl;
    const linkMatch = html.match(/"(?:productUrl|detailUrl)"\s*:\s*"(https?:\/\/[^"]+)"/);
    if (linkMatch) productUrl = linkMatch[1].replace(/\\\//g, "");

    return {
      platform: "Hipobuy",
      productName: titleMatch?.[1] || query,
      priceEUR,
      imageUrl,
      productUrl,
      shipping: 0,
      totalCost: priceEUR,
    };
  } catch {
    return null;
  }
}

export async function compareAllPlatforms(query: string): Promise<{
  bestDeal: PlatformResult | null;
  allResults: PlatformResult[];
}> {
  const results = await Promise.allSettled([
    searchAliExpress(query),
    searchAmazon(query),
    searchTemu(query),
    searchHipobuy(query),
  ]);

  const allResults = results
    .filter((r): r is PromiseFulfilledResult<PlatformResult> => r.status === "fulfilled" && r.value !== null)
    .map((r) => r.value);

  allResults.sort((a, b) => a.totalCost - b.totalCost);

  return {
    bestDeal: allResults[0] || null,
    allResults,
  };
}
