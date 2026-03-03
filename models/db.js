const mongoose = require("mongoose");

MONGO_URL = process.env.MONGO_URL;

module.exports.main = async()=>{
    try {
        await mongoose.connect(MONGO_URL).then(() => {
            console.log("Connected to MongoDB");
        }).catch((err) => {
            console.log("Error connecting to MongoDB", err);
        })
    } catch (error) {
        console.log("There is something issue related to Database")
    }
}