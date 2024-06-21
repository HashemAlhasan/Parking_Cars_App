
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
    resetPasswordCode: {
        type: String,
        default: ''
    },
    resetPasswordExpiration: {
        type: Date,
        default: null
    },
    bookedPark: {
        parkNumber: { type: Number },
        bookingEndTime: { type: Date },
        ChoosedParkName: { type: String }
    },
    money: {
        type: Number,
        default: 0
    },
    paymentAmount: {
        type: Number,
        default: 0
    },
    pro: {
        type: Boolean,
        default: false
    },
    fcmToken:{
        type:String
        
    }
},
    {
        timestamps: true,
        collection: 'User'
    })

userSchema.index({ email: 1, username: 1 })
export default model('User', userSchema)