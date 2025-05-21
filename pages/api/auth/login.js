import User from "../../../models/User"
import dbConnect from "../../../lib/dbConnect"
import { createAuthToken } from "../../../lib/auth"

export default async function handler(req, res) {
  await dbConnect()

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({
        success: false,
        message: "Зөвхөн POST хүсэлт хүлээн авах боломжтой",
      })
  }

  try {
    const { emailPhone, password } = req.body

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailPhone }, { phone: emailPhone }],
    }).select("+password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Нэвтрэх мэдээлэл буруу байна",
      })
    }

    // Verify password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Буруу нэвтрэх мэдээлэл",
      })
    }

    // Create JWT token
    const token = createAuthToken(user._id)

    // Set HTTP-only cookie
    res.setHeader("Set-Cookie", [
      `authToken=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
        7 * 24 * 60 * 60
      }; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`,
    ])

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Нэвтрэх алдаа:", error)
    res.status(500).json({
      success: false,
      message: "Серверийн алдаа. Дахин оролдоно уу.",
    })
  }
}
