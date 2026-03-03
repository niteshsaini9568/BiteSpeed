const Contact = require("../models/Model");

module.exports.identity = async (req, res) => {
    try {
        const { phoneNumber, email } = req.body;

        const conditions = [];
        if (email) conditions.push({ email });
        if (phoneNumber) conditions.push({ phoneNumber: String(phoneNumber) });

        if (conditions.length === 0) {
            return res.status(400).json({ error: "At least email or phoneNumber is required" });
        }


        const matchingContacts = await Contact.find({ $or: conditions });

        if (matchingContacts.length === 0) {
            const newContact = await Contact.create({
                phoneNumber: phoneNumber ? String(phoneNumber) : null,
                email: email || null,
                linkedId: null,
                linkPrecedence: "primary",
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            });

            return res.status(200).json({
                contact: {
                    primaryContatctId: newContact._id,
                    emails: email ? [email] : [],
                    phoneNumbers: phoneNumber ? [String(phoneNumber)] : [],
                    secondaryContactIds: [],
                },
            });
        }

        const primaryIds = new Set();
        for (const contact of matchingContacts) {
            if (contact.linkPrecedence === "primary") {
                primaryIds.add(contact._id.toString());
            } else if (contact.linkedId) {
                primaryIds.add(contact.linkedId.toString());
            }
        }

        const primaryContacts = await Contact.find({
            _id: { $in: Array.from(primaryIds) },
        }).sort({ createdAt: 1 });

        const truePrimary = primaryContacts[0];

        if (primaryContacts.length > 1) {
            for (let i = 1; i < primaryContacts.length; i++) {
                await Contact.updateOne(
                    { _id: primaryContacts[i]._id },
                    {
                        linkPrecedence: "secondary",
                        linkedId: truePrimary._id,
                        updatedAt: new Date(),
                    }
                );

                await Contact.updateMany(
                    { linkedId: primaryContacts[i]._id },
                    { linkedId: truePrimary._id, updatedAt: new Date() }
                );
            }
        }

        const allLinkedContacts = await Contact.find({
            $or: [
                { _id: truePrimary._id },
                { linkedId: truePrimary._id },
            ],
        }).sort({ createdAt: 1 });

        const existingEmails = new Set(
            allLinkedContacts.map((c) => c.email).filter(Boolean)
        );
        const existingPhones = new Set(
            allLinkedContacts.map((c) => c.phoneNumber).filter(Boolean)
        );

        const hasNewEmail = email && !existingEmails.has(email);
        const hasNewPhone = phoneNumber && !existingPhones.has(String(phoneNumber));

        if (hasNewEmail || hasNewPhone) {
            await Contact.create({
                phoneNumber: phoneNumber ? String(phoneNumber) : null,
                email: email || null,
                linkedId: truePrimary._id,
                linkPrecedence: "secondary",
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            });
        }

        const finalContacts = await Contact.find({
            $or: [
                { _id: truePrimary._id },
                { linkedId: truePrimary._id },
            ],
        }).sort({ createdAt: 1 });

        const emails = [];
        const phoneNumbers = [];
        const secondaryContactIds = [];

        for (const contact of finalContacts) {
            if (contact.email && !emails.includes(contact.email)) {
                emails.push(contact.email);
            }
            if (contact.phoneNumber && !phoneNumbers.includes(contact.phoneNumber)) {
                phoneNumbers.push(contact.phoneNumber);
            }
            if (contact.linkPrecedence === "secondary") {
                secondaryContactIds.push(contact._id);
            }
        }

        return res.status(200).json({
            contact: {
                primaryContatctId: truePrimary._id,
                emails,
                phoneNumbers,
                secondaryContactIds,
            },
        });
    } catch (error) {
        console.error("Error in /identify:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};