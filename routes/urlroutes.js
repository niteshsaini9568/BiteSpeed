const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

router.post("/identify", mainController.identity);

module.exports = router;