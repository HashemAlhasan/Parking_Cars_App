import { StatusCodes } from "http-status-codes"

export const ProSubscribtion = async(req,res)=>{
    try { return res.status(StatusCodes.OK).json({message : "Pro"})
        
    } catch (error) {
        
    }
    return res.status(StatusCodes.OK).json({message : "Pro"})
}