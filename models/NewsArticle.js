// models/NewsArticle.js
const mongoose = require('mongoose');

const NewsArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    content: { type: String, required: true },
    summary: { type: String }, // Optional: for shorter previews
    imageUrl: { type: String },
    publishedDate: { type: Date, default: Date.now },
    author: { type: String },
    category: { type: String }, // e.g., "Technology", "Sports", "Politics"
    tags: [{ type: String }],
    status: { type: String, default: 'published', enum: ['draft', 'published', 'archived'] }, // Added status
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.models.NewsArticle || mongoose.model('NewsArticle', NewsArticleSchema);