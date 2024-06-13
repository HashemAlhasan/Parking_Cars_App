
import { StatusCodes } from "http-status-codes";
import Parking from "../modules/parking.js";
import User from "../modules/users.js";
import { now } from "mongoose";


export const bookingPark = async (req, res) => {
    try {
        const { username, duration,Spot  ,date} = req.body;
                      
        const parkingName = req.body.parkingName;
        const now = new Date()
        /// create a new date object and set time t0 00:00:00
        let ParkingStartingDate = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0)
        // convert the time coming from request to 24 hour format
        const newDate = convertTo24HourFormat(date)
        // get the hour and minutes
        let [hour, minute] = newDate.split(':')
        //heres the catch when you set the hours to 00 it takes the local timeZone GMT-3 hours 
        // so to put the hours in correct format we add three hours 
        hour = Number(hour) +3
      // set The Bookine End Time where it is The starting date added to it the duration

       const BookineEndTime= ParkingStartingDate.setHours(hour + duration,minute)
      
   
    
    

        //find the Park based on The Park name
        const parkChoosed = await Parking.findOne({"location.parkingName":parkingName});
        //we get the user which has the car that have the number of(car Number)
        const user = await User.findOne({ username }).populate('car');
        //console.log(user);
        const    carNumber= user.car.carNumber

        if (!parkChoosed) {
            return res.status(400).json({ message: 'Parking not found' });
        }
            //we get the spot from from end and so we have the choosed park 
         const emptyPark = parkChoosed.park.find(object=>object.parkNumber===Spot ) ;
        
         if (!emptyPark) {
             return res.status(400).json({ message: 'No empty parks available' });
         }

         emptyPark.filled = true;
         emptyPark.carNumber = carNumber;
         emptyPark.bookingEndTime = new Date(BookineEndTime);
      

         await parkChoosed.save();
   

         user.bookedPark.parkNumber = emptyPark.parkNumber;
         user.bookedPark.bookingEndTime = emptyPark.bookingEndTime;
         const Price = parkChoosed.location.Price
         const paymentAmount = duration *Price ;
         user.paymentAmount += paymentAmount;


        //make discount for pro user here ************






        //**************************
         await user.save();
           // console.log(emptyPark);
         return res.status(200).json({
            message:"Done Sucessfuly" ,
            parkNumber: emptyPark.parkNumber,
           carNumber: emptyPark.carNumber,
            bookingEndTime: emptyPark.bookingEndTime,
            parksNum: user.bookedPark.parkNumber
         });
       // return res.status(StatusCodes.OK).json(parkChoosed)
    } catch (error) {
        console.error('Error booking parking:', error.message);
        return res.status(500).json({ message: 'Booking failed' });
    }
};


export const bookingRepairPark = async (req, res) => {
    try {
        const userName = req.params.username
        const parkNumber = req.body.parkNumber
        const user = await User.findOne({ username: userName }).populate('car') // جيب معلومات السيارة هون
        const selectedPark = await Parking.findOne({ parkingNumber: parkNumber })
        const emptyPark = selectedPark.carRepairPlaces.find(park => !park.filled)
        if (!emptyPark) {
            return res.status(400).json({ message: 'No empty parks available' });
        }
        emptyPark.filled = true
        emptyPark.carNumber = user.car.carNumber //تاكد من الشغل هون بالحرف
        await emptyPark.save()
        return res.status(200).json({ carRepairNumber: emptyPark.carRepairNumber })
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}



export const addParking = async (req, res) => {
    try {
        const { parkingNumber, parkingName, location, park, carRepairPlaces ,Price} = req.body;
        let newPrice=toString(Price)
        newPrice=parseFloat(newPrice)
        
        const newParking = await Parking.create({
            parkingNumber: parkingNumber,
            parkingName: parkingName,
            location: location,
            park: park,
            carRepairPlaces: carRepairPlaces,
            Price :newPrice
        })
        return res.status(200).json({ newParking });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}
export const ParkingTimer= async(req,res)=>{
    try {
                const carNumber = req.params
                const Info= Parking.findOne()
         return res.status(StatusCodes.OK).send("ParkingTimer")
    } catch (error) {
        
    }
}
function convertTo24HourFormat(timeString) {
    const [time, period] = timeString.split(' ');
    const [hour, minute] = time.split(':');
    let formattedHour = parseInt(hour);
   

    if (period === 'PM' && formattedHour!=12) {
        formattedHour += 12;
        
    }
    if(period==='AM' && formattedHour==12){
    formattedHour=0
    }
    //console.log(formattedHour);
        formattedHour=formattedHour.toString()
    
    return `${formattedHour}:${minute}`;
}

