import jwt from 'jsonwebtoken';
import User from '../../models/User';
import dbConnect from '../dbConnect';

const authMiddleware = (requiredRole) => async (req, res) => {
  await dbConnect();

  const token = req.cookies.authToken;

  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized: No authentication token provided.' });
    return false;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.setHeader('Set-Cookie', [`authToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`]);
      res.status(401).json({ success: false, message: 'Unauthorized: User not found.' });
      return false;
    }

    if (requiredRole && user.role !== requiredRole) {
      res.setHeader('Set-Cookie', [`authToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`]);
      res.status(403).json({ success: false, message: `Forbidden: ${requiredRole} role required.` });
      return false;
    }

    req.user = user;
    return true;
  } catch (error) {
    console.error('Authentication/Authorization Error in middleware:', error);
    res.setHeader('Set-Cookie', [`authToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`]);
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Authentication failed: Session expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ success: false, message: 'Authentication failed: Invalid token. Please log in again.' });
    } else {
      res.status(500).json({ success: false, message: 'Server error during authentication.' });
    }
    return false;
  }
};

export default authMiddleware;