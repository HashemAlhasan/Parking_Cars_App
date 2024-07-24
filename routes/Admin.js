import {Router} from 'express'
const router=Router()
import {registerAdmin ,addPark} from '../controllers/Admins.js'
router.route('/reigester').post(registerAdmin)
router.route('/addPark').post(addPark)
export default router