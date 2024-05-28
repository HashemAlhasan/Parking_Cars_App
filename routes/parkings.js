import { Router } from "express";
import { addParking } from "../controllers/booking.js";
import { getParkingLocations } from '../controllers/map.js'
const router = Router();



router.route('/addparking').post(addParking)
router.route('/getclosestpark').post(getParkingLocations)




export default router