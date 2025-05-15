import Vehicle from '@/models/Vehicle';
import { getSession } from 'next-auth/react';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });

  upload.array('images')(req, res, async (err) => {
    if (err) return res.status(500).json({ error: 'File upload error' });

    try {
      const vehicleData = {
        title: req.body.title,
        km: parseInt(req.body.km),
        fuel: req.body.fuel,
        type: req.body.type,
        price: parseInt(req.body.price),
        location: req.body.location,
        specifications: JSON.parse(req.body.specifications || '{}'),
        contact: {
          email: req.body.email,
          phone: req.body.phone
        },
        details: {
          modelYear: parseInt(req.body.modelYear),
          importYear: req.body.importYear ? parseInt(req.body.importYear) : undefined,
          description: req.body.description
        },
        owner: session.user.id,
        images: req.files?.map(file => ({
          data: file.buffer,
          contentType: file.mimetype
        })) || []
      };

      const newVehicle = await Vehicle.create(vehicleData);
      res.status(201).json(newVehicle);
    } catch (error) {
      console.error('Creation error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
}