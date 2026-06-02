const router = require('express').Router()
const Category = require('../models/Category')
const authMiddleware = require('../middleware/auth')

// GET /api/categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/categories (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/categories/:id (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router