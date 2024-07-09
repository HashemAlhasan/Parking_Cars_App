import { Router } from 'express'
const router = Router()
import { getAllParkingOrders, getAllRepairOrders, DeleteOrderParking, DeleteOrderRepair } from '../controllers/OrderControllers.js'
import { verifyToken } from '../middleware/verifyToken.js'
router.route('/getParkingOrders').post(verifyToken, getAllParkingOrders)
router.route('/getReapirOrders').post(verifyToken, getAllRepairOrders)
router.route('/deleteOrder').post(verifyToken, DeleteOrderParking)
router.route('/deleterepair').post(verifyToken, DeleteOrderRepair)
export default router