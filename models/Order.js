const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerInfo: {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String, required: true },
    city:    { type: String, required: true },
  },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true },
    image:    { type: String },
  }],
  totalAmount:  { type: Number, required: true },
  status:       { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod:{ type: String, default: 'Cash on Delivery' },
  paymentStatus:{ type: String, enum: ['pending', 'paid'], default: 'pending' },
  note:         { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)