import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = '7d';

// Create JWT token
export function createAuthToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES
  });
}

// Verify JWT token
export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware for protected routes
export async function authMiddleware(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Нэвтрэх шаардлагатай'
    });
  }

  const decoded = verifyAuthToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Хүчингүй токен'
    });
  }

  req.userId = decoded.userId;
  next();
}