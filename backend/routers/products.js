const { Product } = require('../models/product')
const express = require('express')
const { Category } = require('../models/category')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads')
	},
	filename: function (req, file, cb) {
		const fileName = file.originalname.split(' ').join('-')
		cb(null, `${fileName}-${Date.now()}.${extension}`)
	},
})
const uploadOptions = multer({ storage: storage })

// ===================== All Products =====================
// http://localhost:3000/api/v1/products
router.get(`/`, async (req, res) => {
	let filter = {}
	if (req.query.categories) {
		filter = { category: req.query.categories.split(',') }
	}
	const productList = await Product.find(filter).populate('category')
	if (!productList) res.status(500).json({ success: false })
	res.send(productList)
})
// ===================== /All Products =====================

// ===================== Show Products =====================
// http://localhost:3000/api/v1/products
router.get(`/:id`, async (req, res) => {
	const product = await Product.findById(req.params.id)
	if (!product) res.status(500).json({ success: false })
	res.send(product)
})
// ===================== /Show Products =====================

// ===================== Store Products =====================
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
	const category = await Category.findById(req.body.category)
	if (!category) return res.status(400).send('Invalid Category')
	const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
	const fileName = req.file.filename

	let product = new Product({
		name: req.body.name,
		description: req.body.description,
		richDescription: req.body.richDescription,
		image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
		brand: req.body.brand,
		price: req.body.price,
		category: req.body.category,
		countInStock: req.body.countInStock,
		rating: req.body.rating,
		numReviews: req.body.numReviews,
		isFeatured: req.body.isFeatured,
	})
	product = await product.save()
	if (!product) return res.status(500).send('The product cannot be created')
	res.send(product)
})
// ===================== /Store Products =====================

// ==================== Update Product ====================
router.put('/:id', async (req, res) => {
	if (!mongoose.isValidObjectId(req.params.id)) {
		res.status(400).send('Invalid Product Id')
	}
	const category = await Category.findById(req.body.category)
	if (!category) return res.status(400).send('Invalid Category')

	const product = await Product.findByIdAndUpdate(
		req.params.id,
		{
			name: req.body.name,
			description: req.body.description,
			richDescription: req.body.richDescription,
			image: req.body.image,
			brand: req.body.brand,
			price: req.body.price,
			category: req.body.category,
			countInStock: req.body.countInStock,
			rating: req.body.rating,
			numReviews: req.body.numReviews,
			isFeatured: req.body.isFeatured,
		},
		{ new: true }
	)
	if (!product) return res.status(500).send('the product cannot be updated')
	res.send(product)
})
// ==================== /Update Product ====================

// ==================== Delete Product ====================
// api/v1/:id
router.delete('/:id', (req, res) => {
	Product.findByIdAndRemove(req.params.id)
		.then((product) => {
			if (product) {
				return res
					.status(200)
					.json({ success: true, message: 'the product is deleted!' })
			} else {
				return res
					.status(404)
					.json({ success: false, message: 'product not found!' })
			}
		})
		.catch((err) => {
			return res.status(400).json({ success: false, error: err })
		})
})
// ==================== /Delete Product ====================

// ==================== Get Count Product ====================
router.get(`/get/count`, async (req, res) => {
	const productCount = await Product.countDocuments()

	if (!productCount) {
		res.status(500).json({ success: false })
	}
	res.send({
		productCount: productCount,
	})
})
// ==================== /Get Count Product ====================

// ==================== Get Featured Product ====================
router.get(`/get/featured/:count`, async (req, res) => {
	const count = req.params.count || 0
	const products = await Product.find({ isFeatured: true }).limit(+count)

	if (!products) {
		res.status(500).json({ success: false })
	}
	res.send({
		products: products,
	})
})
// ==================== /Get Featured Product ====================

module.exports = router
