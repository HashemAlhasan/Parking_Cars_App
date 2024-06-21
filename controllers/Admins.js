import Admin from "../modules/Admins.js";
import parking from "../modules/parking.js";

export const registerAdmin = async (req, res,) => {
    try {
        const { email, password, confirmPassword, username, firstName, lastName, ParkNumber } = req.body
        if (!(email && password && username && firstName && lastName)) {
            return res.status(400).send("All input is required");
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }
        if (!validator.isLength(password, { min: 6 })) {
            return res.status(400).json({ message: "Password should be at least 6 characters long" })
        }
        if (!validator.isLength(confirmPassword, { min: 6 })) {
            return res.status(400).json({ message: "Confirm Password should be at least 6 characters long" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "The password and confirm password are not the same" })
        }
        if (!validator.isLength(username, { min: 3, max: 10 })) {
            return res.status(400).json({ message: 'Username is required' });
        }
        if (!validator.isLength(firstName, { min: 1, max: 10 })) {
            return res.status(400).json({ message: 'First Name is required' });
        }
        if (!validator.isLength(lastName, { min: 1, max: 10 })) {
            return res.status(400).json({ message: 'Last Name is required' });
        }
        const isExist = await Admin.findOne({ $or: [{ email }, { username }] })
        if (isExist) {
            return res.status(409).json({ message: 'email is already exsisted Pleas Input another email' })
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            email: email,
            password: encryptedPassword,
            username: username,
            firstName: firstName,
            lastName: lastName,
            parkingNumber: ParkNumber,
        })
        return res.status(200).json({ message: 'Done Sucessfuly' })

    } catch (error) {
        throw new Error(error)
    }
}


export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide email and password to login" });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Password or email may be incorrect" });
        }
        if (admin && (await bcrypt.compare(password.toString(), Admin.password))) {
            console.log(`${admin.firstName} Loged-in`);
            const token = jwt.sign({ email: admin.email }, process.env.TOKEN_KEY, { expiresIn: '90d' });
            res.cookie('token', token, { maxAge: 240 * 60 * 60 * 1000 });
            res.status(200).json({ message: "Login Sucessfly", token: token, admin: admin });
        } else {
            return res.status(400).json({ message: "Password or email may be incorrect" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}



export const logoutAdmin = async (req, res) => {
    try {
        const token = '';
        res.cookie('token', token)
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json(error);
    }
}


