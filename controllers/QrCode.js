import { StatusCodes } from "http-status-codes";
import parking from "../modules/parking.js";
import QRCode  from "qrcode";
import fs from 'fs'
export const qrcodeGenerator= async(req,res)=>{
 
  //console.log(code);
  const {id:ParkingNumber} = req.params
  if(!ParkingNumber){
    return res.status(StatusCodes.BAD_REQUEST).json({message :"Please Provide Parking Number"})
  }

  const code = await  QRCode.toDataURL(`${ParkingNumber}`,{type:'image/jpeg'})
  //  console.log(code);

   return  res.send(`<img src= "${code}" >`)
   //return res.send('<h1>hello</h1>')
    //return res.status(StatusCodes.OK).json({message :"Done Sucessfuly "})
}



