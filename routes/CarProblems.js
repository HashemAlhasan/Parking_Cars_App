import {Router} from 'express'
import {selectProblem} from "../controllers/problemsCar.js"
const router = Router() ;
router.route('/selectproblem').post(selectProblem)
export default router