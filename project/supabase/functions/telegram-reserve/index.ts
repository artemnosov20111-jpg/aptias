Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const productName = String(body.productName ?? "");
    const volume = String(body.volume ?? "");
    const total = String(body.total ?? "");
    const orgName = String(body.orgName ?? "");
    const inn = String(body.inn ?? "");
    const contactPerson = String(body.contactPerson ?? "");
    const phone = String(body.phone ?? "");
    const reserveId = String(body.reserveId ?? "");

    if (!productName || !volume || !total) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "8690771821:AAFznN37LIr6J6wUgxe3wLm-I4bBxCF_DP8";
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID") ?? "452501024";

    const message = [
      `🔥 НОВАЯ БРОНЬ С САЙТА!`,
      `🆔 Бронь: #${reserveId}`,
      `📦 Товар: ${productName}`,
      `📊 Объем: ${volume}`,
      `💰 Сумма: ${total} руб.`,
      `🏢 Организация: ${orgName}`,
      `📑 ИНН: ${inn}`,
      `👤 Контакт: ${contactPerson}`,
      `📞 Телефон: ${phone}`,
    ].join("\n");

    const tgResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      },
    );

    const tgData = await tgResponse.json();

    if (!tgResponse.ok || !tgData.ok) {
      return new Response(
        JSON.stringify({ error: "Telegram API error", detail: tgData.description }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
