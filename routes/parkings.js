import { Router } from "express";
<<<<<<< HEAD
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
=======
import { addParking, bookingPark, ParkingTimer, ExpandParkingTime, bookingRepairPark } from "../controllers/booking.js";
import { getParkingLocations, getParkingSpots } from '../controllers/map.js'
import { qrcodeGenerator, getQrParkingSpots } from '../controllers/QrCode.js'
import { verifyToken } from '../middleware/verifyToken.js'
const router = Router();


router.route('/bookingPark').post(verifyToken, bookingPark)
router.route('/addparking').post(verifyToken, addParking)
router.route('/getclosestpark').post(verifyToken, getParkingLocations)
router.route('/getParkingSpots').post(verifyToken, getParkingSpots)
router.route('/ParkingTimer').post(verifyToken, ParkingTimer)
router.route('/expandParkingTime').post(verifyToken, ExpandParkingTime)
router.route('/HomeParkingTimer').post(verifyToken, ParkingTimer)
router.route('/getSpotBycode').post(verifyToken, getQrParkingSpots)
router.route('/generateqrcode/:id').get(verifyToken, qrcodeGenerator)
>>>>>>> origin/main




export default router