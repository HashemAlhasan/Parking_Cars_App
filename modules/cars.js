import mongoose, { Schema, model } from "mongoose";



const carSchema = new Schema({
    onerId: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    carModel: {
        type: String,
        reqired: true
    },
    carType: {
        type: String,
        reqired: true
    },
    carNumber: {
        type: String,
        required: true
    },
    carProblems: {
        Mechanic: [{
            type: String,
            required: true,
            default: 'NO Problems',
            enum:["Overheating","Flat Tire","Brakes Issues","Car Starter","Steering Issues","Malfunctioning Wipers"]
        }],
        Electric: [{
            type: String,
            required: true,
            default: 'NO Problems'
        }]
    }
})




export default model('Cars', carSchema)