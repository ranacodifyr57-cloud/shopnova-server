const router = require('express').Router()
const Order = require('../models/Order')
const authMiddleware = require('../middleware/auth')

// POST /api/orders (public - place order)
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body)
    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET /api/orders (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('items.product')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product')
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/orders/:id/status (admin only)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/orders/:id (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router