import User from '../modules/users.js';
import Cars from '../modules/cars.js';
import parking from '../modules/parking.js';



export const selectProblem = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).populate('car')
        const userCar = user.car
        const problems = req.body.problems;
        const problemType = req.body.type
        if (problemType === 'Mechanic') {
            await userCar.carProblems.Mechanic.push(problems)
        }
        if (problemType === 'Electric') {
            await userCar.carProblems.Electric.push(problems)
        }
        await userCar.save()
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}