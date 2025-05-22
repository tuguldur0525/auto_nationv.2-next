import Vehicle from "@/models/Vehicle"
import dbConnect from "../../../lib/dbConnect"
import authMiddleware from "../../../lib/middleware/authMiddleware"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })
import formidable from "formidable"
import dbConnect from "../../../lib/dbConnect"
import Vehicle from "@/models/Vehicle"
import authMiddleware from "../../../lib/middleware/authMiddleware"

export const config = {
  api: {
    bodyParser: false,
  },
}
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  await dbConnect()

  const isAuthenticated = await authMiddleware(null)(req, res)

  if (!isAuthenticated) {
    return
  }
  await dbConnect()
  const isAuthenticated = await authMiddleware(null)(req, res)
  if (!isAuthenticated) return

  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Form parse error" })
    }

    try {
      const ownerId = req.user._id
      const vehicleData = {
        brand: fields.brand,
        model: fields.model,
        title: fields.title,
        km: parseInt(fields.km),
        fuel: fields.fuel,
        type: fields.type,
        price: parseInt(fields.price),
        location: fields.location,
        specifications: JSON.parse(fields.specifications || "{}"),
        contact: {
          email: fields.email,
          phone: fields.phone,
        },
        details: {
          modelYear: parseInt(fields.modelYear),
          importYear: fields.importYear
            ? parseInt(fields.importYear)
            : undefined,
          description: fields.description,
        },
        owner: ownerId,
        images: [], // файлуудыг энд боловсруулж болно
      }
      // files.images -ийг боловсруулж images массив үүсгэнэ
      const newVehicle = await Vehicle.create(vehicleData)
      res.status(201).json({ success: true, vehicle: newVehicle })
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => val.message)
        return res
          .status(400)
          .json({ success: false, message: messages.join(", ") })
      }
      res.status(500).json({
        success: false,
        message: error.message || "Server error during vehicle creation.",
      })
    }
  })
}
