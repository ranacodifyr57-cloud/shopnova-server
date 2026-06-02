const router = require('express').Router()
const Product = require('../models/Product')
const authMiddleware = require('../middleware/auth')

// GET /api/products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, featured } = req.query
    let query = {}
    if (category) query.category = category
    if (featured) query.featured = true
    if (search) query.name = { $regex: search, $options: 'i' }
    let sortObj = { createdAt: -1 }
    if (sort === 'price_low') sortObj = { price: 1 }
    if (sort === 'price_high') sortObj = { price: -1 }
    if (sort === 'popular') sortObj = { sold: -1 }
    const products = await Product.find(query).sort(sortObj)
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/products/:id (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/products (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/products/:id (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/products/:id (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router