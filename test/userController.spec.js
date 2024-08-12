import { expect } from 'chai';
import * as chai from '../node_modules/chai/chai.js';
import chaiHttp from 'chai-http';
import server from '../app.js';
import sinon from 'sinon';
import axios from 'axios';
import User from '../modules/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { login } from '../controllers/user.js';
import mongoose from 'mongoose';
chai.use(chaiHttp);
before(async () => {
        try {
                await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 20000 });
                console.log('Connected to MongoDB');
        } catch (error) {
                console.error('MongoDB connection error:', error);
                throw error;
        }
});

// Disconnect from MongoDB after tests are completed
after(async function () {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
});

let sandbox;

beforeEach(() => {
        sandbox = sinon.createSandbox();
});

afterEach(() => {
        sandbox.restore();
});
describe("User Controller Test", function () {
        // Login function test
        describe("Login User Test", () => {
                this.timeout(20000);


                it("It should return a Success message and user token", async function () {
                        // this.timeout(2000000); // Increase timeout for this test case
                        try {
                                // const userInfo = {
                                //         email: "khderhabeb16@gmail.com",
                                //         password: "123456"
                                // };
                                // const response = await axios.post("http://localhost:3000/api/user/login", userInfo);
                                // expect(response.status).to.equal(200);
                                // expect(response.data).to.be.an('object');
                                // expect(response.data).to.have.property('message').that.is.a('string');
                                // expect(response.data).to.have.property('token').that.is.a('string');
                                // const fakeUser = {
                                //         email: "khderhabeb16@gmail.com",
                                //         password: await bcrypt.hash("123456", 10),
                                //         emailVerified: true,
                                //         comparePassword: sinon.stub().resolves(true),
                                //         generateAuthToken: sinon.stub().returns("fakeToken")
                                // };

                                // sandbox.stub(User, 'findOne').resolves(fakeUser);
                                // sandbox.stub(bcrypt, 'compare').resolves(true);
                                // sandbox.stub(jwt, 'sign').returns("fakeToken");

                                const userInfo = {
                                        email: "khderhabeb16@gmail.com",
                                        password: "123456"
                                };

                                const req = {
                                        body: userInfo,
                                        cookies: {}
                                };

                                const res = {
                                        status: sinon.stub().returnsThis(),
                                        json: sinon.stub(),
                                        cookie: sinon.stub()
                                };

                                await login(req, res);

                                // Debugging output
                                console.log(res.status.getCall(0).args[0]); // Should be 200
                                console.log(res.json.getCall(0).args[0]); // Should be the JSON response

                                expect(res.status.calledWith(200)).to.be.true;
                                expect(res.json.calledWith(sinon.match({
                                        message: sinon.match.string,
                                        token: "fakeToken"
                                }))).to.be.true;
                        } catch (error) {
                                throw error;
                        }
                });

                // Reset Password function test
                describe("forgot Password Test", () => {
                        it("Should return statuse Code 200 and message: Password reset code sent", async () => {
                                this.timeout(20000000);
                                try {
                                        const userInfo = {
                                                email: "khderhabeb16@gmail.com",
                                                password: "123456"
                                        };
                                        const response = await axios.post("http://localhost:3000/api/user/forgotpassword", userInfo);
                                        expect(response.status).to.equal(200);
                                        expect(response.data).to.have.property('message').equal("Password reset email sent").that.is.a('string');
                                } catch (error) {
                                        throw error;
                                }
                        });
                })


                // Register User Test
                describe("Register user function", () => {
                        it("Should return statuse code:200 and message:Done Sucessfuly", async () => {
                                this.timeout(20000000);
                                try {
                                        const userInfo = {
                                                email: "sde1133wdsd1t2@gmail.com",
                                                password: "1234sadsd56",
                                                confirmPassword: "1234sadsd56",
                                                username: "kh152223", //Change userName and email for testing correct
                                                firstName: "Khder",
                                                lastName: "Habeb",
                                                carNumber: 1222,
                                                carType: "SUV",
                                                carModel: "BMW",
                                        };
                                        const response = await axios.post("http://localhost:3000/api/user/register", userInfo);
                                        expect(response.status).to.equal(200);
                                        expect(response.data).to.have.property('message').equal('Done Sucessfuly')
                                } catch (error) {
                                        throw error
                                }
                        })
                })
        });
});
