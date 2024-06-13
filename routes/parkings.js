import { Router } from "express";
import { addParking,bookingPark,ParkingTimer } from "../controllers/booking.js";
import { getParkingLocations,getParkingSpots } from '../controllers/map.js'
const router = Router();


router.route('/bookingPark').post(bookingPark)
router.route('/addparking').post(addParking)
router.route('/getclosestpark').post(getParkingLocations)
router.route('/getParkingSpots').post(getParkingSpots)
router.route('/ParkingTimer').get(ParkingTimer)




export default router