const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config') // npm install dotenv (for .env)
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')

// npm install cors
app.use(cors())
app.options('*', cors())

// Middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt())
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(errorHandler)

// =========== Routes ===========
const categoriesRoutes = require('./routers/categories')
const productsRoutes = require('./routers/products')
const usersRoutes = require('./routers/users')
const ordersRoutes = require('./routers/orders')

const api = process.env.API_URL

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)
// =========== ./Routes ===========

// Database
mongoose
	.connect(process.env.CONNECTION_STRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: process.env.DB_NAME,
	})
	.then(() => {
		console.log('Database connection is ready...')
	})
	.catch((err) => {
		console.log(err)
	})

const PORT = process.env.PORT || 3000
//Server
app.listen(3000, () => {
	console.log('server is running http://localhost:3000')
})
