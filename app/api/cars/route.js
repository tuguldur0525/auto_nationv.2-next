// app/api/cars/route.js
import dbConnect from "../../../lib/dbConnect"
import mongoose from "mongoose"

import Vehicle from "../../../models/Vehicle"
import { NextResponse } from "next/server"
import cloudinary from "../../../lib/cloudinary"

export async function GET(req) {
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const owner = searchParams.get("owner")

  let filter = {}
  if (owner) filter.owner = new mongoose.Types.ObjectId(owner)

  try {
    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 })
    return NextResponse.json(vehicles)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  await dbConnect()
  const formData = await req.formData()

  // FormData-аас талбаруудыг авах
  const title = formData.get("title")
  const brand = formData.get("brand")
  const model = formData.get("model")
  const km = Number(formData.get("km"))
  const fuel = formData.get("fuel")
  const type = formData.get("type")
  const price = Number(formData.get("price"))
  const location = formData.get("location")
  const modelYear = Number(formData.get("modelYear"))
  const importYear = Number(formData.get("importYear"))
  const description = formData.get("description")
  const email = formData.get("email")
  const phone = formData.get("phone")
  const specifications = JSON.parse(formData.get("specifications") || "{}")
  const owner = formData.get("owner")

  // Images upload
  let images = []
  const imageFiles = formData.getAll("images")
  for (const file of imageFiles) {
    if (typeof file === "string") continue
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    // Cloudinary upload
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "autonation" }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
        .end(buffer)
    })
    images.push(uploadRes.secure_url)
  }

  try {
    const vehicle = new Vehicle({
      title,
      images,
      km,
      brand,
      model,
      fuel,
      type,
      price,
      location,
      details: { modelYear, importYear, description },
      contact: { email, phone },
      specifications,
      owner,
    })
    await vehicle.save()
    return NextResponse.json({ success: true, vehicle })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
