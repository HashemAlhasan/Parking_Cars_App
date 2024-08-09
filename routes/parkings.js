import { Router } from "express";
import { addParking,bookingPark,ParkingTimer,ExpandParkingTime ,bookingRepairPark,CanceLBooking} from "../controllers/booking.js";
import { getParkingLocations,getParkingSpots } from '../controllers/map.js'
import {qrcodeGenerator,getQrParkingSpots} from '../controllers/QrCode.js'
const router = Router();


router.route('/bookingPark').post(bookingPark)
router.route('/addparking').post(addParking)
router.route('/getclosestpark').post(getParkingLocations)
router.route('/getParkingSpots').post(getParkingSpots)
router.route('/ParkingTimer').post(ParkingTimer)
router.route('/expandParkingTime').post(ExpandParkingTime)
router.route('/HomeParkingTimer').post(ParkingTimer)
router.route('/getSpotBycode').post(getQrParkingSpots)
router.route('/cancelbooking').post(CanceLBooking)
router.route('/generateqrcode/:id').get(qrcodeGenerator)




export default router