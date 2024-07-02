import {Router} from 'express'
const router=Router()
import {registerAdmin} from '../controllers/Admins.js'
router.route('/reigester').post(registerAdmin)
export default router