import { getSession } from 'next-auth/react';
import User from '../../../models/User';
import Vehicle from '../../../models/Vehicle';
import dbConnect from '../../../lib/dbConnect';
import adminMiddleware from '../../../middleware/admin';

export default async function handler(req, res) {
  await dbConnect();
  await adminMiddleware(req, res);

  try {
    if (req.method === 'GET') {
      const users = await User.find().sort({ createdAt: -1 });
      res.status(200).json(users);
    }
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      await Promise.all([
        User.findByIdAndDelete(id),
        Vehicle.deleteMany({ owner: id })
      ]);
      res.status(200).json({ success: true });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Серверийн алдаа' });
  }
}