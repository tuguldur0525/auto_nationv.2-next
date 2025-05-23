import User from '../../../models/User';
import Vehicle from '../../../models/Vehicle'; // Assuming 'Vehicle' is used for listings
import dbConnect from '../../../lib/dbConnect';
import authMiddleware from '../../../lib/middleware/authMiddleware'; // Corrected import path and name

export default async function handler(req, res) {
  // Apply the authentication middleware for 'admin' role
  // This will handle token verification, user lookup, and role check.
  // If the user is not authenticated or not an admin, it will send a response
  // (401 or 403) and return false.
  const isAuthenticated = await authMiddleware('admin')(req, res);

  // If isAuthenticated is false, it means the middleware already sent a response
  // (e.g., 401 Unauthorized, 403 Forbidden), so we simply stop execution here.
  if (!isAuthenticated) {
    return;
  }

  // If we reach here, the user is an authenticated admin.
  // We can now safely proceed with the API logic.
  await dbConnect(); // Ensure DB connection is established

  try {
    if (req.method === 'GET') {
      const users = await User.find().sort({ createdAt: -1 }).select('-password'); // Select -password for security
      res.status(200).json(users);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      // Check if the user to be deleted exists
      const userToDelete = await User.findById(id);
      if (!userToDelete) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      // Perform deletion of user and their associated vehicles
      await Promise.all([
        User.findByIdAndDelete(id),
        Vehicle.deleteMany({ owner: id })
      ]);
      
      res.status(200).json({ success: true, message: 'User and associated listings deleted successfully.' });
    } else {
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin users API error:', error);
    res.status(500).json({ success: false, error: 'Серверийн алдаа' });
  }
}