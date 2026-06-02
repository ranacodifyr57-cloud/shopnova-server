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

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected')
    const User = require('./models/User')
    const bcrypt = require('bcryptjs')
    await User.deleteMany({ role: 'admin' })
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
    await User.create({
      name: 'Muhammad Amir',
      email: process.env.ADMIN_EMAIL,
      password: hash,
      role: 'admin'
    })
    console.log('✅ Admin created')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => { console.error('❌ DB Error:', err.message); process.exit(1) })