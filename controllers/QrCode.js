import { StatusCodes } from "http-status-codes";
import parking from "../modules/parking.js";
import QRCode from "qrcode";
import fs from 'fs'
export const qrcodeGenerator = async (req, res) => {

  //console.log(code);
  const { id: ParkingNumber } = req.params
  if (!ParkingNumber) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please Provide Parking Number" })
  }

  const code = await QRCode.toDataURL(`${ParkingNumber}`, { type: 'image/jpeg' })
  //  console.log(code);

  return res.send(`<img src= "${code}" >`)
  //return res.send('<h1>hello</h1>')
  //return res.status(StatusCodes.OK).json({message :"Done Sucessfuly "})
}

export const getQrParkingSpots = async (req, res) => {
  try {
    const { ParkingNumber } = req.body
    if (!ParkingNumber) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: " Please Provide Park Number" })

    }
    let ParkingSpots = await parking.findOne({ 'location.parkingNumber': ParkingNumber }).select('park location.parkingName location.Price')
    if (!ParkingSpots) {
      const message = req.cookies.language === 'ar' ? ' لم يتم ايجاد الكراج ' : "no Park Has Been Found"
      return res.status(StatusCodes.BAD_REQUEST).json({ message: message })

    }
    //console.log(ParkingSpots.park[1]);
    //    let ParkingSpot ;
    //    for (let i in ParkingSpots.park){
    //     if(ParkingSpots.park[i].filled==false){
    //         ParkingSpot=i
    //         break

    //     }


    //    }
    //    ParkingSpots.park[ParkingSpot].Spot=true

    //    console.log(ParkingSpots.park[ParkingSpot]);


    // console.log(ParkingSpots);
    //  await   Object.assign(ParkingSpots,{'hashem':true})
    //const spot =  Park.park.find(object=>object.parkNumber==user.bookedPark.parkNumber)
    const spots = ParkingSpots.park.find(object => object.filled != true)
    if (!spots) {
      const message = req.cookies.language === 'ar' ? ' لايوجد اماكن ركن شاغرة حاليا في هاذا الكراج' : "no empty Spots Availabel in Parking Place"
      return res.status(StatusCodes.BAD_REQUEST).json({ message: message })

    }

    // console.log(spots);
    return res.status(StatusCodes.OK).json({ ParkingName: ParkingSpots.location.parkingName, Price: ParkingSpots.location.Price, spot: spots.parkNumber })




  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Internal Server Error" })

  }


}

