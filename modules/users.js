
import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true,
        minlength: 3
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String
    },
    car: {
        type: Schema.ObjectId,
        // required: true, // Edit car to be Query,
        ref: 'Cars'
    },
    photo: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
        default: 'user'
    },
    expirationCodeTime: {
        type: Date,
        default: Date.now()
    },
    verifyEmailCode: {
        type: String,
        default: ""
    },
    bookedPark: {
        parkNumber: { type: Number, required: true, default: 0 },
        bookingEndTime: { type: Date, required: true, default: null }
    },
    money: {
        type: Number,
        default: 0
    },
    paymentAmount: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true,
        collection: 'User'
    })

userSchema.index({ email: 1, username: 1 })
export default model('User', userSchema)