require('dotenv').config();
const { MongoClient } = require('mongodb');

async function init() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  
  const db = client.db(process.env.NEXT_PUBLIC_MONGODB_DB);
  
  await db.createCollection('cars', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['make', 'model', 'year', 'price'],
        properties: {
          make: { bsonType: 'string' },
          model: { bsonType: 'string' },
          year: { bsonType: 'int', minimum: 1900 },
          price: { bsonType: 'decimal' },
          status: { 
            bsonType: 'string',
            enum: ['available', 'sold', 'reserved']
          }
        }
      }
    }
  });
  
  console.log('Database initialized successfully');
  await client.close();
}

init().catch(console.error);