// ------------------ Imports ------------------
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');

dotenv.config();

// ------------------ Initialize App ------------------
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ------------------ MongoDB Connection ------------------
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopping-list';
const client = new MongoClient(uri);

async function initDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('shopping_app');

    // Create 'items' collection if not exists
    const itemsExists = await db.listCollections({ name: 'items' }).toArray();
    if (!itemsExists.length) {
      await db.createCollection('items', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'listId'],
            properties: {
              name: { bsonType: 'string', description: 'required string' },
              listId: { bsonType: 'objectId', description: 'shopping list ID' },
              qty: { bsonType: 'int', minimum: 1 },
              checked: { bsonType: 'bool' },
              notes: { bsonType: 'string' },
              brand: { bsonType: 'string' },
              category: { bsonType: 'string' },
              price: { bsonType: 'double' },
              weight: { bsonType: 'double' },
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

    // Create 'lists' collection if not exists
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
      await db.collection('lists').createIndex({ createdAt: -1 });
      console.log('🆕 Created "lists" with validator + index');
    } else {
      console.log('ℹ️ "lists" collection already exists');
    }
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
}

initDB();

// ------------------ Middleware ------------------

// Validation rules
const validateList = [
  body('name').notEmpty().withMessage('List name is required').isString().withMessage('List name must be a string')
];

const validateItem = [
  body('name').notEmpty().withMessage('Item name is required').isString().withMessage('Item name must be a string'),
  body('qty').optional().isInt({ min: 1 }).withMessage('Quantity must be an integer ≥ 1'),
  body('checked').optional().isBoolean().withMessage('Checked must be a boolean'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number')
];

// Handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

// ------------------ Helper Functions ------------------
const getDB = () => client.db('shopping_app');

// ------------------ Routes ------------------

// ----------- Lists -----------

// Get all lists
app.get('/api/lists', async (req, res) => {
  try {
    const lists = await getDB().collection('lists').find({}).toArray();
    res.json({ success: true, data: lists });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch lists' });
  }
});

// Get a single list by its ID
app.get('/api/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid list ID' });
    }
    const list = await getDB().collection('lists').findOne({ _id: new ObjectId(id) });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    list.items = await getDB().collection('items').find({ listId: new ObjectId(id) }).toArray();
    res.json(list);
  } catch (err) {
    console.error('GET /api/lists/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch list' });
  }
});

// Create a new list
app.post('/api/lists', validateList, handleValidationErrors, async (req, res) => {
  try {
    const db = getDB();
    const newList = await db.collection('lists').insertOne({
      name: req.body.name,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json({ success: true, data: { _id: newList.insertedId, name: req.body.name } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create list' });
  }
});

// Update list
app.put('/api/lists/:id', validateList, handleValidationErrors, async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, error: 'Invalid list id' });

    const result = await db.collection('lists').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: req.body.name, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return res.status(404).json({ success: false, error: 'List not found' });

    const updated = await db.collection('lists').findOne({ _id: new ObjectId(id) });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update list' });
  }
});

// Delete list
app.delete('/api/lists/:listId', async (req, res) => {
  try {
    const { listId } = req.params;
    if (!ObjectId.isValid(listId)) return res.status(400).json({ success: false, error: 'Invalid list id' });

    const result = await getDB().collection('lists').deleteOne({ _id: new ObjectId(listId) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, error: 'List not found' });

    res.json({ success: true, message: 'List deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete list' });
  }
});

// ----------- Items -----------

// Get items in a list
app.get('/api/lists/:listId/items', async (req, res) => {
  try {
    const { listId } = req.params;
    if (!ObjectId.isValid(listId)) return res.status(400).json({ success: false, error: 'Invalid list id' });
    const items = await getDB().collection('items').find({ listId: new ObjectId(listId) }).toArray();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch items' });
  }
});

// Create item
app.post('/api/lists/:listId/items', validateItem, handleValidationErrors, async (req, res) => {
  try {
    const db = getDB();
    const { listId } = req.params;
    if (!ObjectId.isValid(listId)) return res.status(400).json({ success: false, error: 'Invalid list id' });

    const newItem = await db.collection('items').insertOne({
      listId: new ObjectId(listId),
      name: req.body.name,
      qty: req.body.qty || 1,
      checked: req.body.checked || false,
      notes: req.body.notes || '',
      brand: req.body.brand || '',
      category: req.body.category || '',
      price: req.body.price || 0,
      weight: req.body.weight || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json({ success: true, data: { _id: newItem.insertedId, ...req.body } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create item' });
  }
});

// Update item
app.put('/api/lists/:listId/items/:itemId', validateItem, handleValidationErrors, async (req, res) => {
  try {
    const db = getDB();
    const { listId, itemId } = req.params;
    if (!ObjectId.isValid(listId) || !ObjectId.isValid(itemId)) return res.status(400).json({ success: false, error: 'Invalid ID' });

    const { name, qty, checked, brand, category, price, weight, notes } = req.body;
    const updatedFields = { updatedAt: new Date() };
    if (name) updatedFields.name = name;
    if (qty) updatedFields.qty = qty;
    if (typeof checked === 'boolean') updatedFields.checked = checked;
    if (brand) updatedFields.brand = brand;
    if (category) updatedFields.category = category;
    if (price) updatedFields.price = price;
    if (weight) updatedFields.weight = weight;
    if (notes) updatedFields.notes = notes;

    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(itemId), listId: new ObjectId(listId) },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) return res.status(404).json({ success: false, error: 'Item not found' });

    const updatedItem = await db.collection('items').findOne({ _id: new ObjectId(itemId) });
    res.json({ success: true, data: updatedItem });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update item' });
  }
});

// Delete item
app.delete('/api/lists/:listId/items/:itemId', async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    if (!ObjectId.isValid(listId) || !ObjectId.isValid(itemId)) return res.status(400).json({ success: false, error: 'Invalid ID' });

    const result = await getDB().collection('items').deleteOne({ _id: new ObjectId(itemId), listId: new ObjectId(listId) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, error: 'Item not found' });

    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete item' });
  }
});

// ------------------ Start Server ------------------
const port = 8000;
app.listen(port, () => console.log(`Server listening on port ${port}`));