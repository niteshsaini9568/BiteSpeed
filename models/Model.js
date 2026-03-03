const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    linkedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bytespeed",
        default: null
    },
    linkPrecedence: {
        type: String,
        enum: ["primary", "secondary"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
    }
});

const Contact = mongoose.model("bytespeed", contactSchema);

module.exports = Contact;