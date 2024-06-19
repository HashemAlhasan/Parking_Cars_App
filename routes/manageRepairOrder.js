import { Router } from 'express';
const router = Router()
import { allRepairOrdersList, deleteRepairOrder, updateRepairOrderStatuse } from '../controllers/OrderControllers.js';




router.route('/getAll-repairOrder').post(allRepairOrdersList);
router.route('/delete-repairOrder').delete(deleteRepairOrder);
router.route('/update-repairOrder').post(updateRepairOrderStatuse);






export default router