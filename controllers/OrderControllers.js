import { StatusCodes } from "http-status-codes"
import ParkingOrder from '../modules/ParkingOrder.js'
import User from '../modules/users.js'
import RepairOrder from "../modules/RepairOrder.js"
export const getAllParkingOrders = async(req,res)=>{
try {
    const {username} = req.body
    if(!username) {
        res.status(StatusCodes.BAD_REQUEST).json({message:"Please Provide User Name"})
    }
    const  user = await User.findOne({username:username})
    console.log(user);
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({message: "User Not Found"})
    }
    const orders = await ParkingOrder.find({userId:user._id}).sort({createdAt:-1}).
    populate('userId','email firstName lastName').populate('SelectedPark','location.Price location.parkingName')
    if(!orders){
        res.status(StatusCodes.BAD_REQUEST).json({message:'No Orders were Found To This user '})
    }

 return   res.status(StatusCodes.OK).json(orders)
} catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({message :"an Error Occured "})
}
}
export const getAllRepairOrders = async(req,res)=>{
    try {const {username} = req.body
    if(!username) {
        res.status(StatusCodes.BAD_REQUEST).json({message:"Please Provide User Name"})
    }
    const  user = await User.findOne({username:username})
    if(!user){
        res.status(StatusCodes.BAD_REQUEST).json({message: "User Not Found"})
    }
    const orders =await RepairOrder.
    find({userId:user._id}).
    sort({createdAt:-1}).
    populate('userId','email firstName lastName').
    populate('SelectedPark',' location.parkingName').
    populate('carProblem')
    if(!orders){
        res.status(StatusCodes.BAD_REQUEST).json({message :"No Orders For This User"})
    }
    console.log(orders);

 return   res.status(StatusCodes.OK).json(orders)
        
    } catch (error) {
        console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({message :error})
        
    }

}
export const DeleteOrderParking = async(req,res)=>{
    try {
        const {id}=req.body 
  
    if(!id){
        return res.status(StatusCodes.BAD_REQUEST).json({message:"please Provide Order Id"})
    }
    const order= await ParkingOrder.findByIdAndDelete(id)
    console.log(order);
    if(!order){
        return res.status(StatusCodes.BAD_REQUEST).json({message :"Order Not Found "})

    }

    return res.status(StatusCodes.OK).json({message :"Deleted Sucesffuly"})

        
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({messgae:error})
        
    }
    
}
export const DeleteOrderRepair = async(req,res)=>{
    try {const {id:orderId}=req.body
    console.log(orderId);
    if(!orderId){
        return res.status(StatusCodes.BAD_REQUEST).json({message:"please Provide Order Id"})
    }
    const order= await RepairOrder.findOneAndDelete({_id:orderId})
    console.log(order);
    if(!order){
        return res.status(StatusCodes.BAD_REQUEST).json({message :"Order Not Found "})

    }


    return res.status(StatusCodes.OK).json({message :"Deleted Sucesffuly"})
        
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.BAD_REQUEST).json({message :"Error"})
        
    }
    

}