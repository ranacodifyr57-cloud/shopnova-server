const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/categories', require('./routes/categories'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', service: 'ShopNova API' }))

// Connect DB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => {
    console.error('❌ DB Error:', err.message)
    process.exit(1)
  })

module.exports = app