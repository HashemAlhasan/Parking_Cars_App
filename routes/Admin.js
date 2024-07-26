import {Router} from 'express'
const router=Router()
import {registerAdmin ,addPark , editPark,loginAdmin,getMyParks} from '../controllers/Admins.js'
router.route('/reigester').post(registerAdmin)
router.route('/Adminlogin').post(loginAdmin)
router.route('/getParks').post(getMyParks)
router.route('/addPark').post(addPark)
router.route('/editPark').post(editPark)

export default router