import { Router } from "express";
const router = Router()

import { register, sendCode, verifyCode } from '../controllers/user.js'


router.route('/register').post(register)
router.route('/sendCode').get(sendCode)
router.route('/verifyCode').post(verifyCode)



export default router