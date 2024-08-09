import {Router} from 'express'
const router=Router()
import {NumberOfParksByLocation,TotalRevenu,NumberOfLocationsByPark ,TotalRevenuByPark,RepairOrdersByproblem} from '../controllers/Statsics.js'
router.route('/numberofparks').post(NumberOfParksByLocation)
router.route('/totalRevenu').post(TotalRevenu)
router.route('/numberoflocationbypark').post(NumberOfLocationsByPark)
router.route('/TotalRevenueByPark').post(TotalRevenuByPark)
router.route('/RepairOrdersByproblem').post(RepairOrdersByproblem)

export default router