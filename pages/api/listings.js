// pages/api/listings.js
// RENAME THIS FILE FROM pages/api/vehicle.js TO pages/api/listings.js

import Vehicle from "../../models/Vehicle"; // Assuming your Vehicle model is at "@/models/Vehicle"
import dbConnect from "../../lib/dbConnect"; // Path from pages/api to lib/dbConnect.js
import authMiddleware from "../../lib/middleware/authMiddleware"; // Path from pages/api to lib/middleware/authMiddleware.js
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false, // Required for multer to parse form data
  },
};

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;
  const { limit = 20, status, type } = query; // Added 'type' for filtering, if needed later

  switch (method) {
    case 'GET':
      try {
        let findQuery = {};

        // Apply status filter based on query parameter
        if (status) {
          findQuery.status = status;
        } else {
          // Default to 'approved' for public consumption if no status is specified
          findQuery.status = 'approved';
        }

        // Apply type filter if provided (e.g., 'newCar', 'electricCar', 'SUV')
        if (type) {
          findQuery.type = type;
        }

        const vehicles = await Vehicle.find(findQuery)
          .limit(parseInt(limit))
          .sort({ createdAt: -1 }); // Sort by creation date, newest first

        // Return a structured response as { success: true, vehicles: [...] }
        res.status(200).json({ success: true, vehicles });

      } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(400).json({ success: false, message: error.message || 'Error fetching vehicles.' });
      }
      break;

    case 'POST':
      // The POST method requires authentication
      const isAuthenticated = await authMiddleware(null)(req, res); // `null` for no specific role, just authenticated

      if (!isAuthenticated) {
        return; // authMiddleware has already sent an error response
      }

      // Handle file upload with multer
      await new Promise((resolve, reject) => {
        upload.array("images")(req, res, (err) => {
          if (err) {
            console.error("File upload error:", err);
            return reject({ status: 500, message: "File upload error" });
          }
          resolve();
        });
      });

      try {
        const ownerId = req.user._id;

        // Construct vehicle data from request body
        const vehicleData = {
          title: req.body.title,
          km: parseInt(req.body.km),
          fuel: req.body.fuel,
          type: req.body.type,
          price: parseInt(req.body.price),
          location: req.body.location,
          specifications: JSON.parse(req.body.specifications || "{}"),
          contact: {
            email: req.body.email,
            phone: req.body.phone,
          },
          details: {
            modelYear: parseInt(req.body.modelYear),
            importYear: req.body.importYear
              ? parseInt(req.body.importYear)
              : undefined,
            description: req.body.description,
          },
          owner: ownerId,
          images: ["url1", "url2"], // Placeholder: You'll need to handle actual image uploads here
          status: 'pending' // Default new vehicles to 'pending' for admin approval
        };

        const newVehicle = await Vehicle.create(vehicleData);
        res.status(201).json({ success: true, vehicle: newVehicle });
      } catch (error) {
        console.error("Vehicle creation API error:", error);
        if (error.name === "ValidationError") {
          const messages = Object.values(error.errors).map((val) => val.message);
          return res.status(400).json({ success: false, message: messages.join(", ") });
        }
        res.status(500).json({
          success: false,
          message: "Server error during vehicle creation.",
        });
      }
      break;

    default:
      res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
      break;
  }
}