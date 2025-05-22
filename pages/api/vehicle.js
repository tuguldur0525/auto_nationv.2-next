import Vehicle from "@/models/Vehicle"
import dbConnect from "../../../lib/dbConnect"
import authMiddleware from "../../../lib/middleware/authMiddleware"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  await dbConnect()

  const isAuthenticated = await authMiddleware(null)(req, res)

  if (!isAuthenticated) {
    return
  }

  await new Promise((resolve, reject) => {
    upload.array("images")(req, res, (err) => {
      if (err) {
        console.error("File upload error:", err)
        return reject({ status: 500, message: "File upload error" })
      }
      resolve()
    })
  })

  try {
    const ownerId = req.user._id

    const vehicleData = {
      title: req.body.title,
      km: parseInt(req.body.km),
      fuel: req.body.fuel,
      type: req.body.type,
      price: parseInt(req.body.price),
      location: req.body.location,
      specifications: JSON.parse(req.body.specifications || "{}"),
      contact: {
        email: req.body.email,
        phone: req.body.phone,
      },
      details: {
        modelYear: parseInt(req.body.modelYear),
        importYear: req.body.importYear
          ? parseInt(req.body.importYear)
          : undefined,
        description: req.body.description,
      },
      owner: ownerId,
      images: ["url1", "url2"],
    }

    const newVehicle = await Vehicle.create(vehicleData)
    res.status(201).json({ success: true, vehicle: newVehicle }) // Consistent success response
  } catch (error) {
    console.error("Vehicle creation API error:", error)
    if (error.name === "ValidationError") {
      // Mongoose validation errors
      const messages = Object.values(error.errors).map((val) => val.message)
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") })
    }
    res.status(500).json({
      success: false,
      message: "Server error during vehicle creation.",
    })
  }
}
