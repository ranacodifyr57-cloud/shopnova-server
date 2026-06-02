const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  oldPrice:    { type: Number },
  category:    { type: String, required: true },
  images:      [{ type: String }],
  stock:       { type: Number, default: 0 },
  sold:        { type: Number, default: 0 },
  rating:      { type: Number, default: 0 },
  reviews:     { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
  tags:        [{ type: String }],
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)