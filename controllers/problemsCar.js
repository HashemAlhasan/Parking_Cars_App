import User from '../modules/users.js';
import Cars from '../modules/cars.js';
import parking from '../modules/parking.js';
import { StatusCodes } from 'http-status-codes';



export const selectProblem = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username }).populate('car')
        const userCar = user.car
        console.log(user);
        const problems = req.body.problems;
        const problemType = req.body.type
        if (problemType === 'Mechanic') {
            await userCar.carProblems.Mechanic.push(problems)
        }
        if (problemType === 'Electric') {
            await userCar.carProblems.Electric.push(problems)
        }
        await userCar.save()
        return res.status(StatusCodes.OK).json({message : "Done Sucessfuly "})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
   // return res.status(StatusCodes.OK).send("problem Car")
}