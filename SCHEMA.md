# MongoDB Schema Design

## Overview
This document outlines the database schema design for the Online Certificate Generator application. The database utilizes MongoDB and Mongoose for object modeling.

## Collections
1. **users** - Stores user account information (Admin & Organizers).
2. **certificates** - Stores generated certificates linked to issuers.

---

## 1. User Schema
Stores authentication details and user roles.

### Fields
| Field | Type | Required | Unique | Description |
|---|---|---|---|---|
| `_id` | ObjectId | Yes | Yes | Auto-generated unique identifier |
| `name` | String | Yes | No | Full name of the user |
| `email` | String | Yes | Yes | User's email address (Login ID) |
| `password` | String | Yes | No | Bcrypt hashed password |
| `role` | String | Yes | No | Role based access (`admin`, `organizer`) |
| `createdAt` | Date | Yes | No | Account creation timestamp |

### Indexes
- `email`: Unique index for fast lookup and ensuring no duplicate accounts.

### Relation
- **One-to-Many**: One User can issue multiple Certificates.

### Example User Document
```json
{
  "_id": "651a1b2c3d4e5f6a7b8c9d0e",
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "password": "$2a$10$X7...", 
  "role": "organizer",
  "createdAt": "2023-10-01T10:00:00.000Z"
}
```

---

## 2. Certificate Schema
Stores details of issued certificates.

### Fields
| Field | Type | Required | Unique | Description |
|---|---|---|---|---|
| `_id` | ObjectId | Yes | Yes | Auto-generated unique identifier |
| `certificateId` | String | Yes | Yes | Unique Certificate serial number |
| `issuedBy` | ObjectId | Yes | No | Reference to `User` collection |
| `recipientName` | String | Yes | No | Name of the person receiving the certificate |
| `recipientEmail` | String | Yes | No | Email of the recipient |
| `courseName` | String | Yes | No | Name of the event or course |
| `startDate` | Date | Yes | No | Course start date |
| `endDate` | Date | Yes | No | Course end date |
| `templateUsed` | String | No | No | Design template (`classic`, `modern`, etc.) |
| `grade` | String | No | No | Optional grade or score |
| `createdAt` | Date | Yes | No | Issuance timestamp |

### Indexes
- `certificateId`: Unique index for fast retrieval by ID.
- `issuedBy`: Index for querying all certificates issued by a user.
- `recipientEmail`: Index for searching records by recipient.
- `createdAt`: Index for sorting by date.

### Relation
- **Belongs-to**: Each Certificate belongs to one User (Issuer).

### Example Certificate Document
```json
{
  "_id": "652b2c3d4e5f6a7b8c9d0e1f",
  "certificateId": "CERT-1696245600000-123",
  "issuedBy": "651a1b2c3d4e5f6a7b8c9d0e", // References User
  "recipientName": "Jane Doe",
  "recipientEmail": "jane@example.com",
  "courseName": "Advanced Web Development",
  "startDate": "2023-09-01T00:00:00.000Z",
  "endDate": "2023-09-30T00:00:00.000Z",
  "templateUsed": "modern",
  "grade": "A+",
  "createdAt": "2023-10-05T14:30:00.000Z"
}
```

---

## Validation Rules
- **Email Regex**: `^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$`
- **Role Enum**: Must be either `admin` or `organizer`.
- **Template Enum**: Must be one of `classic`, `modern`, `professional`, `creative`, `academic`, `achievement`.

## Performance Considerations
- **Indexing**: Frequent queries filter by `issuedBy` (dashboard view) and `recipientEmail` (search), so indexes are applied.
- **Pagination**: The API supports `skip` and `limit` to handle large datasets efficiently.
