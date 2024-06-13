
import { StatusCodes } from "http-status-codes";
import Parking from "../modules/parking.js";
import User from "../modules/users.js";


export const bookingPark = async (req, res) => {
    try {
        const { username, carNumber, duration, Spot, parkingNumber } = req.body;

        if (!username || !carNumber || !duration || !Spot || !parkingNumber) {
            return res.status(400).json({ message: 'All input required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const parkChoosed = await Parking.findOne({ "location.parkingNumber": parkingNumber }).populate('parkingName');
        if (!parkChoosed) {
            return res.status(400).json({ message: 'Parking not found' });
        }


        const emptyPark = parkChoosed.park.find(Spot);
        if (!emptyPark) {
            return res.status(400).json({ message: 'No empty parks available' });
        }

        emptyPark.filled = true;
        emptyPark.carNumber = carNumber;
        emptyPark.bookingEndTime = new Date(Date.now() + duration * 60 * 60 * 1000);

        await parkChoosed.save();

        user.bookedPark = {
            parkNumber: emptyPark.parkNumber,
            bookingEndTime: emptyPark.bookingEndTime,
            chosenParkName: parkChoosed.parkingName
        };

        let paymentAmount = duration * 2500;
        // Discount for Pro User
        if (user.pro) {
            paymentAmount *= 0.75;
        }
        user.paymentAmount += paymentAmount;
        await user.save();

        return res.status(200).json({
            parkNumber: emptyPark.parkNumber,
            carNumber: emptyPark.carNumber,
            bookingEndTime: emptyPark.bookingEndTime,
            parksNum: user.bookedPark.parkNumber,
            parkingName: user.bookedPark.parkingName
        });
    } catch (error) {
        console.error('Error booking parking:', error.message);
        return res.status(500).json({ message: 'Booking failed' });
    }
};


export const bookingRepairPark = async (req, res) => {
    try {
        const userName = req.params.username
        const parkNumber = req.body.parkNumber
        if (!userName) {
            return res.status(400).json({ message: 'UserName not found' });

        }
        if (!parkNumber) {
            return res.status(400).json({ message: 'Park number not found' });

        }
        const user = await User.findOne({ username: userName }).populate('car') // جيب معلومات السيارة هون
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
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
        const { parkingNumber, parkingName, location, park, carRepairPlaces, Price } = req.body;
        const newParking = await Parking.create({
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
        const { username } = req.params;
        const user = await User.findOne({ username }).populate('bookedPark');

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No active parking booking found for this user.' });
        }

        const { parkNumber, bookingEndTime } = user.bookedPark;
        const parkingName = await Parking.findOne({ parkNumber }).populate('parkingName')
        const currentTime = new Date();

        if (currentTime >= bookingEndTime) {
            user.bookedPark.parkNumber = null;
            user.bookedPark.bookingEndTime = null;
            await user.save();
            return res.status(StatusCodes.OK).json({ message: 'Parking time has expired.' });
        } else {
            const remainingTime = bookingEndTime.getTime() - currentTime.getTime();
            const minutes = Math.floor(remainingTime / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            return res.status(StatusCodes.OK).json({ message: `Parking time remaining: ${minutes}m ${seconds}s` });
        }
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while processing the parking timer.' });
    }
};