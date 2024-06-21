import { Router } from "express";
import { addParking,bookingPark,ParkingTimer,ExpandParkingTime ,bookingRepairPark} from "../controllers/booking.js";
import { getParkingLocations,getParkingSpots } from '../controllers/map.js'
import {qrcodeGenerator} from '../controllers/QrCode.js'
const router = Router();


router.route('/bookingPark').post(bookingPark)
router.route('/addparking').post(addParking)
router.route('/getclosestpark').post(getParkingLocations)
router.route('/getParkingSpots').post(getParkingSpots)
router.route('/ParkingTimer').get(ParkingTimer)
router.route('/expandParkingTime').post(ExpandParkingTime)
router.route('/HomeParkingTimer').post(ParkingTimer)
router.route('/generateqrcode/:id').get(qrcodeGenerator)




export default router