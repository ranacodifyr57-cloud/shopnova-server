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
    res.json({ success: true, message: 'Admin created with password: shopnova123' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
module.exports = router