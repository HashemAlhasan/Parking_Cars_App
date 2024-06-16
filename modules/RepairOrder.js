import mongoose, { Schema, model } from "mongoose";
const RepairOrderSchema=  new Schema({
    userId : { 
        type:Schema.ObjectId,
        ref : 'User',
        required: true,

    },
    SelectedPark :{ 
        type:Schema.ObjectId,
        ref : 'Parking',
        required: true,

    },
    carProblem:{
        type:Schema.ObjectId,
        ref : 'CarProblem',
        required: true,

    },

},{timestamps:true})
export default model('RepairOrder', RepairOrderSchema)