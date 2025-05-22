// pages/api/cars/[id].js
import dbConnect from '../../../lib/dbConnect';
import Vehicle from '../../../models/Vehicle';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      await dbConnect();

      // Ensure that 'owner' is populated if you want owner details
      // and update the field names if they are different in your User model
      const vehicle = await Vehicle.findById(id).lean(); // Keep .lean() for performance

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      // Map the database fields to match the expected structure in the component
       const carData = {
          id: vehicle._id.toString(), // Convert ObjectId to string
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.details.modelYear,
          description: vehicle.details.description,
          price: vehicle.price,
          mileage: vehicle.km,
          engineType: vehicle.fuel,
          // Corrected: Access Map properties directly with dot notation or bracket notation
          transmission: vehicle.specifications.transmission || null, // Access directly
          ownerName: vehicle.owner ? vehicle.owner.name : 'Unknown', // This assumes 'owner' is populated, or you handle it client-side if not
          ownerStatus: 'Unknown', // You might need to fetch this from the User model if populated
          ownerPhone: vehicle.contact.phone,
          vin: vehicle.specifications.vin || null,
          code: vehicle.specifications.code || null,
          importedYear: vehicle.details.importYear,
          engineCapacity: vehicle.specifications.engineCapacity || null,
          steeringWheel: vehicle.specifications.steeringWheel || null,
          driveType: vehicle.specifications.driveType || null,
          color: vehicle.specifications.color || null,
          doorCount: vehicle.specifications.doorCount || null,
          seatCount: vehicle.specifications.seatCount || null,
          imageUrls: vehicle.images,
        };

      res.status(200).json(carData);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}