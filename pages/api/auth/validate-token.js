import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('DEBUG: Decoded token payload:', decoded);
    console.log('DEBUG: Attempting to find user with ID:', decoded.userId);
    const user = await User.findById(decoded.userId).select('-password');

    console.log('DEBUG: User found in DB:', user ? user.email : 'None');
    if (user) {
        console.log('DEBUG: User ID from DB:', user._id);
        console.log('DEBUG: User role from DB:', user.role);
    }

    if (!user) {
      console.warn('DEBUG: User not found for decoded ID. Token may be valid but user does not exist.');
      res.setHeader('Set-Cookie', [`authToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`]);
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found for token' });
    }

     if (user.role !== 'admin') {
      console.warn(`DEBUG: User <span class="math-inline">\{user\.email\} found, but role '</span>{user.role}' is not 'admin'.`);
      res.setHeader('Set-Cookie', [`authToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`]);
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient role' });
    }

    // Return the user data including their role
    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone 
      },
    });

  } catch (error) {
    console.error('DEBUG: Token validation/User fetch error:', error.name, error.message);
    res.setHeader('Set-Cookie', [`authToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`]);
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
    }
    res.status(500).json({ success: false, message: 'Server error during authentication check.' }); // Change 401 to 500 for general server errors
  }
}