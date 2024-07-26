import { StatusCodes } from "http-status-codes"
import ParkingOrder from "../modules/ParkingOrder.js"
import parking from "../modules/parking.js"
import Admins from "../modules/Admins.js"

export const TotalRevenu  = async(req,res)=>{
  try {
    const {AdminEmail} =req.body
    const AdminId= await Admins.findOne({email:AdminEmail})
    console.log(AdminId._id);
    const result= await ParkingOrder.aggregate([{
        $group:{
            _id:'$SelectedPark',
            total :{$count:{}},
            d :{$push :'$$ROOT'}
        },
       


    },{
        $lookup :{
            from:'parkings',
            localField:'d.SelectedPark',
            foreignField:'_id',
            as:'ParkingLocation'
        },
    },{
      $match:{
        'ParkingLocation.Admin':AdminId._id
      }

    },
    {
      $unwind: '$ParkingLocation'
    },{
      $project :{
        parkName:'$ParkingLocation.location.parkingName',
        total:1
      }
    }


])


    return res.status(StatusCodes.OK).json({message : result})
  } catch (error) {
    console.log(error);
    
  }
}