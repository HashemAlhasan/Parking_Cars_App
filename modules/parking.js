import mongoose, { Schema, model } from "mongoose";


const parkingSchema = new Schema({
   
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        parkingNumber: { type: Number, required: true },
        parkingName: { type: String, required: true },
        Price: {type:Number ,required: true}
    },
    park: [
        {
            parkNumber: { type: Number, required: true },
            filled: { type: Boolean, default: false },
            carNumber: { type: String, default: null },
            bookingEndTime: { type: Date, required: true }
            UserID :{type : }

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

// parkingSchema.index({ parkingName: 1, location: "2dsphere" })
parkingSchema.index({ location: "2dsphere" })

export default model('Parking', parkingSchema)