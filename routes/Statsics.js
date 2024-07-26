import {Router} from 'express'
const router=Router()
import {TotalRevenu} from '../controllers/Statsics.js'
router.route('/').post(TotalRevenu)
export default router