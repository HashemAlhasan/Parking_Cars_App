import User from '../modules/users.js';
import Cars from '../modules/cars.js';
import jwt from 'jsonwebtoken';
import nodemailer, { createTransport } from 'nodemailer'
import bcrypt from 'bcryptjs'
import validator from 'validator'


export const register = async (req, res) => {
    try {
        const { email, password, confirmPassword, username, firstName, lastName, carNumber, carModel, carType } = req.body

        if (!(email && password && username && firstName && lastName && carNumber && carModel && carType)) {
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
        if (!validator.isLength(firstName, { min: 3, max: 10 })) {
            return res.status(400).json({ message: 'First Name is required' });
        }
        if (!validator.isLength(lastName, { min: 3, max: 10 })) {
            return res.status(400).json({ message: 'Last Name is required' });
        }
        const isExist = await User.findOne({ $or: [{ email }, { username }] })
        if (isExist) {
            return res.status(409).send("Username or email already exist")
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email: email.toLowerCase(),
            password: encryptedPassword,
            username: username,
            firstName: firstName,
            lastName: lastName
        })
        const newUserCar = await Cars.create({
            onerId: newUser._id,
            carModel: carModel,
            carType: carType,
            carNumber: carNumber
        })

        return res.status(200).json(newUser)
    } catch (error) {
        throw new Error(error)
    }
}

export const verifyCode = async (req, res) => {
    try {
        const code = req.body.code;
        if (!validator.isLength(code, { min: 6, max: 6 })) {
            return res.status(400).json({ message: "Enter 6 numbers code" })
        }
        const usermail = req.body.email;
        if (!validator.isEmail(usermail)) {
            return res.status(400).json({ message: "Invalid Email" })
        }
        let user = await User.findOne({ email: usermail });
        const verifyEmailCode = user.verifyEmailCode;
        const expirationCodeTime = user.expirationCodeTime;

        if (code.toString() !== verifyEmailCode) {
            res.json("Code is incorrect");
        } else if (Date.now() > expirationCodeTime) {
            res.json("Code has expired. Please resend it again.");
        } else {
            user = await User.findOneAndUpdate(
                { email: usermail },
                { emailVerified: true },
                { new: true }
            );
            return res.status(200).json(user.emailVerified);
        }
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};


export const forgotPassword = async (req, res) => {
    const email = req.body.email
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    const subject = "Reset Password"
    const message = //********** */
        sendEmail(email, subject, message)
    // Send URL to redirect to the reset passord flutter page then 
}

export const resetPassword = async (req, res) => {
    const newPassword = req.body.newPassword
    const confirmPassword = req.body.confirmPassword
    if (!validator.isLength(newPassword, { min: 6 })) {
        return res.status(400).json({ message: "Password should be at least 6 characters long" })
    }
    if (!validator.isLength(confirmPassword, { min: 6 })) {
        return res.status(400).json({ message: "Password should be at least 6 characters long" })
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const userUpdated = await User.findBy

    
    // ***************************************/
    // Complete the code here ********
    //****************************************/
}

export const sendCode = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = generateVerificationCode()
        const message = `Your OTP code is: ${otp} the expiration time in 5 minutes`
        const subject = `Email Verification`
        const Expiration = Date.now() + 5 * 60 * 1000; // 5 minutes
        sendEmail(email, subject, message)
        const sentUser = await User.findOneAndUpdate({ email }, { expirationCodeTime: Expiration, verifyEmailCode: otp.toString() }, { new: true })
        return res.status(200).json(sentUser);
    } catch (error) {
        throw new Error(error)
    }
};


function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000)
};



const sendEmail = async (email, subject, message) => {
    try {
        const transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.UG,
                pass: process.env.PG
            }
        })
        transporter.sendMail({
            from: process.env.UG,
            to: email,
            subject: subject,
            text: message
        })
        console.log("Email sent successfully");

    } catch (error) {
        console.log("email not sent");
        console.log(error);
        throw new Error(error)
    }
}