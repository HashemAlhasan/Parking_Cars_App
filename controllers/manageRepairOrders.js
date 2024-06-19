import { StatusCodes } from "http-status-codes";
import User from '../modules/users.js';
import RepairOrder from "../modules/RepairOrder.js";
import parking from '../modules/parking.js';
import Notification from '../modules/notifications.js';
import sendNotification from '../utils/sendNotifications.js'


export const allRepairOrdersList = async (req, res) => {
    try {
        const repairList = await RepairOrder.find({}).sort({ createrAt: -1 }).populate({ path: 'ProblemType', model: 'Cars' }).populate({ path: 'userId', model: 'User' }).populate({ path: 'park', model: 'Parking' });
        if (!repairList) {
            return res.status(400).json({ message: 'There is no repair orders to show' });
        }
        return res.status(200).json(repairList);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" });
    }
}


export const deleteRepairOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'please provide userId' });
        }
        const deletedRpairOrder = await RepairOrder.findOneAndDelete({ userId: userId });
        if (!deleteRepairOrder) {
            return res.status(400).json({ message: 'The order can not found' });
        }
        return res.status(200).json({ message: `${deleteRepairOrder._id} was deleted succesfully` });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" });
    }
}

export const updateRepairOrderStatuse = async (req, res) => {
    try {
        const { userId, price, date, fcmToken } = req.body;  // Add fcmToken to the request body
        if (!userId) {
            return res.status(400).json({ message: "userId not found" });
        }
        if (!price || !date) {
            return res.status(400).json({ message: "Please provide price and date" });
        }

        const repairOrder = await RepairOrder.findOneAndUpdate(
            { userId },
            {
                orderStatus: repairOrder.orderStatus === false ? true : false,
                orderPrice: price,
                orderFinishDate: date,
            },
            { new: true }
        );

        if (!repairOrder) {
            return res.status(400).json({ message: 'The order cannot be found' });
        }

        await repairOrder.save();

        // Store notification in the database
        const message = `Your repair order has been updated with a price of $${price} and will be ready by ${date}.`;

        const notification = new Notification({
            userId: userId,
            message: message,
        });

        await notification.save();

        // Send notification via Firebase Cloud Messaging
        await sendNotification(userId, message, fcmToken);

        res.status(StatusCodes.OK).json({ message: 'Repair order updated and notification sent' });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" });
    }
};