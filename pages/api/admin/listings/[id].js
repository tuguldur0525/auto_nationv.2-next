import Vehicle from "../../../../models/Vehicle"
import dbConnect from "../../../../lib/dbConnect"
import authMiddleware from "../../../../lib/middleware/authMiddleware"

export default async function handler(req, res) {
  // Админ эрх шалгах
  const isAuthenticated = await authMiddleware("admin")(req, res)
  if (!isAuthenticated) return

  await dbConnect()

  const { id } = req.query

  try {
    if (req.method === "PUT") {
      const { status } = req.body
      if (!["approved", "declined", "pending"].includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Буруу статус илгээгдлээ." })
      }
      const updatedListing = await Vehicle.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate("owner", "email")
      if (!updatedListing) {
        return res
          .status(404)
          .json({ success: false, message: "Зар олдсонгүй." })
      }
      return res.status(200).json({ success: true, listing: updatedListing })
    } else if (req.method === "DELETE") {
      const deletedListing = await Vehicle.findByIdAndDelete(id)
      if (!deletedListing) {
        return res
          .status(404)
          .json({ success: false, message: "Зар олдсонгүй." })
      }
      return res
        .status(200)
        .json({ success: true, message: "Зар амжилттай устгагдлаа." })
    } else {
      res.setHeader("Allow", ["PUT", "DELETE"])
      return res
        .status(405)
        .json({ success: false, message: "Энэ үйлдэл зөвшөөрөгдөөгүй." })
    }
  } catch (error) {
    console.error("Admin listings/[id] API алдаа:", error)
    return res.status(500).json({ success: false, message: "Серверийн алдаа." })
  }
}
