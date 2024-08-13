import { Router } from "express";
const router = Router()

import { register, sendCode, verifyCode, login, verifyResetPasswordCode, logout, resetPassword, forgotPassword } from '../controllers/user.js'
import { verifyToken,VerificationCode } from '../middleware/verifyToken.js'


router.route('/register').post(register);
router.route('/sendCode').post(sendCode);
router.route('/verifyCode').post(verifyCode);
router.route('/settings').post(UpdateUser)
router.route('/login').post(login);
router.route('/logout').get(verifyToken, logout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/verifyResetPassCode').post(verifyResetPasswordCode);
router.route('/resetPassword').post(resetPassword)
router.route('/getDeviceLang').post(getDeviceLang)







export default router