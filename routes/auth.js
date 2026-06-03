const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) return res.status(400).json({ error: 'Email already exists' })
    const hash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, password: hash, phone })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/auth/setup
router.get('/setup', async (req, res) => {
  try {
    await User.deleteMany({})
    const hash = await bcrypt.hash('shopnova123', 12)
    await User.create({
      name: 'Muhammad Amir',
      email: 'rana.codifyr57@gmail.com',
      password: hash,
      role: 'admin'
    })
    res.json({ success: true, message: 'Admin created!' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router