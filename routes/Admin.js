import {Router} from 'express'
const router=Router()
<<<<<<< HEAD
<<<<<<< HEAD
import {registerAdmin ,addPark , editPark,loginAdmin,getMyParks , Settings} from '../controllers/Admins.js'
router.route('/reigester').post(registerAdmin)
router.route('/Adminlogin').post(loginAdmin)
router.route('/getParks').post(getMyParks)
router.route('/settigns').post(Settings)
router.route('/addPark').post(addPark)
router.route('/editPark').post(editPark)

=======
import {registerAdmin} from '../controllers/Admins.js'
router.route('/reigester').post(registerAdmin)
>>>>>>> origin/main
=======
import {registerAdmin} from '../controllers/Admins.js'
router.route('/reigester').post(registerAdmin)
>>>>>>> 73028f2de502a8cdfaf8844580437c70220f6903
export default router