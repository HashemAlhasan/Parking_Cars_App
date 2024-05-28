import User from '../modules/users.js';
import Cars from '../modules/cars.js';
import jwt from 'jsonwebtoken';
import nodemailer, { createTransport } from 'nodemailer'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import CryptoJS from 'crypto-js';

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
        console.log(error)
        throw new Error(error)
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide email and password to login" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json("Password or email may be incorrect");
        }
        if (user && (await bcrypt.compare(password.toString(), user.password))) {
            if (user.emailVerified == false) {
                return res.status(400).json("Please verify your Email and try again");
            }
            console.log(`${user.username} Loged-in`);
            const token = jwt.sign({ email: user.email }, process.env.TOKEN_KEY, { expiresIn: '90d' });
            res.cookie('token', token, { maxAge: 240 * 60 * 60 * 1000 });
            res.status(200).json({ token });
        } else {
            return res.status(400).json("Password or email may be incorrect 2");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const logout = async (req, res) => {
    try {
        const token = '';
        res.cookie('token', token)
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json(error);
    }
}

export const verifyCode = async (req, res) => {
    try {
        const { code, email } = req.body;

        if (!validator.isLength(code, { min: 6, max: 6 })) {
            return res.status(400).json({ message: "Enter 6 numbers code" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }
        const user = await User.findOne({ email }).select('verifyEmailCode expirationCodeTime');
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        console.log(user);
        const verifyEmailCode = user.verifyEmailCode;
        const expirationCodeTime = user.expirationCodeTime;
        if (code.toString() !== verifyEmailCode) {
            return res.json("Code is incorrect");
        } else if (Date.now() > expirationCodeTime) {
            return res.json("Code has expired Please resend it again.");
        } else {
            const updatedUser = await User.findOneAndUpdate(
                { email },
                { emailVerified: true },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found after update" });
            }
            const token = jwt.sign({ email: user.email }, process.env.TOKEN_KEY, { expiresIn: '90d' });
            res.cookie('token', token, { maxAge: 240 * 60 * 60 * 1000 });
            return res.status(200).json({ userVerifyed: user.emailVerified, token: token });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};


export const 


forgotPassword = async (req, res) => {
    try {
        const email = req.body.email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json("User not found");
        }
        const userResetPasswordCode = generateVerificationCode();
        const subject = "Reset Password email";
        const message = `Your reset password code  is: ${userResetPasswordCode} the expiration time in 5 minutes`
        await sendEmail(email, subject, message);
        user.resetPasswordCode = userResetPasswordCode;
        user.resetPasswordExpiration = Date.now() + 5 * 60 * 1000;
        await user.save();
        return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        return res.status(500).json({ message: "Error processing request" });
    }
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
}


export const verifyResetPasswordCode = async (req, res) => {
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
        if (!user) {
            return res.status(400).json("User not found");
        }
        const verifyResetPassordCode = user.resetPasswordCode;
        const expirationResetPasswordCodeTime = user.resetPasswordExpiration;

        if (code.toString() !== verifyResetPassordCode) {
            return res.status(400).json("Code is incorrect");
        } else if (Date.now() > expirationResetPasswordCodeTime) {
            return res.status(400).json("Code has expired. Please resend it again.");
        } else {
            return res.status(200).json("Code verified successfully");
        }
    } catch (error) {
        throw new Error(error);
    }
};


export const sendCode = async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(400).json("Please provide the email")
        }
        const otp = generateVerificationCode()
        const message = `Your OTP code is: ${otp} the expiration time in 5 minutes`
        const subject = `Email Verification`
        const Expiration = Date.now() + 5 * 60 * 1000; // 5 minutes
        sendEmail(email, subject, message)
        const sentUser = await User.findOneAndUpdate({ email }, { expirationCodeTime: Expiration, verifyEmailCode: otp.toString() }, { new: true })
        return res.status(200).json(sentUser.verifyEmailCode);
    } catch (error) {
        console.log(error);
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