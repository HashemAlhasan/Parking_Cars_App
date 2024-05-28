import parking from "../modules/parking.js";




export const getParkingLocations = async (req, res) => {
    try {
        const { userLatitude, userLongitude } = req.body;
        const parkingLocations = await parking.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [userLongitude, userLatitude] 
                    },
                    $maxDistance: 10000  // Maximum distance in meters (10 km)
                }
            }
        }, { parkingName: 1, location: 1 })
            .lean();

        res.status(200).json(parkingLocations);
    } catch (error) {
        res.status(500).json({ error });
    }
}

