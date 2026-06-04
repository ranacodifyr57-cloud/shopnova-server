const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' })
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET)
    if (decoded.role !== 'admin')
      return res.status(403).json({ error: 'Admin access only' })
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware