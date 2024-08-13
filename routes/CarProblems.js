import {Router} from 'express'
import {getParkingLocations} from '../controllers/map.js'
import {selectProblem,AddProblem,getProblems } from "../controllers/problemsCar.js"
import {bookingRepairPark} from '../controllers/booking.js'
const router = Router() ;
router.route('/selectproblem').post(selectProblem)
router.route('/addProblem').post(AddProblem)
router.route('/getProblemType').post(getProblems)
router.route('/orderproblem').post(bookingRepairPark)
router.route('/getRepairPlaces').post(getParkingLocations)

export default router