import { Router } from 'express'
import { getParkingLocations } from '../controllers/map.js'
import { selectProblem, AddProblem, getProblems } from "../controllers/problemsCar.js"
import { bookingRepairPark } from '../controllers/booking.js'
import { verifyToken } from '../middleware/verifyToken.js'
const router = Router();
router.route('/selectproblem').post(verifyToken, selectProblem)
router.route('/addProblem').post(verifyToken, AddProblem)
router.route('/getProblemType').post(verifyToken, getProblems)
router.route('/orderproblem').post(verifyToken, bookingRepairPark)
router.route('/getRepairPlaces').post(verifyToken, getParkingLocations)

export default router