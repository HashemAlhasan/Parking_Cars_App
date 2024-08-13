import {Router} from 'express'
const router=Router()
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
export default router