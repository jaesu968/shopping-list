// ------------------ Imports ------------------
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser'); // Express 5 includes built-in parsers; using express.json/urlencoded
const { MongoClient, ObjectId, Int32, Double } = require('mongodb');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');

dotenv.config();

// ------------------ Initialize App ------------------
// Configure the Express app, allow cross-origin requests (dev), and
// parse JSON/urlencoded bodies for API endpoints.
const app = express();
app.use(cors());
// Prefer Express built-in body parsers (Express 4.16+ / 5.x)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Input normalization middleware
// - Accepts alternative field names from various clients
// - Coerces string booleans to actual booleans
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    // Normalize alternate field names from clients
    if (req.body.quantity !== undefined && req.body.qty === undefined) {
      req.body.qty = req.body.quantity;
    }
    if (req.body.picked !== undefined && req.body.checked === undefined) {
      req.body.checked = req.body.picked;
    }
    // coerce possible string booleans coming from form posts
    if (typeof req.body.checked === 'string') {
      req.body.checked = req.body.checked === 'true' || req.body.checked === '1';
    }
    if (typeof req.body.picked === 'string') {
      req.body.picked = req.body.picked === 'true' || req.body.picked === '1';
    }
  }
  next();
});

// ------------------ MongoDB Connection ------------------
// Single client for the process with initialization of collections.
// DB name: shopping_app
// Collections/Fields (summary):
//  - lists: { _id, name, createdAt, updatedAt }
//  - items: { _id, listId(ObjectId), name, qty(Int32>=0), checked(bool),
//             notes, brand, category, price(Double), weight(Double),
//             createdAt, updatedAt }
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopping-list';
const client = new MongoClient(uri);

async function initDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('shopping_app');

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
              qty: { bsonType: 'int', minimum: 0 }, // allow 0, disallow negatives
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
      // Relax the existing validator to allow qty >= 0
      try {
        await db.command({
          collMod: 'items',
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['name', 'listId'],
              properties: {
                name: { bsonType: 'string', description: 'required string' },
                listId: { bsonType: 'objectId', description: 'shopping list ID' },
                qty: { bsonType: 'int', minimum: 0 },
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
          },
          validationLevel: 'strict'
        });
        console.log('♻️ Updated "items" validator to allow qty >= 0');
      } catch (e) {
        console.warn('Could not update items validator:', e?.message || e);
      }
    }

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
const validateList = [
  body('name').notEmpty().withMessage('List name is required').isString().withMessage('List name must be a string')
];

const validateItem = [
  body('name')
    .notEmpty()
    .withMessage('Item name cannot be empty')
    .isString()
    .withMessage('Item name must be a string'),
  body('qty')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Item quantity cannot be less than 0'),
  body('checked').optional().isBoolean().withMessage('Checked must be a boolean'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number')
];

// Update validator with all fields optional (so toggle-only updates pass)
const validateItemUpdate = [
  body('name').optional().isString().notEmpty().withMessage('Item name cannot be empty'),
  body('qty').optional().isInt({ min: 0 }).withMessage('Item quantity cannot be less than 0'),
  body('checked').optional().isBoolean().withMessage('checked must be boolean'),
  body('price').optional().isFloat({ min: 0 }).withMessage('price must be a positive number'),
  body('weight').optional().isFloat({ min: 0 }).withMessage('weight must be a positive number'),
  body('brand').optional().isString(),
  body('category').optional().isString(),
  body('notes').optional().isString()
];

const handleValidationErrors = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const list = result.array();
    const message = list[0]?.msg || 'Invalid request';
    // Return a unified error shape for easier client handling
    return res.status(400).json({ success: false, error: message });
  }
  next();
};

const getDB = () => client.db('shopping_app');

// ------------------ Routes ------------------

// Lists
/**
 * Get all shopping lists
 * @route GET /api/lists
 * @returns {object} 200 - { success: true, data: List[] }
 * @returns {object} 500 - { success: false, error: string }
 */
app.get('/api/lists', async (req, res) => {
  try {
    const lists = await getDB().collection('lists').find({}).toArray();
    res.json({ success: true, data: lists });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch lists' });
  }
});

/**
 * Get a single list and its items
 * @route GET /api/lists/:id
 * @param {string} params.id - List ID (Mongo ObjectId)
 * @returns {object} 200 - { success: true, data: ListWithItems }
 * @returns {object} 400 - { success: false, error: "Invalid list ID" }
 * @returns {object} 404 - { success: false, error: "List not found" }
 * @returns {object} 500 - { success: false, error: string }
 */
app.get('/api/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid list ID' });
    }
    const list = await getDB().collection('lists').findOne({ _id: new ObjectId(id) });
    if (!list) {
      return res.status(404).json({ success: false, error: 'List not found' });
    }
    list.items = await getDB().collection('items').find({ listId: new ObjectId(id) }).toArray();
    // mirror checked -> picked for frontend
    list.items = list.items.map(it => ({ ...it, picked: it.checked }));
    res.json({ success: true, data: list });
  } catch (err) {
    console.error('GET /api/lists/:id error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch list' });
  }
});

/**
 * Create a new shopping list
 * @route POST /api/lists
 * @param {object} body - List payload
 * @param {string} body.name - List name (required)
 * @returns {object} 201 - { success: true, data: List }
 * @returns {object} 400 - { success: false, errors: ValidationError[] }
 * @returns {object} 500 - { success: false, error: string }
 */
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

/**
 * Rename a shopping list
 * @route PUT /api/lists/:id
 * @param {string} params.id - List ID (Mongo ObjectId)
 * @param {object} body - Update payload
 * @param {string} body.name - New list name (required)
 * @returns {object} 200 - { success: true, data: List }
 * @returns {object} 400/404/500 - { success: false, error: string }
 */
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

/**
 * Delete a shopping list
 * @route DELETE /api/lists/:listId
 * @param {string} params.listId - List ID (Mongo ObjectId)
 * @returns {object} 200 - { success: true, message: 'List deleted' }
 * @returns {object} 400/404/500 - { success: false, error: string }
 */
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

// Items
/**
 * Get all items in a list
 * @route GET /api/lists/:listId/items
 * @param {string} params.listId - List ID (Mongo ObjectId)
 * @returns {object} 200 - { success: true, data: Item[] }
 * @returns {object} 400/500 - { success: false, error: string }
 */
app.get('/api/lists/:listId/items', async (req, res) => {
  try {
    const { listId } = req.params;
    if (!ObjectId.isValid(listId)) return res.status(400).json({ success: false, error: 'Invalid list id' });
    const items = await getDB().collection('items').find({ listId: new ObjectId(listId) }).toArray();
    const data = items.map(it => ({ ...it, picked: it.checked }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch items' });
  }
});

/**
 * Create a new item in a list
 * @route POST /api/lists/:listId/items
 * @param {string} params.listId - List ID (Mongo ObjectId)
 * @param {object} body - Item payload
 * @param {string} body.name - Item name (required)
 * @param {number} [body.qty=1] - Quantity (>= 0)
 * @param {boolean} [body.checked=false] - Checked state
 * @param {string} [body.notes] - Notes
 * @param {string} [body.brand] - Brand
 * @param {string} [body.category] - Category
 * @param {number} [body.price] - Price (>= 0)
 * @param {number} [body.weight] - Weight (>= 0)
 * @returns {object} 201 - { success: true, data: Item }
 * @returns {object} 400/500 - { success: false, error: string }
 */
app.post('/api/lists/:listId/items', validateItem, handleValidationErrors, async (req, res) => {
  try {
    const db = getDB();
    const { listId } = req.params;
    if (!ObjectId.isValid(listId)) return res.status(400).json({ success: false, error: 'Invalid list id' });

    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ success: false, error: 'Item name cannot be empty' });

    const qtyNum = Math.trunc(Number(req.body.qty ?? 1));
    if (!Number.isFinite(qtyNum) || qtyNum < 0) {
      return res.status(400).json({ success: false, error: 'Item quantity cannot be less than 0' });
    }

    const checked = Boolean(req.body.checked ?? false);
    const price = (req.body.price !== undefined) ? new Double(Number(req.body.price)) : undefined;
    const weight = (req.body.weight !== undefined) ? new Double(Number(req.body.weight)) : undefined;

    const doc = {
      listId: new ObjectId(listId),
      name,
      qty: new Int32(qtyNum),
      checked,
      notes: req.body.notes || '',
      brand: req.body.brand || '',
      category: req.body.category || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    if (price !== undefined) doc.price = price;
    if (weight !== undefined) doc.weight = weight;

    const newItem = await db.collection('items').insertOne(doc);

    res.status(201).json({
      success: true,
      data: { _id: newItem.insertedId, name: doc.name, qty: doc.qty, checked: doc.checked, picked: doc.checked }
    });
  } catch (err) {
    console.error('Create item failed:', err?.errInfo?.details || err);
    // If Mongo schema validation fails, surface a friendly 400 instead of a generic 500.
    const msg = String(err?.message || '');
    const failedValidation = err?.code === 121 || msg.includes('Document failed validation');
    if (failedValidation) {
      return res.status(400).json({ success: false, error: 'Item quantity cannot be less than 0' });
    }
    return res.status(500).json({ success: false, error: 'Failed to create item' });
  }
});

/**
 * Update fields for an item
 * @route PUT /api/lists/:listId/items/:itemId
 * @param {string} params.listId - List ID (Mongo ObjectId)
 * @param {string} params.itemId - Item ID (Mongo ObjectId)
 * @param {object} body - Any subset of updatable fields
 * @param {string} [body.name] - Item name (non-empty if present)
 * @param {number} [body.qty] - Quantity (>= 0)
 * @param {boolean} [body.checked] - Checked state
 * @returns {object} 200 - { success: true, data: Item }
 * @returns {object} 400/404/500 - { success: false, error: string }
 */
app.put('/api/lists/:listId/items/:itemId', validateItemUpdate, handleValidationErrors, async (req, res) => {
  try {
    const db = getDB();
    const { listId, itemId } = req.params;
    if (!ObjectId.isValid(listId) || !ObjectId.isValid(itemId)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    const updatedFields = { updatedAt: new Date() };

    if (req.body.name !== undefined) {
      const nm = String(req.body.name || '').trim();
      if (!nm) return res.status(400).json({ success: false, error: 'Item name cannot be empty' });
      updatedFields.name = nm;
    }

    if (req.body.qty !== undefined) {
      const qn = Math.trunc(Number(req.body.qty));
      if (!Number.isFinite(qn) || qn < 0) {
        return res.status(400).json({ success: false, error: 'Item quantity cannot be less than 0' });
      }
      updatedFields.qty = new Int32(qn);
    }

    if (req.body.checked !== undefined) {
      updatedFields.checked = Boolean(req.body.checked);
    }

    if (req.body.brand !== undefined) updatedFields.brand = req.body.brand;
    if (req.body.category !== undefined) updatedFields.category = req.body.category;
    if (req.body.notes !== undefined) updatedFields.notes = req.body.notes;

    if (req.body.price !== undefined) updatedFields.price = new Double(Number(req.body.price));
    if (req.body.weight !== undefined) updatedFields.weight = new Double(Number(req.body.weight));

    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(itemId), listId: new ObjectId(listId) },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) return res.status(404).json({ success: false, error: 'Item not found' });

    const updatedItem = await db.collection('items').findOne({ _id: new ObjectId(itemId) });
    res.json({ success: true, data: { ...updatedItem, picked: updatedItem?.checked } });
  } catch (err) {
    console.error('Update item failed:', err?.errInfo?.details || err);
    // Map Mongo schema validation errors to a user-friendly 400 like create
    const msg = String(err?.message || '');
    const failedValidation = err?.code === 121 || msg.includes('Document failed validation');
    if (failedValidation) {
      return res.status(400).json({ success: false, error: 'Item quantity cannot be less than 0' });
    }
    res.status(500).json({ success: false, error: 'Failed to update item' });
  }
});

/**
 * Delete an item in a list
 * @route DELETE /api/lists/:listId/items/:itemId
 * @param {string} params.listId - List ID (Mongo ObjectId)
 * @param {string} params.itemId - Item ID (Mongo ObjectId)
 * @returns {object} 200 - { success: true, message: 'Item deleted' }
 * @returns {object} 400/404/500 - { success: false, error: string }
 */
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

// Global error handler to ensure consistent error payloads
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  const status = err.statusCode || 500;
  const msg = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, error: msg });
});

// ------------------ Start Server ------------------
const port = 8000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
