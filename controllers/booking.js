import Parking from "../modules/parking";
import User from "../modules/users";

export const bookingPark = async (req, res) => {
    try {
        const { username, carNumber, duration } = req.body;
        const parkingName = req.body.parkingname;

        const parkChoosed = await Parking.findOne({ parkingName });
        const user = await User.findOne({ username });

        if (!parkChoosed) {
            return res.status(400).json({ message: 'Parking not found' });
        }

        const emptyPark = parkChoosed.park.find(park => !park.filled);

        if (!emptyPark) {
            return res.status(400).json({ message: 'No empty parks available' });
        }

        emptyPark.filled = true;
        emptyPark.carNumber = carNumber;
        emptyPark.bookingEndTime = new Date(Date.now() + duration * 60 * 60 * 1000);

        await parkChoosed.save();

        user.bookedPark.parkNumber = emptyPark.parkNumber;
        user.bookedPark.bookingEndTime = emptyPark.bookingEndTime;

        const paymentAmount = duration * 2500;
        user.paymentAmount += paymentAmount;


        //make discount for pro user here ************






        //**************************
        await user.save();

        return res.status(200).json({
            parkNumber: emptyPark.parkNumber,
            carNumber: emptyPark.carNumber,
            bookingEndTime: emptyPark.bookingEndTime,
            parksNum: user.bookedPark.parkNumber
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