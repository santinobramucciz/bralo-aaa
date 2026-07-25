import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOrderEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; qty: number; priceEUR: number }[];
  totalEUR: number;
}

export async function sendNewOrderEmail(params: SendOrderEmailParams) {
  const { orderNumber, customerName, customerEmail, items, totalEUR } = params;

  const itemsHtml = items
    .map((i) => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.priceEUR.toFixed(2)} EUR</td></tr>`)
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a1a2e;color:#e94560;padding:20px;text-align:center;">
        <h1 style="margin:0;font-size:24px;">BraLo - Nuevo Pedido</h1>
      </div>
      <div style="padding:20px;background:#f9f9f9;">
        <h2>Pedido #${orderNumber}</h2>
        <p><strong>Cliente:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead>
            <tr style="background:#1a1a2e;color:white;">
              <th style="padding:8px;text-align:left;">Producto</th>
              <th style="padding:8px;text-align:center;">Cantidad</th>
              <th style="padding:8px;text-align:right;">Precio</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="font-size:18px;"><strong>Total: ${totalEUR.toFixed(2)} EUR</strong></p>
        <p style="color:#666;font-size:12px;">Accede al panel de administracion para gestionar el pedido.</p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: "BraLo <onboarding@resend.dev>",
    to: "santinobramucciz@gmail.com",
    subject: `[BraLo] Nuevo pedido #${orderNumber}`,
    html,
  });
}
