import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { createServer } from "http";
import { Server, Socket } from "socket.io";
dotenv.config()
import connectDB from './db/db.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from "helmet";
import user from './routes/userRoute.js';
import parks from './routes/parkings.js';
import problems from './routes/CarProblems.js';
import Order from './routes/Orders.js'
import MangeOrder from './routes/manageRepairOrder.js'
import Pro from './routes/Pro.js'
import Admins from './routes/Admin.js'
import admin from 'firebase-admin'
import parking from './modules/parking.js';
import Admin from './modules/Admins.js'
import Statiscs from './routes/Statsics.js'
import { rateLimitRequest,rateLimitMiddleware } from './middleware/rateLimit.js'
import { on } from 'events';
import ParkingOrder from './modules/ParkingOrder.js';
const PORT = process.env.PORT || 3000
const app = express()
const server = createServer(app);
let socketid
let Users = []
let socketObj
const io = new Server(server)

io.sockets.on('connection', (socket) => {
    socket.on("auth", async (data) => {

        addUser(data.username, socket.id)
        console.log(Users);

        const ParkingAdminOrders = await getParkingOrders(data.username)
        //console.log(ParkingAdminOrders);
        // console.log(ParkingAdminOrders);
        if (!ParkingAdminOrders) {
            socket.emit("getall", 'No Park Orders Yet ')
        }
        else {
            socket.emit("getall", ParkingAdminOrders)
        }

    })
})
const getParkingOrders = async (username) => {
    //First we ind the Admin which is connectd
    const admin = await Admin.findOne({ username: username })
    //console.log(adminid);
    //FindAllParkingOrders
    if (!admin) {
        return 'The Admin Is Not found'
    }
    const ParkingAdminOrders = await ParkingOrder.find({})
        .populate('SelectedPark', 'location.parkingName Admin')
        .populate('userId', 'email firstName lastName bookedPark.bookingEndTime')
        .lean().
        sort({ "userId.bookedPark.bookingEndTime": -1 })
    // console.log(ParkingAdminOrders);
    if (!ParkingAdminOrders.length) {
        return 'There are no parking orders yet';
    }

    const ParkingAdminOrdersResult = ParkingAdminOrders
        .map(doc => {
            if (doc.userId?.bookedPark?.bookingEndTime) {
                doc.orderFinishDate = doc.userId.bookedPark.bookingEndTime;

            }
            return doc;
        })
        .filter(order => order.SelectedPark.Admin.toString() === admin._id.toString()).map(doc => {
            delete doc.userId.bookedPark;
            return doc
        });
    if (ParkingAdminOrdersResult.length < 1) {
        return 'No Parking Yet'
    }
    return ParkingAdminOrdersResult
}

function addUser(userName, id) {
    // Check if the user already exists in the list
    const existingUser = Users.find(user => user.user == userName);

    if (existingUser) {
        // User exists, update the ID
        existingUser.id = id;
    } else {
        // User doesn't exist, add a new object
        Users.push({ user: userName, id });
    }
}
export const getUsers = () => {
    return Users
}



export const socketid1 = () => {
    return socketid
}
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
app.use('/api/problem', problems)
app.use('/api/orders', Order)
app.use('/api/Admin', MangeOrder)
app.use('/api/pro', Pro)
app.use('/api/Admins', Admins)
app.use('/api/Statiscs', Statiscs)
server.listen(PORT, async () => {
    console.log(`Server is listening on port: ${PORT}...`)
    try {
        await connectDB(process.env.MONGO_URI)
    } catch (error) {
        console.error("Error connecting to database:", error)
        // Handle the error appropriately (e.g., stop the server)
    }
})

export default io;