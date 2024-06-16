import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './db/db.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from "helmet";
import  user  from './routes/userRoute.js';
import  parks  from './routes/parkings.js';
import problems from './routes/CarProblems.js';
import Order from './routes/Orders.js'
import { rateLimitRequest, distributedRateLimitMiddleware, rateLimitMiddleware } from './middleware/rateLimit.js'
const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('./public'))
// app.use(rateLimitRequest)
// app.use(rateLimitMiddleware);
app.use('/api/user', user)
app.use('/api/parking', parks)
app.use('/api/problem',problems)
app.use('/api/orders',Order)

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}...`))
        await connectDB(process.env.MONGO_URI)
    } catch (err) {
        console.log(err)
    }
}

start()