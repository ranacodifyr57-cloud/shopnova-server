// ShopNova API v1.1
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  validate: { xForwardedForHeader: false }
})
app.use('/api/', limiter)

app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/categories', require('./routes/categories'))

app.get('/api/health', (req, res) => res.json({ status: 'OK', service: 'ShopNova API' }))

// Connect to MongoDB
let isConnected = false

const connectDB = async () => {
  if (isConnected) return
  await mongoose.connect(process.env.MONGODB_URI)
  isConnected = true
  console.log('✅ MongoDB connected')
}

// Middleware to connect DB on each request
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' })
  }
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
  })
}

module.exports = app