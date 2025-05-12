import User from '../../../models/User';
import dbConnect from '../../../lib/dbConnect';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Зөвхөн POST хүсэлт хүлээн авах боломжтой' });
  }

  try {
    const { name, email, phone, password } = req.body;

    // Check existing users
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Имэйл эсвэл утасны дугаар бүртгэлтэй байна!'
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      role: 'user'
    });

    // Return response without password
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      data: userResponse
    });

  } catch (error) {
    console.error('Бүртгэлийн алдаа:', error);
    res.status(500).json({
      success: false,
      message: 'Серверийн алдаа. Дахин оролдоно уу.'
    });
  }
}