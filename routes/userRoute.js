import { Router } from "express";
const router = Router()

import { register, sendCode, verifyCode, login, verifyResetPasswordCode, logout, resetPassword, forgotPassword } from '../controllers/user.js'
import { verifyToken } from '../middleware/verifyToken.js'

router.route('/register').post(register);
router.route('/sendCode').post(sendCode);
router.route('/verifyCode').post(verifyCode);
router.route('/login').post(login);
router.route('/logout').get(verifyToken, logout);
router.route('/forgotpassword').get(forgotPassword);
router.route('/verifyResetPassCode').post(verifyResetPasswordCode);
router.route('/resetPassword').post(resetPassword)







export default router