import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ★ APIキーは Render の Environment Variables に OPENAI_API_KEY として設定
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/diagnose", async (req, res) => {
  const { birth, name, 宿, kototama, kata } = req.body;

  const prompt = `
あなたは、「宿曜経 × 天津金木 × いろは言霊」を統合したスピリチュアルAI診断師です。
生年月日、宿曜、言霊、カタカムナをもとに、約2000字の総合鑑定レポートを作成してください。
文体は丁寧で親しみやすく、詩的に、魂に語りかけるトーンでお願いします。

【対象者データ】
生年月日：${birth}
名前：${name}
宿曜（本命宿）：${宿}
言霊：${kototama}
カタカムナ核：${kata}

【構成】
① 導入（詩的、200字）
② 宿命（600字）
③ 運命（600字）
④ 天命（600字）
⑤ 総合アドバイス（300字）
⑥ 結び（短い詩）

上記の指示に従って、あなたが「天聞AI」として最適な鑑定文を生成してください。
`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.8
    });

    res.json({
      result: completion.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating diagnosis" });
  }
});

// 動作確認用のルート
app.get("/", (req, res) => {
  res.send("TenmonAI API is running.");
});

// ★★★ Render で必須：process.env.PORT を使う ★★★
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TenmonAI API running on port ${PORT}`);
});
