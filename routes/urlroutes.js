const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

router.get("/", (req, res) => {
    res.send("Welcome to the ByteSpeed Backend Task - Identity Reconciliation API, Hope you read the complete readme file to understand the task.");
});

router.post("/identify", mainController.identity);

module.exports = router;