require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const dataModel = require("../models/Model");

const MONGO_URL = "";

const dummyContacts = [
    {
        phoneNumber: 9876543210,
        email: "alice.johnson@gmail.com",
        linkedId: null,
        linkPrecedence: "primary",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 9876543211,
        email: "alice.work@company.in",
        linkedId: null,
        linkPrecedence: "secondary",
        createdAt: new Date("2024-02-10T14:20:00Z"),
        updatedAt: new Date("2024-02-10T14:20:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 7654321098,
        email: "bob.smith@yahoo.com",
        linkedId: null,
        linkPrecedence: "primary",
        createdAt: new Date("2024-03-05T09:15:00Z"),
        updatedAt: new Date("2024-03-05T09:15:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 7654321099,
        email: "bsmith@startup.com",
        linkedId: null,
        linkPrecedence: "secondary",
        createdAt: new Date("2024-03-20T16:45:00Z"),
        updatedAt: new Date("2024-03-20T16:45:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 9123456789,
        email: "priya.sharma@hotmail.com",
        linkedId: null,
        linkPrecedence: "primary",
        createdAt: new Date("2023-11-12T11:00:00Z"),
        updatedAt: new Date("2023-11-12T11:00:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 9345678901,
        email: "priya.alt@hotmail.com",
        linkedId: null,
        linkPrecedence: "secondary",
        createdAt: new Date("2024-01-08T13:10:00Z"),
        updatedAt: new Date("2024-01-08T13:10:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 9812345678,
        email: "rahul.kumar@outlook.com",
        linkedId: null,
        linkPrecedence: "primary",
        createdAt: new Date("2024-04-01T08:00:00Z"),
        updatedAt: new Date("2024-04-01T08:00:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 7890123456,
        email: "rahul.work@outlook.com",
        linkedId: null,
        linkPrecedence: "secondary",
        createdAt: new Date("2024-04-15T12:30:00Z"),
        updatedAt: new Date("2024-04-15T12:30:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 9876543212,
        email: "neha.patel@gmail.com",
        linkedId: null,
        linkPrecedence: "primary",
        createdAt: new Date("2024-02-25T17:40:00Z"),
        updatedAt: new Date("2024-02-25T17:40:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 9876543222,
        email: "neha@ecommerce.in",
        linkedId: null,
        linkPrecedence: "secondary",
        createdAt: new Date("2024-03-10T10:55:00Z"),
        updatedAt: new Date("2024-03-10T10:55:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 8901234567,
        email: "vikram.singh@yahoo.co.in",
        linkedId: null,
        linkPrecedence: "primary",
        createdAt: new Date("2023-12-05T15:20:00Z"),
        updatedAt: new Date("2023-12-05T15:20:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 8901234577,
        email: "vikram@freelance.dev",
        linkedId: null,
        linkPrecedence: "secondary",
        createdAt: new Date("2024-01-22T09:45:00Z"),
        updatedAt: new Date("2024-01-22T09:45:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 9876543213,
        email: "sneha.mishra@gmail.com",
        linkedId: null,
        linkPrecedence: "primary",
        createdAt: new Date("2024-05-18T14:10:00Z"),
        updatedAt: new Date("2024-05-18T14:10:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 9345678902,
        email: "sneha.alt@gmail.com",
        linkedId: null,
        linkPrecedence: "secondary",
        createdAt: new Date("2024-06-02T11:25:00Z"),
        updatedAt: new Date("2024-06-02T11:25:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 7012345678,
        email: "arjun.reddy@protonmail.com",
        linkedId: null,
        linkPrecedence: "primary",
        createdAt: new Date("2024-01-30T08:50:00Z"),
        updatedAt: new Date("2024-01-30T08:50:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 7012345679,
        email: "arjun@consulting.co.in",
        linkedId: null,
        linkPrecedence: "secondary",
        createdAt: new Date("2024-02-14T16:15:00Z"),
        updatedAt: new Date("2024-02-14T16:15:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 9123456888,
        email: "rohan.das@yahoo.com",
        linkedId: null,
        linkPrecedence: "primary",
        createdAt: new Date("2023-10-20T10:00:00Z"),
        updatedAt: new Date("2023-10-20T10:00:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 7654321090,
        email: "rohan.alt@yahoo.com",
        linkedId: null,
        linkPrecedence: "secondary",
        createdAt: new Date("2024-03-01T13:30:00Z"),
        updatedAt: new Date("2024-03-01T13:30:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 9876543216,
        email: "aditya.venkat@icloud.com",
        linkedId: null,
        linkPrecedence: "primary",
        createdAt: new Date("2024-04-10T09:20:00Z"),
        updatedAt: new Date("2024-04-10T09:20:00Z"),
        deletedAt: new Date(0),
    },
    {
        phoneNumber: 9876543217,
        email: "aditya@financepro.com",
        linkedId: null,
        linkPrecedence: "secondary",
        createdAt: new Date("2024-04-25T15:40:00Z"),
        updatedAt: new Date("2024-04-25T15:40:00Z"),
        deletedAt: new Date(0),
    },
];

async function main() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB for initialization.");
        
        await dataModel.deleteMany({});
        console.log("Cleared existing data.");

        await dataModel.collection.dropIndexes();
        console.log("Dropped old indexes.");


        await dataModel.insertMany(dummyContacts);
        console.log("Successfully inserted 20 dummy data items.");

    } catch (error) {
        console.error("Error initializing data:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
}

main();