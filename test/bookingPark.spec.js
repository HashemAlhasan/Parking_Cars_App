import { expect } from 'chai';
import * as chai from '../node_modules/chai/chai.js';
import chaiHttp from 'chai-http';
import server from '../app.js';
import axios from 'axios';
import mongoose from 'mongoose';
import sinon from 'sinon';
chai.use(chaiHttp);




describe("Booking Park Test", () => {
    describe("Booking Park Test Function", async () => {
        it("Should return status 200 and booked Park Informations", async () => {
            // this.timeout(200000);
            try {
                const bookingInfo = {
                    username: "johndoe",
                    duration: 2,
                    Spot: 1,
                    date: "01:00",
                    parkingName: "Main Parking Lot"
                }
                const response = await axios.post("http://localhost:3000/api/parking/bookingPark", bookingInfo);
                expect(response.status).to.equal(200);
                expect(response.data).to.have.property('Price');
                expect(response.data).to.have.property('bookingEndTime');
                expect(response.data).to.have.property('parkingName').to.equal("Main Parking Lot");
            } catch (error) {
                throw error
            }
        });
    })
    describe("Booking Park  Repair Test Function", async () => {
        it("Shloud return statuse code 200 and number of booked park repair", async () => {
            try {
                const bookingInfo = {
                    username: "johndoe",
                    parkNumber: 1,
                    Problem: "Heat"
                }
            } catch (error) {
                throw error
            }
        })
    });

    describe("AddPark  Repair Test Function", async () => {
        it("Shloud return statuse code 200 and number of booked park repair", async () => {

            try {

                const addParkInfo = {
                    location: {
                        type: "Point",
                        parkingName: "Main Parking Lot 2",
                        parkingNumber: 109, //edit this after each test
                        coordinates: [-73.935233, 40.73044]
                    },
                    park: {
                        duration: 2,
                        parkNumber: 1,
                        filled: false,
                        carNumber: "12223",
                        bookingEndTime: Date.now()
                    },
                    carRepairPlaces: { carRepairNumber: 2, filled: false, carNumber: null },
                    Price: 122,
                    AdminEmail: "kkk@gmail.com"
                }
                const response = await axios.post("http://localhost:3000/api/parking/addparking", addParkInfo);
                expect(response.status).to.equal(200);
                expect(response.data.newParking).which.is.an('object').and.has.property('location')
            } catch (error) {
                throw error
            }
        })
    })

    describe("Get Closest Park To User", async () => {
        it("Shloud return statuse code 200 and the parking name is :Main Parking Lot", async () => {
            try {
                const userInfo =
                {
                    userLatitude: 40.73061,
                    userLongitude: -73.935242
                }

                const response = await axios.post("http://localhost:3000/api/parking/getclosestpark", userInfo);
                expect(response.status).to.equal(200);
                expect(response.data.parkingLocations).which.is.an('array')
                expect(response.data.parkingLocations.filter(parking => parking.location.parkingName.includes('Main Parking Lot')));
                expect(response.data.parkingLocations[0].location.parkingName).to.be.equal('Main Parking Lot');
            } catch (error) {
                throw error
            }
        })
    });

    describe("Get Parking Spots Function Test", async () => {
        it("Should return status 200 and list of empty spots", async () => {
            try {
                const parkingInfo = {
                    ParkingNumber: 101
                };
                const response = await axios.post("http://localhost:3000/api/parking/getParkingSpots", parkingInfo)
                expect(response.status).to.be.equal(200);
                expect(response.data).to.have.property("location");
                expect(response.data.location.parkingName).to.be.equal("Main Parking Lot");
            } catch (error) {
                throw error
            }
        })
    });

    describe("Parking Timer Function Test", async () => {
        it("Should return statuse code 200 and message about user time ", async () => {
            try {
                const userInfo = {
                    username:"johndoe"
                }
                const response = await axios.post("http://localhost:3000/api/parking/ParkingTimer",userInfo);
                expect(response.status).to.equal(200);
                expect(response.data).have.property('message').to.be.equal("Parking Time Has Ended")
                expect(response.data).have.property('hours').to.be.equal(0);
                expect(response.data).have.property('minutes').to.be.equal(0);
                expect(response.data).have.property('seconds').to.be.equal(0);
            } catch (error) {
                throw error
            }
        })
    });

    
})