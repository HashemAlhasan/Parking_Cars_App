import { expect } from 'chai';
import * as chai from '../node_modules/chai/chai.js';
import chaiHttp from 'chai-http';
import server from '../app.js';
import axios from 'axios';
import mongoose from 'mongoose';
import sinon from 'sinon';
chai.use(chaiHttp);

describe("Car Problems Function Test", () => {

    before(function () {
        try {
            mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 50000 });
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    });

    // Disconnect from MongoDB after tests are completed
    after(function () {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    });

    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });


    describe("Select problem function test", async () => {
        it("Should return statuse code 200 and message: Done Sucessfuly", async () => {
            try {
                const userInfo = {
                    username: "johndoe",
                    problems: "Light Off",
                    problemType: "Electric"
                };
                const response = await axios.post("http://localhost:3000/api/problem/selectproblem", userInfo);
                expect(response.status).to.be.equal(200);
                expect(response.data).property('message').to.be.equal('Done Sucessfuly ');
            } catch (error) {
                throw error;
            }
        })
    });

    describe("Add problem function test", async () => {
        it("Should return status code 201 the new car problem as json object", async () => {
            try {
                const problemInfo = {
                    ProblemType: "Battery",
                    Name: "Change battery",
                    image: "kjdldlkjsda",
                    duration: 3,
                    Price: 100
                };
                const response = await axios.post("http://localhost:3000/api/problem/addProblem", problemInfo);
                expect(response.status).to.be.equal(201);
                expect(response.data.ProblemType).to.be.equal("Battery");
                expect(response.data.Price).to.be.equal(100);
            } catch (error) {
                throw error;
            }
        })
    });

    describe("Find problems by type function test", async () => {
        it("Should return statuse code 200 and array of problems of the entered type", async () => {
            try {
                const problemInfo = {
                    ProblemType: "Battery"
                };
                const response = await axios.post("http://localhost:3000/api/problem/getProblemType", problemInfo);
                expect(response.status).to.be.equal(200);
                expect(response.data).to.be.an('array');
            } catch (error) {
                throw error;
            }
        })
    });


    describe("Booking repaire park function test", async () => {
        it("Should return status code 200 and the location of park and the price of problem", async () => {
            try {
                const orderInfo = {
                    Problem: "Change battery",
                    parkNumber: 101,
                    userName: "khder16"
                }
                const response = await axios.post("http://localhost:3000/api/problem/orderproblem", orderInfo);
                expect(response.status).to.be.equal(200);
                expect(response.data.Location).to.be.equal("Main Parking Lot");
                expect(response.data.Price).to.be.equal(100);


            } catch (error) {
                throw error
            }
        })
    });


    describe("Get Parking Locations function test", async () => {
        it("Should return statuse code 200 and the parking name : Main Parking Lot 2 ", async () => {
            try {
                const userLocationInfo = {
                    userLatitude: -73.935236,
                    userLongitude: 40.73046
                };
                const response = await axios.post("http://localhost:3000/api/problem/getRepairPlaces", userLocationInfo);
                expect(response.status).to.be.equal(200);
                expect(response.data.parkingLocations[0].location.parkingName).to.be.equal("Main Parking Lot 2");
            } catch (error) {
                throw error
            }
        })
    })
});