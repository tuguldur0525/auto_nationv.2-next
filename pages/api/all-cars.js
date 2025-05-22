import dbConnect from "../../lib/dbConnect"
const Vehicle = require("../../models/Vehicle")

export default async function handler(req, res) {
  await dbConnect()
  const cars = await Vehicle.find({})
  res.status(200).json(cars)
}
