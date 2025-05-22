import Vehicle from '../../../models/Vehicle';
import dbConnect from '../../../lib/dbConnect';
import authMiddleware from '../../../lib/middleware/authMiddleware'; // Make sure this path is correct

export default async function handler(req, res) {
  // Apply the authentication middleware for 'admin' role
  // This will handle the token verification, user lookup, and role check.
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
  await dbConnect(); // Connect to the database

  try {
    if (req.method === 'GET') {
      const { status, page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit); // Use parseInt for page and limit

      const query = status ? { status } : {}; // Add this to handle cases where status might be empty/all
      
      const [listings, total] = await Promise.all([
        Vehicle.find(query) // Use the constructed query
          .populate('owner', 'email')
          .skip(skip)
          .limit(parseInt(limit)) // Ensure limit is parsed as a number
          .sort({ createdAt: -1 }),
        Vehicle.countDocuments(query) // Use the constructed query
      ]);

      res.status(200).json({
        listings,
        totalPages: Math.ceil(total / parseInt(limit)), // Ensure limit is parsed
        currentPage: parseInt(page) // Ensure page is parsed
      });
    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const { status } = req.body;

      if (!['approved', 'declined', 'pending'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status provided.' });
      }

      const updatedListing = await Vehicle.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('owner', 'email');

      if (!updatedListing) {
        return res.status(404).json({ success: false, message: 'Listing not found.' });
      }

      res.status(200).json(updatedListing);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      const deletedListing = await Vehicle.findByIdAndDelete(id);

      if (!deletedListing) {
        return res.status(404).json({ success: false, message: 'Listing not found.' });
      }

      res.status(200).json({ success: true, message: 'Listing deleted successfully.' });
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: 'Method not allowed' }); // Using json for consistency
    }
  } catch (error) {
    console.error('Admin listings API error:', error);
    res.status(500).json({ success: false, error: 'Серверийн алдаа' });
  }
}