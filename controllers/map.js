import parking from "../modules/parking.js";
import  {StatusCodes}from 'http-status-codes'




export const getParkingLocations = async (req, res) => {
    try {
        const { userLatitude, userLongitude } = req.body;
        console.log(userLatitude);
        console.log(userLongitude);
       
        const parkingLocations = await parking.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [userLongitude, userLatitude] 
                    },
                   // $maxDistance: 10000000000  // Maximum distance in meters (10 km)
                }
            }
        }, { parkingName: 1, location: 1,parkingNumber:1 })
            .lean();
            
            console.log(parkingLocations);
        return res.status(200).json({parkingLocations:parkingLocations});

    } catch (error) {
        res.status(400).json({ msg:"Please Provide UserLatitude and UserLangtitude" });
    }
}
export const  getParkingSpots = async(req,res)=>{
    try {
        const  {ParkingNumber}= req.body 
        if(!ParkingNumber){
           return  res.status(StatusCodes.BAD_REQUEST).json({message : " Please Provide Park Number"})
            
        }
        let ParkingSpots= await parking.findOne({'location.parkingNumber':ParkingNumber}).select('park location.parkingName')
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
        return res.status(StatusCodes.OK).json(ParkingSpots)



    
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.BAD_REQUEST).json({message:"Internal Server Error"})
        
    }


}