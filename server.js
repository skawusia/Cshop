const express = require("express");
const fetch = require("node-fetch"); // jeśli Node < 18
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.post("/order", async (req, res) => {
  const { cart, code } = req.body;

  if(!cart || cart.length===0){
    return res.status(400).json({ error:"Koszyk pusty" });
  }
  if(!code){
    return res.status(400).json({ error:"Brak kodu" });
  }

  let total = 0;
  let list = "";

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    list += `• ${item.name} x${item.quantity} = ${itemTotal} $\n`;
  });

  try {
    await fetch("https://discordapp.com/api/webhooks/1491183612287258674/fb08lNMvTfG6FWRg1-hDTmIlbHwazX3k-4V_kmPzcuczFzueTbeXwzLzELCgsEPBElcF", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        content:
`🛒 NOWE ZAMÓWIENIE

📦 Produkty:
${list}

💰 Suma: ${total} $
🏷 Kod użytkownika: ${code}`
      })
    });
    res.json({ ok:true });
  } catch(err){
    console.error(err);
    res.status(500).json({ error:"Webhook error" });
  }
});

app.listen(3000, ()=>console.log("Serwer działa: http://localhost:3000"));