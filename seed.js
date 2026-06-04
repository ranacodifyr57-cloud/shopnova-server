// seed.js — Adds a full set of starter products to your ShopNova store.
// Run ONCE from inside your "server" folder:  node seed.js
//
// It connects to the SAME database your live site uses (from .env MONGODB_URI),
// so the products will appear on your live website immediately.
// It does NOT delete your orders or your admin user. It only adds products.

require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('./models/Product')

// Image helper: keyword-matched placeholder photos. Replace any image URL
// later with your own real product photos for a more professional look.
const img = (keyword, lock) => `https://loremflickr.com/600/600/${keyword}?lock=${lock}`

const products = [
  // ---------- Electronics ----------
  { name: 'Wireless Bluetooth Earbuds', description: 'Crystal clear sound with deep bass, noise isolation, and up to 24 hours battery with the charging case. Perfect for calls, music and workouts.', price: 2499, oldPrice: 3999, category: 'Electronics', stock: 60, featured: true, images: [img('earbuds', 11)] },
  { name: '20000mAh Power Bank', description: 'Fast-charging power bank with dual USB ports and LED indicator. Charges your phone 4-5 times on a single charge.', price: 3299, oldPrice: 4500, category: 'Electronics', stock: 45, featured: true, images: [img('powerbank', 12)] },
  { name: 'Portable Bluetooth Speaker', description: 'Compact wireless speaker with rich 360° sound, waterproof body, and 12-hour playtime. Great for home and outdoor use.', price: 3999, oldPrice: 5500, category: 'Electronics', stock: 30, images: [img('speaker', 13)] },
  { name: 'Smart Fitness Watch', description: 'Track steps, heart rate, sleep and notifications. Water-resistant with a bright touch display and 7-day battery.', price: 4999, oldPrice: 7999, category: 'Electronics', stock: 40, featured: true, images: [img('smartwatch', 14)] },
  { name: 'Fast Charging USB-C Cable', description: 'Durable braided 1.5m USB-C cable supporting fast charge and data transfer. Tangle-free and long lasting.', price: 599, oldPrice: 999, category: 'Electronics', stock: 120, images: [img('cable', 15)] },
  { name: 'LED Desk Lamp', description: 'Adjustable LED desk lamp with 3 brightness levels and touch control. Eye-caring light, ideal for study and work.', price: 1899, oldPrice: 2800, category: 'Electronics', stock: 50, images: [img('lamp', 16)] },

  // ---------- Clothing ----------
  { name: "Men's Cotton T-Shirt", description: 'Soft 100% cotton round-neck t-shirt. Breathable, comfortable everyday wear. Available in classic colours.', price: 899, oldPrice: 1499, category: 'Clothing', stock: 100, featured: true, images: [img('tshirt', 21)] },
  { name: "Women's Lawn Kurta", description: 'Elegant printed lawn kurta, lightweight and perfect for summer. Premium stitched fabric with a modern cut.', price: 1799, oldPrice: 2999, category: 'Clothing', stock: 70, featured: true, images: [img('kurta', 22)] },
  { name: 'Unisex Hoodie', description: 'Cozy fleece-lined hoodie with front pocket and adjustable drawstring. Keeps you warm and stylish.', price: 2299, oldPrice: 3499, category: 'Clothing', stock: 55, images: [img('hoodie', 23)] },
  { name: "Men's Slim Fit Jeans", description: 'Stretchable slim-fit denim jeans with a comfortable waist. Durable stitching and a clean modern look.', price: 2499, oldPrice: 3999, category: 'Clothing', stock: 60, images: [img('jeans', 24)] },
  { name: 'Casual Sneakers', description: 'Lightweight everyday sneakers with cushioned sole and breathable upper. Comfortable for all-day wear.', price: 3299, oldPrice: 4999, category: 'Clothing', stock: 40, featured: true, images: [img('sneakers', 25)] },

  // ---------- Home & Living ----------
  { name: 'Non-Stick Cookware Set (5 pcs)', description: 'Durable non-stick cookware set with heat-resistant handles. Even cooking with easy cleanup. Kitchen essential.', price: 4999, oldPrice: 7500, category: 'Home & Living', stock: 25, featured: true, images: [img('cookware', 31)] },
  { name: 'Cotton Bed Sheet Set', description: 'Soft cotton double bed sheet with 2 pillow covers. Breathable, durable and machine washable.', price: 2799, oldPrice: 3999, category: 'Home & Living', stock: 50, images: [img('bedsheet', 32)] },
  { name: 'Modern Wall Clock', description: 'Silent sweep wall clock with a minimalist design. Adds a stylish touch to any room.', price: 1499, oldPrice: 2200, category: 'Home & Living', stock: 65, images: [img('clock', 33)] },
  { name: 'Storage Organizer Boxes (Set of 3)', description: 'Foldable fabric storage boxes for clothes, toys and accessories. Keeps your space neat and tidy.', price: 1299, oldPrice: 1999, category: 'Home & Living', stock: 80, images: [img('storage', 34)] },

  // ---------- Beauty ----------
  { name: 'Gentle Face Wash', description: 'Daily face wash that deeply cleanses and refreshes without drying. Suitable for all skin types.', price: 799, oldPrice: 1299, category: 'Beauty', stock: 90, featured: true, images: [img('facewash', 41)] },
  { name: 'Matte Lipstick Set (4 shades)', description: 'Long-lasting matte lipsticks in 4 beautiful everyday shades. Smooth application, non-drying formula.', price: 1599, oldPrice: 2499, category: 'Beauty', stock: 70, images: [img('lipstick', 42)] },
  { name: 'Long-Lasting Perfume', description: 'Fresh, elegant fragrance that lasts all day. Perfect for daily wear and special occasions.', price: 2299, oldPrice: 3500, category: 'Beauty', stock: 45, featured: true, images: [img('perfume', 43)] },
  { name: 'Professional Hair Dryer', description: 'Powerful hair dryer with hot and cool settings for fast, frizz-free drying. Lightweight and easy to use.', price: 2999, oldPrice: 4500, category: 'Beauty', stock: 35, images: [img('hairdryer', 44)] },

  // ---------- Sports ----------
  { name: 'Anti-Slip Yoga Mat', description: 'Thick, cushioned yoga mat with a non-slip surface. Comfortable for yoga, workouts and stretching.', price: 1799, oldPrice: 2800, category: 'Sports', stock: 50, images: [img('yoga', 51)] },
  { name: 'Adjustable Dumbbell Set', description: 'Home workout dumbbell set with adjustable weights. Build strength without going to the gym.', price: 4499, oldPrice: 6500, category: 'Sports', stock: 20, featured: true, images: [img('dumbbell', 52)] },
]

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI not found. Make sure you run this from the "server" folder where .env is.')
      process.exit(1)
    }
    console.log('Connecting to database...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected ✅')

    const before = await Product.countDocuments()
    const inserted = await Product.insertMany(products)
    const after = await Product.countDocuments()

    console.log(`\n🎉 Added ${inserted.length} products!`)
    console.log(`   Products before: ${before}`)
    console.log(`   Products now:    ${after}`)
    console.log('\nOpen your live site to see them. (If you run this again it will add duplicates.)')
  } catch (err) {
    console.log('❌ Error:', err.message)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

seed()