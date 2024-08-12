import { expect } from 'chai';
import * as chai from '../node_modules/chai/chai.js';
import chaiHttp from 'chai-http';
import server from '../app.js';
import axios from 'axios';
import mongoose from 'mongoose';
import sinon from 'sinon';
chai.use(chaiHttp);

describe("Order Controller Tests",  () => {

    before(async function () {
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
    // Login function test
    describe("Login User Test", async () => {
        // this.timeout(20000);
        it("Shloud return statuse code 200 and list of orders as an object", async () => {
            try {
                const userInfo = {
                    username: "johndoe"
                }
                const response = await axios.post("http://localhost:3000/api/orders/getParkingOrders", userInfo);
                expect(response.status).to.be.equal(200);
                expect(response.data).to.be.an('array');
            } catch (error) {
                throw error
            }
        })
    });


    describe("Get Orders Test", async () => {
        it("Shloud return statuse code 200 and list of repair orders as an object", async () => {
            try {
                const userInfo = {
                    username: "johndoe"
                }
                const response = await axios.post("http://localhost:3000/api/orders/getParkingOrders", userInfo);
                expect(response.status).to.be.equal(200);
                expect(response.data).to.be.an('array');
            } catch (error) {
                throw error
            }
        })
    });

    describe("Delete Order Test", async () => {
        it("Should return statuse code 400 and message Could not find the order", async () => {
            try {
                const orderInfo = {
                    id: "66aacac6fb473a19a3e2bc51" // change this 
                };
                const response = await axios.post("http://localhost:3000/api/orders/deleteOrder", orderInfo);
                expect(response.status).to.be.equal(200);
                expect(response.data.message).to.be.equal("Could'nt find the order");
            } catch (error) {
                throw error;
            }
        })
    })
})
