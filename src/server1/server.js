

// import the express module 
const express = require('express'); 
// import the cors package to enable Cross-Origin Resource Sharing
const cors = require('cors');
// import the body-parser middleware to parse incoming request bodies
const bodyParser = require('body-parser'); 
// import the database connection module
const MongoClient = require('mongodb').MongoClient;
// import the ObjectId type from MongoDB
const { ObjectId } = require('mongodb'); 
//Import dontev package and configure enviornment variables from .env/.env.local 
const dotenv = require('dotenv');
dotenv.config()

// intialize The Express App
const app = express(); 

// Envable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB configuration 
// Prefer Atlas if MONGO_URI is set, otherwise fallback to local
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopping-list';
const client = new MongoClient(uri);

// Connect to the MongoDB server & set up schema collection
client.connect()
  .then(async () => {
    console.log('Connected to MongoDB');

    // Select database + collection
    const db = client.db('shopping_app');     // database name
    const items = db.collection('items');     // collection handle

    // Ensures items collection exists with JSON schema validator
    const exists = await db.listCollections({ name: 'items' }).toArray();
    if (!exists.length) {
      await db.createCollection('items', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name'],
            properties: {
              name: { bsonType: 'string', description: 'required string' },
              qty: { bsonType: 'int', minimum: 1, description: 'int ≥ 1' },
              checked: { bsonType: 'bool', description: 'boolean flag' },
              notes: { bsonType: 'string', description: 'optional notes' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      await db.collection('items').createIndex({ createdAt: -1 });
      console.log('🆕 Created "items" with validator + index');
    } else {
      console.log('ℹ️ "items" collection already exists');
    }
  })
  .catch(err => console.error(err));

 // Define the routes and API end points here
 // Example: app.get('/api/items' , async (req, res) => { ... });

 // Get all items from the database
 app.get('/api/items', async (req, res) => {
    // insert logic here to fetch items from the database
 }); 

 // crate a new item in the database
    app.post('/api/items', async (req, res) => {
        // insert logic here to create a new item in the database
});
// Update an existing item in the database
app.put('/api/items/:id', async (req, res) => {
    // insert logic here to update an existing item in the database
}); 
// Delete an item from the database
app.delete('/api/items/:id', async (req, res) => {
    // insert logic here to delete an item from the database
});  
 
 // Start the server
 const port = 3000; // desired port number of 3000
 app.listen(port, () => console.log(`Server is listening on port ${port}`));
