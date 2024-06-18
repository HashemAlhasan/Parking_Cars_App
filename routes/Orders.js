import {Router} from 'express'
const router =Router()
import  {getAllParkingOrders,getAllRepairOrders ,DeleteOrderParking,DeleteOrderRepair} from '../controllers/OrderControllers.js'
router.route('/getParkingOrders').post(getAllParkingOrders)
router.route('/getReapirOrders').post(getAllRepairOrders)
router.route('/deleteOrder').post(DeleteOrderParking)
router.route('/deleterepair').post(DeleteOrderRepair)
export default router