import { Router } from 'express';
const router = Router()
import { allRepairOrdersList, deleteRepairOrder, updateRepairOrderStatuse } from '../controllers/manageRepairOrders.js';

import { verifyToken } from '../middleware/verifyToken.js'


router.route('/getAll-repairOrder').post(verifyToken, allRepairOrdersList);
router.route('/delete-repairOrder').post(verifyToken, deleteRepairOrder);
router.route('/update-repairOrder').post(verifyToken, updateRepairOrderStatuse);






export default router