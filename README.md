# Heritage Site Reservation System

A full-stack reservation platform for managing heritage site bookings with secure authentication, role-based access control, real-time capacity monitoring, concurrency-safe reservations, and an admin dashboard.

---

# Features

## Authentication & Authorization

- JWT-based authentication
- Secure password hashing using bcrypt
- Role-based access control (Admin/User)
- Protected admin routes
- Protected reservation endpoints

## Reservation Management

- Browse heritage sites
- View available time slots
- Create reservations
- Cancel reservations
- Real-time ticket availability updates
- Prevention of overbooking

## Concurrency Handling

- BullMQ queue for reservation processing
- Redis-backed job queue
- MongoDB transactions for atomic reservation operations
- Concurrency tested under load
- Race condition prevention

## Admin Dashboard

- View capacities across all heritage sites
- Real-time updates using Socket.IO
- Monitor bookings and remaining inventory

## Responsive UI

- Mobile-friendly booking page
- Responsive admin dashboard
- Works across desktop, tablet, and mobile devices

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- BullMQ
- Redis
- Socket.IO

---

# Architecture

```text
Frontend (React + Socket.IO)
        |
        v
Backend (Express + JWT)
        |
        +----------------------+
        |                      |
        v                      v
     BullMQ                 MongoDB
        |                      |
        v                      |
      Redis                    |
        |                      |
        +----------------------+
                 |
                 v
          Socket.IO Events
                 |
                 v
        Admin Dashboard
```

---

# System Workflow

```text
User Request
     |
     v
Express API
     |
     v
BullMQ Queue
     |
     v
Redis
     |
     v
Booking Worker
     |
     v
MongoDB Transaction
     |
     v
Reservation Created
     |
     v
Socket.IO Event
     |
     v
Admin Dashboard Updates
```

---

# Seeded Test Accounts

After running the seed script:

## Admin Account

Email: [admin@test.com](mailto:admin@test.com)

Password: 123456

Role: admin

### Admin Access

- Capacity Dashboard
- Real-Time Monitoring

---

## User Account

Email: [user@test.com](mailto:user@test.com)

Password: 123456

Role: user

### User Access

- Browse Sites
- View Slots
- Create Reservations
- Cancel Reservations

---

# Local Development Setup

## Prerequisites

- Node.js 22+
- MongoDB
- Redis
- Git

---

## Clone Repository

```bash
git clone https://github.com/paritoshXsingh/webisdom-reservation-challenge.git
cd webisdom_assignment
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/webisdom?replicaSet=rs0

JWT_SECRET=your-secret

REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## Frontend Setup

```bash
cd client
npm install
```

---

## Start Redis

```bash
redis-server
```

Verify Redis is running:

```bash
redis-cli ping
```

Expected output:

```text
PONG
```

---

## MongoDB Replica Set Setup

MongoDB transactions require a replica set.

Start MongoDB:

```bash
mongod --replSet rs0
```

Open Mongo Shell:

```bash
mongosh
```

Initialize Replica Set:

```javascript
rs.initiate();
```

Verify:

```javascript
rs.status();
```

Expected:

```text
stateStr: "PRIMARY"
```

---

## Seed Database

```bash
cd server
npm run seed
```

This creates:

- Demo users
- Heritage sites
- Time slots

---

## Start Backend

```bash
cd server
npm run dev
```

---

## Start Frontend

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

# Docker Setup

## Start Application

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

## Seed Docker Database

Open a new terminal:

```bash
docker exec -it webisdom-server sh
```

Run:

```bash
npm run seed
```

---

# Important Docker Note

The provided Docker configuration starts MongoDB as a standalone instance.

Current Docker MongoDB:

```text
MongoDB Standalone
```

Current Local Development MongoDB:

```text
MongoDB Replica Set
```

---

# Why Transactions Work Locally

The reservation workflow uses MongoDB transactions:

```typescript
session.startTransaction()
...
await session.commitTransaction()
```

MongoDB transactions require:

- Replica Set
- or Sharded Cluster

Therefore local development uses a replica set configuration.

---

# Why Docker Does Not Support Transactions By Default

The Docker setup currently starts MongoDB using:

```yaml
mongo:
  image: mongo:7
```

This launches MongoDB as a standalone instance.

Standalone MongoDB instances do not support transactions.

The Docker configuration is intended to demonstrate:

- Containerization
- Service orchestration
- Redis integration
- BullMQ integration
- Frontend deployment
- Backend deployment

without introducing replica-set initialization complexity.

---

# Enabling Transaction Support In Docker

If transaction support is required inside Docker:

### Update docker-compose.yml

```yaml
mongo:
  image: mongo:7
  container_name: webisdom-mongo
  restart: always
  command: ["mongod", "--replSet", "rs0", "--bind_ip_all"]
```

### Start Containers

```bash
docker compose up --build
```

### Open Mongo Shell

```bash
docker exec -it webisdom-mongo mongosh
```

### Initialize Replica Set

```javascript
rs.initiate({
  _id: "rs0",
  members: [
    {
      _id: 0,
      host: "webisdom-mongo:27017",
    },
  ],
});
```

### Update Connection String

```env
MONGO_URI=mongodb://mongo:27017/webisdom?replicaSet=rs0
```

After these changes, MongoDB transactions will function inside Docker exactly as they do in local development.

---

# Concurrency Testing

Run:

```bash
npm run test:concurrency
```

Example output:

```text
{ success: 50, failed: 50 }
```

Available tickets:

```text
100 → 0
```

No overselling occurred.

This validates:

- Queue processing
- Transaction correctness
- Concurrency safety
- Inventory protection

---

# API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

## Sites

### Get Sites

```http
GET /api/sites
```

### Get Site Slots

```http
GET /api/sites/:siteId/slots
```

---

## Reservations

### Create Reservation

```http
POST /api/reservations
```

### Cancel Reservation

```http
DELETE /api/reservations/:reservationId
```

---

## Admin

### Capacity Dashboard

```http
GET /api/admin/capacity
```

---

# Security Features

## Authentication

- JWT-based authentication
- Password hashing using bcrypt

## Authorization

- Role-based access control
- Protected admin endpoints

## IDOR Prevention

- Users can only cancel their own reservations
- Reservation ownership is verified before deletion

## Race Condition Prevention

- BullMQ serializes reservation processing
- MongoDB transactions ensure atomic updates
- Prevents overselling during concurrent requests

## Input Validation

- Request payload validation
- Invalid requests rejected before processing

---

# Project Structure

```text
webisdom_assignment/
│
├── client/
│   ├── src/
│   ├── public/
│   └── Dockerfile
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── queues/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── tests/
│   │
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

# Future Improvements

- Payment integration
- Reservation history page
- Email notifications
- Advanced analytics dashboard
- Multi-day slot management
- Automated Docker replica-set initialization

---

# Author

**Paritosh Singh**

Full Stack Developer

Built as part of the Webisdom Full Stack Engineering Assignment.
