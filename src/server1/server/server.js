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

// intialize The Express App
const app = express(); 

// Envable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB configuration 
const uri = 'mongodb://localhost:27017/shopping-list'; // MongoDB connection string
const client = new MongoClient(uri); // Create a new MongoClient not exact as instructions because of deprecation warning

// Connect to the MongoDB server
client.connect()
    .then(() => console.log('Connected to MongoDB'))
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
 const port = 8000; // desired port number of 8000
 app.listen(port, () => console.log(`Server is listening on port ${port}`));
