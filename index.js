require("dotenv").config();

const express = require("express");
const urlroutes = require("./routes/urlroutes.js");
const db = require("./models/db.js");
const app = express();

app.use(express.json());

db.main();
app.use(express.urlencoded({ extended: true }));
app.use("/", urlroutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

