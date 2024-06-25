import {Router} from 'express'
import {ProSubscribtion} from '../controllers/Pro.js'
const router =Router()
router.route('/').post(ProSubscribtion)
export default router