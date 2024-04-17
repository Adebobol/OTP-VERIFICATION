const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const router = require('./../src/routes/userRoutes')

dotenv.config({ path: './config.env' })

mongoose.connect("mongodb://127.0.0.1/OTP-VERIFICATION", {

}).then(() => console.log('DB connection successful'))


const port = process.env.PORT || 8000


// Middlewares

const app = express()
app.use(express.json())

// routes
app.use('/api', router)
app.listen(port, () => {
    console.log(`App running on ${port}`)
})