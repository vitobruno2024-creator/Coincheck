// Run: npm install express @anthropic-ai/sdk
// Then: ANTHROPIC_API_KEY=your_key_here node server.js
import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(express.static(".")); // serves index.html

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

const PROMPT = `You are an expert US error coin examiner. Look closely at the coin photos.
1. Identify the coin (type, year, mint mark if visible).
2. If you spot a possible doubled die or other variety, first search the reference sites VarietyVista (varietyvista.com), CONECA (conecaonline.org), and the Cherrypickers' Guide listings to confirm the diagnostic markers, such as exactly where the doubling appears. List any possible errors or varieties you can see, such as doubled die, repunched mint mark, off-center strike, clipped planchet, die crack, die break, cud, wrong planchet, broadstrike, or struck-through.
3. Say how confident you are for each: obvious, possible, or unlikely. Be honest, and do not invent errors. Remember that damage after minting, like scratches, wear, or cleaning, is not a mint error.
4. For any likely error, search ONLY PCGS (pcgs.com), Heritage Auctions (ha.com), Stack's Bowers (stacksbowers.com), and GreatCollections (greatcollections.com) for recent prices realized on the same coin, year, and error, ideally in a similar grade. Report what each site shows, labelled by site, with the grade and the sale price. If a site has no match, say so. Do not make up prices, and note that value depends heavily on grade.
5. End with a verdict: Worth a closer look, or Probably normal. Remind the user that only a grading service or expert can confirm.`;

app.post("/api/scan", async (req, res) => {
  try {
    const { type, year, front, back } = req.body;
    const content = [];
    content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: front } });
    if (back) content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: back } });
    content.push({ type: "text", text: `${PROMPT}\n\nUser hints - type: ${type || "unknown"}, year: ${year || "unknown"}.` });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 8, allowed_domains: ["varietyvista.com", "conecaonline.org", "pcgs.com", "ha.com", "stacksbowers.com", "greatcollections.com"] }],
      messages: [{ role: "user", content }]
    });

    const report = response.content.filter(b => b.type === "text").map(b => b.text).join("\n");
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Open http://localhost:3000"));
