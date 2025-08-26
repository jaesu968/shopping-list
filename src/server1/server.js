

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

// Enable Cross-Origin Resource Sharing (CORS)
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
            required: ['name', 'listId'],
            properties: {
              name: { bsonType: 'string', description: 'required string' },
              // this ensures that every item belongs to a specific shopping list and has a valid ObjectId
              listId: { bsonType: 'objectId', description: 'shopping list ID'}, 
              qty: { bsonType: 'int', minimum: 1, description: 'int ≥ 1' },
              checked: { bsonType: 'bool', description: 'boolean flag' },
              notes: { bsonType: 'string', description: 'optional notes' },
              brand: { bsonType: 'string', description: 'optional brand' },
              category: { bsonType: 'string', description: 'optional category' },
              price: { bsonType: 'double', description: 'optional price' },
              weight: { bsonType: 'double', description: 'optional weight' },
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
    // Create lists collection with JSON schema validator
    const listExists = await db.listCollections({ name: 'lists' }).toArray();
    if (!listExists.length) {
      await db.createCollection('lists', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name'],
            properties: {
              name: { bsonType: 'string', description: 'list name' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      await db.collection('lists').createIndex({ createdAt: -1 }); // index for sorting by creation date
      console.log('🆕 Created "lists" with validator + index');
    } else {
      console.log('ℹ️ "lists" collection already exists');
    }
  })
  .catch(err => console.error(err));

 // Define the routes and API end points here
 // Example: app.get('/api/items' , async (req, res) => { ... });

 // Get All Lists from the database
 app.get('/api/lists', async (req, res) => {
    // insert logic here to fetch lists from the database
    const db = client.db('shopping_app'); // establish the database connection
    const lists = db.collection('lists'); // get the lists collection
    // Fetch all lists from the collection
    const allLists = await lists.find({}).toArray();
    // Send the lists as a JSON response
    res.json(allLists);
 }); 

 // Get a single list by its ID
 app.get('/api/lists/:id', async (req, res) => {
  try {
    const db = client.db('shopping_app'); // establish the database connection
    const { id } = req.params; // get the list ID from the URL

    if (!ObjectId.isValid(id)) { // validate the ID
      return res.status(400).json({ error: 'Invalid list ID' });
    }
    // fetch the list from the database
    const list = await db.collection('lists').findOne({ _id: new ObjectId(id) });
    // if no list found, return 404
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    // also fetch the items for that list
    list.items = await db.collection('items').find({ listId: new ObjectId(id) }).toArray();

    res.json(list);
  } catch (err) {
    console.error('GET /api/lists/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch list' });
  }
});


 // Get all items from the database
app.get('/api/lists/:listId/items', async (req, res) => {
    // insert logic here to fetch items from the database
    const db = client.db('shopping_app'); // establish the database connection
    const items = db.collection('items'); // get the items collection
    // Fetch all items from the collection
    // Filter items by listId to get items for a specific shopping list
    // this uses req.params.listId to get the listId from the URL
    // and convert it to an ObjectId for MongoDB query
    const allItems = await items.find({ listId: new ObjectId(req.params.listId) }).toArray();
    // Send the items as a JSON response
    res.json(allItems);
 }); 

 // create a new shopping list in the database
app.post('/api/lists', async (req, res) => {
    // insert logic here to create a new shopping list in the database
    const db = client.db('shopping_app'); // establish the database connection
    const lists = db.collection('lists'); // get the lists collection
    const newList = await lists.insertOne({ // insert one new list
        name: req.body.name,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    // Send the created list as a JSON response
    res.status(201).json({ _id: newList.insertedId, name: req.body.name, createdAt: new Date(), updatedAt: new Date() }); // Return the newly created list
});

 // create a new item in the database (add an item to a specific list) 
app.post('/api/lists/:listId/items', async (req, res) => {
        // insert logic here to create a new item in the database
        const db = client.db('shopping_app'); // establish the database connection
        const items = db.collection('items'); // get the items collection
        const newItem = await items.insertOne({
            listId: new ObjectId(req.params.listId), // use the listId from the URL
            name: req.body.name,
            qty: req.body.qty || 1, // default to 1 if not provided
            checked: req.body.checked || false, // default to false if not provided
            notes: req.body.notes || '',
            brand: req.body.brand || '',
            category: req.body.category || '',
            price: req.body.price || 0,
            weight: req.body.weight || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Send the created item as a JSON response
        res.status(201).json({ 
          _id: newItem.insertedId, 
          listId: new ObjectId(req.params.listId), 
          name: req.body.name, qty: req.body.qty || 1,
          checked: req.body.checked || false, 
          notes: req.body.notes || '',
          brand: req.body.brand || '',
          category: req.body.category || '',
          price: req.body.price || 0,
          weight: req.body.weight || 0, 
          createdAt: new Date(),
          updatedAt: new Date() 
        }); // Return the newly created item
});
// Update an existing list in the database
// make sure to use the correct path and method (api/lists/:id with PUT)
app.put('/api/lists/:id', async (req, res) => {
  try {
    const db = client.db('shopping_app');             
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid list id' });
    }

    const result = await db.collection('lists').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: req.body.name, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'List not found' });
    }

    const updated = await db.collection('lists').findOne({ _id: new ObjectId(id) });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/lists/:id error:', err);
    res.status(500).json({ error: 'Failed to update list' });
  }
});

// DELETE a shopping list
// make sure to use the correct path and method (api/lists/:id with DELETE)
app.delete('/api/lists/:listId', async (req, res) => {
  try {
    const db = client.db('shopping_app');        
    const { listId } = req.params;

    if (!ObjectId.isValid(listId)) {
      return res.status(400).json({ error: 'Invalid list id' });
    }

    const result = await db.collection('lists').deleteOne({ _id: new ObjectId(listId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'List not found' });
    }
    res.json({ message: 'List deleted' });
  } catch (err) {
    console.error('DELETE /api/lists/:listId error:', err);
    res.status(500).json({ error: 'Failed to delete list' });
  }
});
// DELETE a specific item from a shopping list
// make sure to use the correct path and method (api/lists/:listId/items/:itemId with DELETE)
app.delete('/api/lists/:listId/items/:itemId', async (req, res) => {
  try {
    const db = client.db('shopping_app'); // establish the database connection
    const { listId, itemId } = req.params; // get listId and itemId from the URL
    // validate the IDs
    if (!ObjectId.isValid(listId) || !ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    // delete the item from the database
    const result = await db.collection('items').deleteOne({ _id: new ObjectId(itemId), listId: new ObjectId(listId) });
    // check if the item was found and deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('DELETE /api/lists/:listId/items/:itemId error:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Update an item in a shopping list
// make sure to use the correct path and method (api/lists/:listId/items/:itemId with PUT)
// this is updating a specific item in a specific list
app.put('/api/lists/:listId/items/:itemId', async (req, res) => {
  try {
    const db = client.db('shopping_app'); // establish the database connection
    const { listId, itemId } = req.params; // get listId and itemId from the URL
    // validate the IDs
    if (!ObjectId.isValid(listId) || !ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    // extract fields to update from the request body
    const { name, qty, checked, brand, category, price, weight, notes } = req.body;
    const updatedFields = { updatedAt: new Date() };
    // only include fields that are provided in the request
    if (name) updatedFields.name = name;
    if (qty) updatedFields.qty = qty;
    if (typeof checked === 'boolean') updatedFields.checked = checked;
    if (brand) updatedFields.brand = brand;
    if (category) updatedFields.category = category;
    if (price) updatedFields.price = price;
    if (weight) updatedFields.weight = weight;
    if (notes) updatedFields.notes = notes;

    // update the item in the database
    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(itemId), listId: new ObjectId(listId) },
      { $set: updatedFields }
    );
    // check if the item was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    // fetch and return the updated item
    const updatedItem = await db.collection('items').findOne({ _id: new ObjectId(itemId) });
    res.json(updatedItem);
  } catch (err) {
    console.error('PUT /api/lists/:listId/items/:itemId error:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});
 
 // Start the server
 const port = 8000; // desired port number of 3000
 app.listen(port, () => console.log(`Server is listening on port ${port}`));
