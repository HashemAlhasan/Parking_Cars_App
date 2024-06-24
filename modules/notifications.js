import mongoose, { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    }
})

export default  model('Notification', NotificationSchema)