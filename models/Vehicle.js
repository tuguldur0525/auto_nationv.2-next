const mongoose = require("mongoose")

const vehicleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String],
    required: true,
    trim: true,
  },

  km: {
    type: Number,
    required: true,
    min: 0,
  },
  fuel: {
    type: String,
    required: true,
    enum: ["Хибрид", "Бензин", "Дизель", "Цахилгаан"],
  },
  type: {
    type: String,
    required: true,
    enum: ["Седан", "SUV", "Coupe", "Хэтчбек", "Пикап"],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
    default: "Улаанбаатар",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "declined", "deleted"],
    default: "pending",
  },
  specifications: Map,
  contact: {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  details: {
    modelYear: {
      type: Number,
      required: true,
    },
    importYear: Number,
    description: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Vehicle", vehicleSchema)
