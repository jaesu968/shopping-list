// ------------------ Imports ------------------
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId, Int32, Double } = require('mongodb');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');

dotenv.config();

// ------------------ Initialize App ------------------
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
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
              // qty: { bsonType: 'int', minimum: 1 }, // old rule: disallowed 0
              qty: { bsonType: 'int', minimum: 0 }, // new rule: allow 0, disallow negatives
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
      // Try to relax the existing validator to allow qty >= 0
      try {
        // Previous min 1 rule retained for reference:
        // await db.command({
        //   collMod: 'items',
        //   validator: {
        //     $jsonSchema: {
        //       bsonType: 'object',
        //       required: ['name', 'listId'],
        //       properties: { qty: { bsonType: 'int', minimum: 1 } }
        //     }
        //   }
        // })

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

// const validateItem = [
//   body('name').notEmpty().withMessage('Item name is required').isString().withMessage('Item name must be a string'),
//   body('qty').optional().isInt({ min: 1 }).withMessage('Quantity must be an integer ≥ 1'),
//   body('checked').optional().isBoolean().withMessage('Checked must be a boolean'),
//   body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
//   body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number')
// ];
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

// new: update validator with all fields optional (so toggle-only updates pass)
// const validateItemUpdate = [
//   body('name').optional().isString().notEmpty().withMessage('name cannot be empty'),
//   body('qty').optional().isInt({ min: 1 }).withMessage('qty must be an integer ≥ 1'),
//   body('checked').optional().isBoolean().withMessage('checked must be boolean'),
//   body('price').optional().isFloat({ min: 0 }).withMessage('price must be a positive number'),
//   body('weight').optional().isFloat({ min: 0 }).withMessage('weight must be a positive number'),
//   body('brand').optional().isString(),
//   body('category').optional().isString(),
//   body('notes').optional().isString()
// ];
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

const getDB = () => client.db('shopping_app');

// ------------------ Routes ------------------

// Lists
app.get('/api/lists', async (req, res) => {
  try {
    const lists = await getDB().collection('lists').find({}).toArray();
    res.json({ success: true, data: lists });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch lists' });
  }
});

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
    // mirror checked -> picked for frontend
    list.items = list.items.map(it => ({ ...it, picked: it.checked }));
    res.json({ success: true, data: list });
  } catch (err) {
    console.error('GET /api/lists/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch list' });
  }
});

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

app.post('/api/lists/:listId/items', validateItem, handleValidationErrors, async (req, res) => {
  try {
    const db = getDB();
    const { listId } = req.params;
    if (!ObjectId.isValid(listId)) return res.status(400).json({ success: false, error: 'Invalid list id' });

    const name = String(req.body.name || '').trim();
    // if (!name) return res.status(400).json({ success: false, error: 'name is required' });
    if (!name) return res.status(400).json({ success: false, error: 'Item name cannot be empty' });

    const qtyNum = Math.trunc(Number(req.body.qty ?? 1));
    // if (!Number.isFinite(qtyNum) || qtyNum < 1) {
    //   return res.status(400).json({ success: false, error: 'qty must be an integer ≥ 1' });
    // }
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
    // If Mongo schema validation fails (e.g., existing validator enforces qty >= 1),
    // surface a friendly 400 with our custom message instead of a generic 500.
    const msg = String(err?.message || '');
    const failedValidation = err?.code === 121 || msg.includes('Document failed validation');
    if (failedValidation) {
      return res.status(400).json({ success: false, error: 'Item quantity cannot be less than 0' });
    }
    // res.status(500).json({ success: false, error: err.message || 'Failed to create item' });
    return res.status(500).json({ success: false, error: 'Failed to create item' });
  }
});

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
      if (!nm) return res.status(400).json({ success: false, error: 'name cannot be empty' });
      updatedFields.name = nm;
    }

    if (req.body.qty !== undefined) {
      const qn = Math.trunc(Number(req.body.qty));
      if (!Number.isFinite(qn) || qn < 1) {
        return res.status(400).json({ success: false, error: 'qty must be an integer ≥ 1' });
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
    res.status(500).json({ success: false, error: 'Failed to update item' });
  }
});

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
