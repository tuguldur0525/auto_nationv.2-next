
import User from '../../../../models/User';
import Vehicle from '../../../../models/Vehicle';
import dbConnect from '../../../../lib/dbConnect';

export default async function handler(req, res) {
    await dbConnect();

    try {
        if (req.method === 'GET') {
            const users = await User.find().sort({ createdAt: -1 }).select('-password');
            return res.status(200).json(users); // Added return
        } else if (req.method === 'DELETE') {
            const { id } = req.query;

            console.log(`Attempting to delete user with ID: ${id}`); // Add console log

            const userToDelete = await User.findById(id);
            if (!userToDelete) {
                console.log(`User with ID ${id} not found.`); // Add console log
                return res.status(404).json({ success: false, message: 'User not found.' });
            }

            await Promise.all([
                User.findByIdAndDelete(id),
                Vehicle.deleteMany({ owner: id })
            ]);

            console.log(`User ${id} and associated listings deleted successfully.`); // Add console log
            return res.status(200).json({ success: true, message: 'User and associated listings deleted successfully.' }); // Added return
        } else {
            res.setHeader('Allow', ['GET', 'DELETE']);
            return res.status(405).json({ error: 'Method not allowed' }); // Added return
        }
    } catch (error) {
        console.error('Admin users API error:', error);
        // Ensure this error response is always JSON
        return res.status(500).json({ success: false, error: 'Серверийн алдаа', details: error.message });
    }
}