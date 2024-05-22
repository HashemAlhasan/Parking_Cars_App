import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './db/db.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from "helmet";
import user from './routes/userRoute.js'
import { rateLimitRequest, distributedRateLimitMiddleware } from './middleware/rateLimit.js'
const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(rateLimitRequest)
app.use(distributedRateLimitMiddleware);
app.use('/api/user', user)

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}...`))
        await connectDB(process.env.MONGO_URI)
    } catch (err) {
        console.log(err)
    }
}

start()