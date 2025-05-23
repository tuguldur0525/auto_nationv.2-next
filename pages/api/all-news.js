import dbConnect from "../../lib/dbConnect";
const NewsArticle = require("../../../models/NewsArticle");

export default async function handler(req, res) {
  await dbConnect();
  const articles = await NewsArticle.find({ status: "published" }).sort({ publishedDate: -1 });
  res.status(200).json(articles);
}