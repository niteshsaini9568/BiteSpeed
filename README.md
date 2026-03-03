# Bitespeed Backend Task: Identity Reconciliation

A web service that identifies and consolidates customer contact information across multiple purchases. Built as part of the **Bitespeed Backend Task**.

## Problem Statement

An online store (FluxKart.com) needs to link different orders made with different contact information (email/phone) to the same person. This service receives contact details and returns a consolidated view of the customer's identity by linking related contacts together.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | MongoDB ODM |
| **dotenv** | Environment variable management |

## Project Structure

```
ByteSpeed/
├── controllers/
│   └── mainController.js    # Core identity reconciliation logic
├── models/
│   ├── Model.js             # Mongoose Contact schema
│   └── db.js                # MongoDB connection handler
├── routes/
│   └── urlroutes.js         # API route definitions
├── init/
│   └── initData.js          # Script to seed dummy data
├── index.js                 # App entry point
├── .env                     # Environment variables
└── package.json
```

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a cloud URI)

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ByteSpeed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```
   MONGO_URL=mongodb://localhost:27017/bytespeed
   ```

4. **Seed the database (optional)**
   ```bash
   node init/initData.js
   ```

5. **Start the server**
   ```bash
   npx nodemon index.js
   ```

   Server will start on `http://localhost:3000`

## API Endpoint

### `POST /identify`

Receives a customer's contact details and returns a consolidated identity.

**Request Body** (JSON):
```json
{
  "email": "string (optional)",
  "phoneNumber": "number (optional)"
}
```
> At least one of `email` or `phoneNumber` must be provided.

**Response** (HTTP 200):
```json
{
  "contact": {
    "primaryContatctId": "ObjectId",
    "emails": ["primary@email.com", "secondary@email.com"],
    "phoneNumbers": ["123456", "789012"],
    "secondaryContactIds": ["ObjectId1", "ObjectId2"]
  }
}
```

## Database Schema — Contact

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated unique identifier |
| `phoneNumber` | String (nullable) | Customer's phone number |
| `email` | String (nullable) | Customer's email address |
| `linkedId` | ObjectId (nullable) | Reference to the primary contact's `_id`. `null` for primary contacts |
| `linkPrecedence` | String | Either `"primary"` or `"secondary"` |
| `createdAt` | Date | Timestamp of creation |
| `updatedAt` | Date | Timestamp of last update |
| `deletedAt` | Date (nullable) | Soft delete timestamp |

## Identity Reconciliation — How It Works

The `/identify` endpoint handles **3 distinct cases** based on the incoming request:

### Case 1: No Existing Match → New Primary Contact

If neither the `email` nor `phoneNumber` matches any existing contact in the database, a **new primary contact** is created.

```
Request: { "email": "new@user.com", "phoneNumber": "999999" }

Database: No match found

Result: Creates a new contact with linkPrecedence = "primary"
```

### Case 2: Partial Match → New Secondary Contact

If the incoming request shares an `email` OR `phoneNumber` with an existing contact but also contains **new information**, a **secondary contact** is created and linked to the primary.

```
Existing DB:
  { id: 1, email: "alice@mail.com", phone: "123456", linkPrecedence: "primary" }

Request: { "email": "alice.work@mail.com", "phoneNumber": "123456" }
                      ↑ new email              ↑ matches existing

Result: Creates a new secondary contact linked to id: 1
  { id: 2, email: "alice.work@mail.com", phone: "123456", linkedId: 1, linkPrecedence: "secondary" }
```

### Case 3: Two Primaries Linked → Merge

If the request links two **previously separate primary contacts** (e.g., the email belongs to one primary and the phone belongs to another), the **newer primary is demoted to secondary** and linked to the older one.

```
Existing DB:
  { id: 11, email: "george@mail.com", phone: "919191", linkPrecedence: "primary" }
  { id: 27, email: "biff@mail.com",   phone: "717171", linkPrecedence: "primary" }

Request: { "email": "george@mail.com", "phoneNumber": "717171" }
              ↑ matches id:11               ↑ matches id:27

Result: id:11 stays primary (older), id:27 becomes secondary
  { id: 27, linkedId: 11, linkPrecedence: "secondary", updatedAt: <now> }
```

##  System Flow Diagram

```
              ┌──────────────────────────┐
              │   POST /identify         │
              │   { email, phoneNumber } │
              └────────────┬─────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │  Validate Input          │
              │  (at least one required) │
              └────────────┬─────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │  Search DB               │
              │  email OR phoneNumber    │
              └────────────┬─────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌──────────────┐    ┌──────────────────┐
        │  No Match    │    │  Matches Found   │
        │              │    │                  │
        │  Create new  │    │  Find all        │
        │  PRIMARY     │    │  primary IDs     │
        │  contact     │    │  involved        │
        │              │    │                  │
        │  Return      │    └────────┬─────────┘
        │  response    │             │
        └──────────────┘    ┌────────┴─────────┐
                            │                  │
                            ▼                  ▼
                   ┌──────────────┐  ┌──────────────────┐
                   │  1 Primary   │  │  2+ Primaries    │
                   │              │  │                  │
                   │              │  │  Older stays     │
                   │              │  │  PRIMARY         │
                   │              │  │                  │
                   │              │  │  Newer becomes   │
                   │              │  │  SECONDARY       │
                   └──────┬───────┘  └────────┬─────────┘
                          │                   │
                          └─────────┬─────────┘
                                    │
                                    ▼
                       ┌──────────────────────┐
                       │  Has new info?       │
                       │  (new email/phone    │
                       │   not in group)      │
                       └────────────┬─────────┘
                            ┌───────┴───────┐
                            │               │
                            ▼               ▼
                     ┌────────────┐  ┌────────────┐
                     │   YES      │  │    NO      │
                     │            │  │            │
                     │  Create    │  │  Skip      │
                     │  SECONDARY │  │            │
                     └─────┬──────┘  └──────┬─────┘
                           │                │
                           └───────┬────────┘
                                   │
                                   ▼
                       ┌──────────────────────┐
                       │  Build consolidated  │
                       │  response            │
                       │                      │
                       │  - All emails        │
                       │  - All phoneNumbers  │
                       │  - All secondary IDs │
                       └────────────┬─────────┘
                                    │
                                    ▼
                       ┌──────────────────────┐
                       │  Return HTTP 200     │
                       │  { contact: {...} }  │
                       └──────────────────────┘
```

## Testing with Postman

Use **POST** method with **raw JSON** body:

**URL:** `http://localhost:3000/identify`

### Test 1: New Customer
```json
{
  "email": "doc@hillvalley.edu",
  "phoneNumber": "5551985"
}
```
Expected: Creates a new primary contact.

### Test 2: Same Phone, New Email (Creates Secondary)
```json
{
  "email": "emmett@timetravel.com",
  "phoneNumber": "5551985"
}
```
Expected: Creates a secondary contact linked to the primary from Test 1.

### Test 3: Lookup Existing Contact
```json
{
  "email": "doc@hillvalley.edu",
  "phoneNumber": null
}
```
Expected: Returns consolidated contact with all linked emails, phones, and secondary IDs.

## Notes

- Use **JSON Body** (not form-data) for all request payloads
- The `primaryContatctId` field name matches the assignment specification
- Primary contact is always the **oldest** contact in a linked group
- `deletedAt` is reserved for soft-delete functionality

---

Built for Bitespeed 
