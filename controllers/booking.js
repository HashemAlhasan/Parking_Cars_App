
import { StatusCodes } from "http-status-codes";
import Parking from "../modules/parking.js";
import User from "../modules/users.js";
import Cars from "../modules/cars.js"
import CarProblem from '../modules/CarProblems.js'
import ParkingOrder from "../modules/ParkingOrder.js";
//import * as service from '../fir-e8b4f-firebase-adminsdk-7jn1h-1d173a25b7.json' with {type}
//const s=JSON.parse(service)
import Admin from '../modules/Admins.js'

import io from "../app.js";
import RepairOrder from "../modules/RepairOrder.js";
import { getUsers } from '../app.js'




export const bookingPark = async (req, res) => {
    try {
        const { duration, Spot, date } = req.body;
        const username = req.user
        const parkingName = req.body.parkingName;
        if (!username || !duration || !Spot || !date) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "All inputs are Required" })
        }
        const now = new Date()
        /// create a new date object and set time t0 00:00:00
        let ParkingStartingDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        // convert the time coming from request to 24 hour format
        const newDate = convertTo24HourFormat(date)
        // get the hour and minutes
        let [hour, minute] = newDate.split(':')
        //heres the catch when you set the hours to 00 it takes the local timeZone GMT-3 hours 
        // so to put the hours in correct format we add three hours 
        hour = Number(hour) + 3
        // set The Bookine End Time where it is The starting date added to it the duration

        const BookineEndTime = ParkingStartingDate.setHours(hour + duration, minute)


        const parkChoosed = await Parking.findOne({ "location.parkingName": parkingName }).populate('Admin')
        if (!parkChoosed) {
            return res.status(400).json({ message: 'Parking not found' });
        }
        const user = await User.findOne({ username }).populate('car');
        //console.log(user);
        if (!user) {
            return res.status(StatusCodes.BAD_GATEWAY).json({ message: "user  is not valid pleas check the user name" })
        }
        // console.log(user.car);
        const carNumber = user.car.carNumber

        const emptyPark = parkChoosed.park.find(object => object.parkNumber === Spot)
        if (!emptyPark) {
            return res.status(400).json({ message: 'No empty parks available' });
        }

        emptyPark.filled = true;
        emptyPark.carNumber = carNumber;
        emptyPark.bookingEndTime = BookineEndTime;
        emptyPark.duration = duration;
        await emptyPark.save()
        await parkChoosed.save();
        // console.log(parkChoosed.parkingName);
        user.bookedPark = {
            parkNumber: emptyPark.parkNumber,
            bookingEndTime: emptyPark.bookingEndTime,
            ChoosedParkName: parkingName
        };

        let paymentAmount = duration * parkChoosed.location.Price;
        // Discount for Pro User
        if (user.pro) {
            paymentAmount *= 0.75;
        }
        user.paymentAmount += paymentAmount;
        await user.save();
        const ParkOrder = await ParkingOrder.create({
            userId: user._id,
            SelectedPark: parkChoosed._id,
            duration: duration,
            Price: user.paymentAmount

        })
        await ParkOrder.populate('userId', 'email firstName lastName')
        await ParkOrder.populate('SelectedPark', 'location.parkingName')
        // populate('userId', 'email firstName lastName').populate('SelectedPark', 'location.Price location.parkingName')
        //
        // if (bookedParkAdmin && bookedParkAdmin.socketId) {
        //     io.to(bookedParkAdmin.socketId).emit('newBooking', userBookingData);
        // } else {
        //     console.warn(`Admin for park ${parkingName} has no socket ID`);
        //     // Handle the case where admin's socket ID is unavailable (optional)
        // // }
        //     io.to(socketid1()).emit('hi',user,()=>{
        //         console.log("sent sucessfuly");
        //     })
        let u = getUsers()
        console.log(u);

        const Adminname = parkChoosed.Admin.username
        let socketId = u.find(user => user.user == Adminname)
        io.to(socketId.id).emit('add', ParkOrder)

        return res.status(200).json({
            parkNumber: emptyPark.parkNumber,
            carNumber: emptyPark.carNumber,
            bookingEndTime: emptyPark.bookingEndTime,
            parksNum: user.bookedPark.parkNumber,
            parkingName: parkingName,
            duration: emptyPark.duration,
            Price: paymentAmount

        });
    } catch (error) {
        console.error('Error booking parking:', error.message);
        return res.status(500).json({ message: 'Booking failed' });
    }
};


export const bookingRepairPark = async (req, res) => {
    try {
        // const userName = req.params.username
        const { parkNumber, Problem } = req.body
        const username = req.user



        if (!userName) {
            return res.status(400).json({ message: 'UserName not found' });

        }
        if (!parkNumber) {
            return res.status(400).json({ message: 'Park number not found' });

        }

        console.log();
        const user = await User.findOne({ username: userName }).populate({
            path: 'car',
            model: 'Cars',

        })
        if (!user) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "User Name Not Found " })
        }
        const car = await Cars.findOne({ onerId: user._id })
        const ProblemInfo = await CarProblem.findOne({ Name: Problem })
        console.log(ProblemInfo);
        if (!car) {
            return res.status(StatusCodes.BAD_REQUEST).json({ messasge: "Could'nt Find Car For Specfic Users" })
        }
        if (!ProblemInfo) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please Provide A vaild Problem" })
        }

        if (ProblemInfo.ProblemType == 'Mechanical') {
            car.carProblems.Mechanic.push(Problem)



        }
        if (ProblemInfo.ProblemType == 'Electric') {
            car.carProblems.Electric.push(Problem)

        }
        await car.save()


        // جيب معلومات السيارة هون



        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const userCar = user.car


        const selectedPark = await Parking.findOne({ "location.parkingNumber": parkNumber })
        if (!selectedPark) {
            return res.status(StatusCodes.BAD_REQUEST).json({ messgae: "park not found " })
        }
        const emptyPark = selectedPark.carRepairPlaces.find(park => !park.filled)
        if (!emptyPark) {
            return res.status(400).json({ message: 'No empty parks available' });
        }
        // console.log(user);
        emptyPark.filled = true
        emptyPark.carNumber = user.car.carNumber //تاكد من الشغل هون بالحرف
        await emptyPark.save()
        const Order = await RepairOrder.create({
            userId: user._id,
            carProblem: ProblemInfo._id,
            SelectedPark: selectedPark._id,
            orderPrice: ProblemInfo.Price

        })
        if (!Order) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Order Didn't Created" })
        }

        return res.status(200).json({ Location: selectedPark.location.parkingName, Problem: Problem, EstimatedTime: ProblemInfo.duration, Price: ProblemInfo.Price, image: ProblemInfo.image })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
}



export const addParking = async (req, res) => {
    try {
        const { parkingNumber, parkingName, location, park, carRepairPlaces, Price, AdminEmail } = req.body;
        const AdminId = await Admin.findOne({ email: AdminEmail })
        if (!AdminId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "admin Not Found" })
        }
        console.log(AdminId);
        const newParking = await Parking.create({
            Admin: AdminId._id,
            parkingNumber: parkingNumber,
            parkingName: parkingName,
            location: location,
            park: park,
            carRepairPlaces: carRepairPlaces,
            Price: Price
        })
        return res.status(200).json({ newParking });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

export const ParkingTimer = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username }).populate('bookedPark');

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No active parking booking found for this user.', hours: 0, minutes: 0, seconds: 0 });
        }

        const { parkNumber, bookingEndTime } = user.bookedPark;
        const parkingName = await Parking.findOne({ "location.parkingName": user.bookedPark.ChoosedParkName })
        if (!parkingName) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Yoy have't choosed any aprk yet !!!", hours: 0, minutes: 0, seconds: 0 })
        }
        const park = parkingName.park.find(park => park.parkNumber == parkNumber)
        const duration = park.duration
        const currentTime = new Date();

        // Assuming bookingEndTime is stored in UTC and adjusting for a timezone difference if necessary
        let adjustedBookingEndTime = new Date(bookingEndTime)
        adjustedBookingEndTime.setHours(bookingEndTime.getHours() - (park.duration + 3))
        console.log(bookingEndTime + "     current Time :" + currentTime);

        // Check if the parking time hasn't started yet
        if (currentTime < adjustedBookingEndTime) {
            return res.status(StatusCodes.OK).json({ message: 'Parking Time Hasn\'t Started Yet', hours: 0, minutes: 0, seconds: 0 });
        }

        // Check if the parking time has ended
        if (currentTime > adjustedBookingEndTime.setHours(adjustedBookingEndTime.getHours() + park.duration)) {
            // park.duration=0
            // park.filled=false
            // park.carNumber=null
            // user.bookedPark.ChoosedParkName=null,
            // user.bookedPark.bookingEndTime=null,
            // user.bookedPark.parkNumber=null
            // await user.save()
            // await parkingName.save()


            return res.status(StatusCodes.OK).json({ message: 'Parking Time Has Ended', hours: 0, minutes: 0, seconds: 0 });
        }

        // Calculate the remaining time in milliseconds
        const remainingTimeMillis = adjustedBookingEndTime.getTime() - currentTime.getTime();

        // Convert milliseconds to hours, minutes, and seconds
        const hours = Math.floor(remainingTimeMillis / (1000 * 60 * 60));
        const mins = Math.floor((remainingTimeMillis % (1000 * 60 * 60)) / (1000 * 60))
        const secs = Math.floor((remainingTimeMillis % (1000 * 60)) / 1000);

        return res.status(StatusCodes.OK).json({ hours: hours, minutes: mins, seconds: secs });


    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while processing the parking timer.' });
    }
};
export const ExpandParkingTime = async (req, res) => {
    const { username, duration } = req.body
    if (!username) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please Provide user name" })
    }
    const user = await User.findOne({ username: username })
    if (!username) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "could'nt Find user " })
    }
    if (!user.bookedPark) {
        return res.status(StatusCodes.OK).json({ message: "You have'nt booked any park yet " })
    }
    let bookingEndTime = user.bookedPark.bookingEndTime
    let newBookingEndDate = new Date(bookingEndTime.getTime() + duration * 60 * 60 * 1000)

    user.bookedPark.bookingEndTime = user.bookedPark.bookingEndTime.getTime() + (duration * 60 * 60 * 1000)

    await user.save()
    const Park = await Parking.findOne({ 'location.parkingName': user.bookedPark.ChoosedParkName })
    if (!Park) {
        return res.status(StatusCodes.BAD_REQUEST).json({ messgae: "could'nt Find Park" })
    }
    const spot = Park.park.find(object => object.parkNumber == user.bookedPark.parkNumber)
    spot.bookingEndTime = user.bookedPark.bookingEndTime + (duration * 60 * 60 * 1000)
    spot.duration += duration
    await Park.save()
    const order = await ParkingOrder.findOne({ userId: user._id })
    if (!order) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "order not found" })
    }
    const oldduration = order.duration
    order.duration = oldduration + duration
    const oldPrice = order.Price
    order.Price = oldPrice + (duration * Park.location.Price)

    order.save()

    return res.status(StatusCodes.OK).json({ message: "Done Sucessfuly " })
}
// export const HomeParkingTimer = async(req,res)=>{
//     const {username} =req.body 
//     if(!username){
//         return res.status(StatusCodes.BAD_REQUEST).json({message : "Please Provide username"})
//     }
//     const user = await User.findOne({username:username})
//     if(!user){
//         return res.status(StatusCodes.BAD_REQUEST).json({message : "user not found"})
//     }
//     const currentTime=new Date()
//     let bookingEndTime=user.bookedPark.bookingEndTime.getTime()
//     let RealTime= currentTime.getTime
//     console.log("Booking "+bookingEndTime+"     Realtime"+RealTime);
//     console.log(user.bookedPark.bookingEndTime.getDate());
//     if(user.bookedPark.bookingEndTime.getDate()>currentTime.getDate()){
//         bookingEndTime=bookingEndTime + (24*60)
//     }
//     const Time = (bookingEndTime/60) -(RealTime/60)
// if(Time<=0){
//     user.bookedPark.bookingEndTime=null
//     user.bookedPark.ChoosedParkName=null
//     user.bookedPark.parkNumber=null
//     user.save()
//     return res.status(StatusCodes.OK).json({message : "Expired"})
// }



// return res.status(StatusCodes.OK).json({message: "Time"})











function convertTo24HourFormat(timeString) {
    const [time, period] = timeString.split(' ');
    const [hour, minute] = time.split(':');
    let formattedHour = parseInt(hour);

    if (period === 'PM' && formattedHour != 12) {
        formattedHour += 12;

    }
    if (period === 'AM' && formattedHour == 12) {
        formattedHour = 0
    }
    //console.log(formattedHour);
    formattedHour = formattedHour.toString()

    return `${formattedHour}:${minute}`;
}
