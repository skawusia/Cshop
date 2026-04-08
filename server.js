// server.js
const express = require("express");
const fetch = require("node-fetch"); // npm install node-fetch@2
const path = require("path");

const app = express();
app.use(express.json());

// serwowanie statycznych plików z katalogu "public"
app.use(express.static(path.join(__dirname, "public")));

// webhook Discorda — podmień na swój URL
const WEBHOOK_URL = "https://discordapp.com/api/webhooks/1491183612287258674/fb08lNMvTfG6FWRg1-hDTmIlbHwazX3k-4V_kmPzcuczFzueTbeXwzLzELCgsEPBElcF";

// endpoint do obsługi zamówień
app.post("/order", async (req, res) => {
  const { cart, code } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: "Koszyk jest pusty!" });
  }
  if (!code || code.trim() === "") {
    return res.status(400).json({ error: "Musisz podać kod!" });
  }

  let total = 0;
  let list = "";

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    list += `• ${item.name} x${item.quantity} = ${itemTotal} $\n`;
  });

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
`🛒 **NOWE ZAMÓWIENIE**
💳 Kod użytkownika: ${code}

📦 Produkty:
${list}

💰 Suma: ${total} $`
      })
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd wysyłki webhooka" });
  }
});

app.listen(3000, () => console.log("Serwer działa: http://localhost:3000"));