const { User } = require('../models/user')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

router.get(`/`, async (req, res) => {
	const userList = await User.find()

	if (!userList) {
		res.status(500).json({ success: false })
	}
	res.send(userList)
})

// ==================== Store Category ====================
router.post('/', async (req, res) => {
	let user = new User({
		name: req.body.name,
		email: req.body.email,
		passwordHash: bcrypt.hashSync(req.body.password, 10),
		phone: req.body.phone,
		isAdmin: req.body.isAdmin,
		street: req.body.street,
		apartement: req.body.apartement,
		zip: req.body.zip,
		city: req.body.city,
		country: req.body.country,
		color: req.body.color,
	})

	user = await user.save()

	if (!user) return res.status(404).send('the user cannot be created')

	res.send(user)
})
// ==================== /Store Category ====================

module.exports = router
