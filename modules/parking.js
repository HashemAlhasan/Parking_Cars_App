import mongoose, { Schema, model } from "mongoose";


const parkingSchema = new Schema({
    parkingNumber: { type: Number, required: true },
    parkingName: { type: String, required: true },
    park: [
        {
            parkNumber: { type: Number, required: true },
            filled: { type: Boolean, default: false },
            carNumber: { type: String, default: null },
            bookingEndTime: { type: Date, required: true }
        }
    ],
    carRepairPlaces: [
        {
            carRepairNumber: { type: Number, required: true },
            filled: { type: Boolean, default: false },
            carNumber: { type: String, default: null }
        }
    ]
})

parkingSchema.index({ parkingName: 1 })
export default model('Parking', parkingSchema)