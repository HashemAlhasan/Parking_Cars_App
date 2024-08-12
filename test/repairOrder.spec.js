import { expect } from 'chai';
import * as chai from '../node_modules/chai/chai.js';
import chaiHttp from 'chai-http';
import server from '../app.js';
import axios from 'axios';
import mongoose from 'mongoose';
import sinon from 'sinon';
chai.use(chaiHttp);



before(async function () {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 50000 });
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


describe("Repair Order Test",  () => {
    describe("Get all repair orders list function", async () => {
        it("Should return status code 200 and array of orders", async () => {
            try {
                const response = await axios.post("http://localhost:3000/api/Admin/getAll-repairOrder");
                expect(response.status).to.be.equal(200);
                expect(response.data).to.be.an('array');
            } catch (error) {
                throw error;
            }
        });
    });

})