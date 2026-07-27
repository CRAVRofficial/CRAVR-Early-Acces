// Cloudflare Worker: nimmt die Warteliste-Anmeldung von der CRAVR-Seite entgegen
// und legt den Kontakt sicher in Brevo an. Der Brevo-API-Schluessel steht NIE im
// Website-Code, sondern nur hier als Worker-Secret (siehe README.md in diesem Ordner).

const ALLOWED_ORIGIN = "https://cravrofficial.github.io";
const BREVO_LIST_ID = 5; // Liste "CRAVR Early Access" in Brevo

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return json(405, { error: "method_not_allowed" });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json(400, { error: "invalid_json" });
    }

    const email = (payload.email || "").trim();
    const priceSignal = payload.PRICE_SIGNAL || null;

    if (!isValidEmail(email)) {
      return json(400, { error: "invalid_email" });
    }

    const attributes = {};
    if (priceSignal) {
      attributes.PRICE_SIGNAL = priceSignal;
    }

    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    // Brevo meldet 400 "duplicate_parameter", wenn die Mail schon existiert -
    // das zaehlt fuer uns trotzdem als Erfolg (Person ist bereits auf der Liste).
    if (brevoResponse.ok || brevoResponse.status === 400) {
      const body = brevoResponse.status === 400 ? await brevoResponse.json().catch(() => ({})) : null;
      if (brevoResponse.ok || body?.code === "duplicate_parameter") {
        return json(200, { ok: true });
      }
    }

    return json(502, { error: "brevo_request_failed" });
  },
};
