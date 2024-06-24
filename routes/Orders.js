import { Router } from 'express'
const router = Router()
import { getAllParkingOrders, getAllRepairOrders } from '../controllers/OrderControllers.js'
router.route('/getParkingOrders').post(getAllParkingOrders)
router.route('/getReapirOrders').post(getAllRepairOrders)
export default router