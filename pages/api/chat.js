// pages/api/chat.js - Modified for News
import dbConnect from "../../lib/dbConnect";
// const Vehicle = require("../../models/Vehicle"); // REMOVE this line
const NewsArticle = require("../../models/NewsArticle"); // ADD your NewsArticle model

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  await dbConnect();

  // Fetch distinct news categories/topics from the database
  // Adjust this based on how your news articles are categorized
  const categories = await NewsArticle.distinct("category", { status: "published" }); // Assuming a 'status' field for news
  const lowerMsg = message.toLowerCase();

  let newsInfo = "";

  // Logic to find news based on user query (e.g., categories, keywords)
  const foundCategory = categories.find((cat) => lowerMsg.includes(cat.toLowerCase()));

  if (foundCategory) {
    const articles = await NewsArticle.find({ category: foundCategory, status: "published" }).limit(3);
    if (articles.length > 0) {
      newsInfo = `Манай сайтад ${foundCategory.toUpperCase()} ангилалд дараах мэдээллүүд байна:\n` +
        articles.map(
          (article) => `- ${article.title}, огноо: ${new Date(article.publishedDate).toLocaleDateString('mn-MN')}` // Assuming 'publishedDate' field
        ).join("\n");
    } else {
      newsInfo = `${foundCategory.toUpperCase()} ангилалд одоогоор мэдээ байхгүй байна.`;
    }
  } else if (lowerMsg.includes("сүүлийн үеийн мэдээ") || lowerMsg.includes("хамгийн сүүлийн мэдээ")) {
      // Example: Handle "latest news" query
      const latestArticles = await NewsArticle.find({ status: "published" }).sort({ publishedDate: -1 }).limit(3);
      if (latestArticles.length > 0) {
          newsInfo = "Сүүлийн үеийн мэдээллүүд:\n" +
              latestArticles.map(
                  (article) => `- ${article.title}, огноо: ${new Date(article.publishedDate).toLocaleDateString('mn-MN')}`
              ).join("\n");
      } else {
          newsInfo = "Одоогоор мэдээ олдсонгүй.";
      }
  }
  // You can add more specific intent detection here, e.g., for "summarize [article title]"

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Consider using gpt-4o-mini for better performance and cost
        messages: [
          {
            role: "system",
            content: `\nЧи бол Монгол хэлээр харилцдаг манай мэдээллийн сайтын туслах чатбот. Чи хэрэглэгчдэд мэдээ, мэдээлэл хайж олох, ерөнхий асуултад хариулах үүрэгтэй. ${newsInfo}`, // Updated system prompt
          },
          { role: "user", content: message },
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ reply: "OpenAI API error: " + error });
    }

    const data = await response.json();
    const aiMessage =
      data.choices?.[0]?.message?.content || "AI-с хариу ирсэнгүй.";

    res.status(200).json({ reply: aiMessage });
  } catch (err) {
    res.status(500).json({ reply: "Серверийн алдаа: " + err.message });
  }
}