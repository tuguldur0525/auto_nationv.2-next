import { getSession } from 'next-auth/react';
import Vehicle from '../../../models/Vehicle';
import dbConnect from '../../../lib/dbConnect';
import adminMiddleware from '../../../middleware/admin';

export default async function handler(req, res) {
  await dbConnect();
  await adminMiddleware(req, res);

  try {
    if (req.method === 'GET') {
      const { status, page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const [listings, total] = await Promise.all([
        Vehicle.find({ status })
          .populate('owner', 'email')
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        Vehicle.countDocuments({ status })
      ]);

      res.status(200).json({
        listings,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page)
      });
    }
    else if (req.method === 'PUT') {
      const { id } = req.query;
      const { status } = req.body;

      const updatedListing = await Vehicle.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('owner', 'email');

      res.status(200).json(updatedListing);
    }
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      await Vehicle.findByIdAndDelete(id);
      res.status(200).json({ success: true });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin listings error:', error);
    res.status(500).json({ error: 'Серверийн алдаа' });
  }
}