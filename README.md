# Heritage Site Reservation System

A full-stack reservation platform for managing heritage site bookings with secure authentication, role-based access control, real-time capacity monitoring, concurrency-safe reservations, and an admin dashboard.

## Features

### Authentication & Authorization

- JWT-based authentication
- Secure password hashing using bcrypt
- Role-based access control (Admin/User)
- Protected routes for admin operations

### Reservation Management

- Browse heritage sites and available time slots
- Create reservations
- Cancel reservations
- Real-time ticket availability updates
- Prevention of overbooking

### Concurrency Handling

- BullMQ queue for reservation processing
- Redis-backed job queue
- MongoDB transactions for atomic reservation operations
- Tested under concurrent load to prevent race conditions

### Admin Dashboard

- View all site capacities
- Real-time capacity updates using Socket.IO
- Monitor ticket availability across all sites

### Responsive UI

- Mobile-friendly design
- Responsive dashboard
- Responsive booking interface

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

# System Architecture

User Request
↓
Express API
↓
BullMQ Queue
↓
Redis
↓
Booking Worker
↓
MongoDB Transaction
↓
Reservation Created
↓
Socket.IO Event
↓
Admin Dashboard Updates

---

# Seeded Test Accounts

After running the seed script:

## Admin Account

Email:
[admin@test.com](mailto:admin@test.com)

Password:
123456

Role:
admin

## User Account

Email:
[user@test.com](mailto:user@test.com)

Password:
123456

Role:
user

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
git clone <repository-url>
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

Ubuntu:

```bash
redis-server
```

Verify:

```bash
redis-cli ping
```

Expected:

```bash
PONG
```

---

## MongoDB Replica Set Setup

MongoDB transactions require a replica set.

Start MongoDB with replica set enabled:

```bash
mongod --replSet rs0
```

Open mongosh:

```bash
mongosh
```

Initialize replica set:

```javascript
rs.initiate();
```

Verify:

```javascript
rs.status();
```

Expected:

```javascript
stateStr: "PRIMARY";
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
session.commitTransaction()
```

MongoDB transactions require:

- Replica Set
  or
- Sharded Cluster

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
- Frontend and backend deployment

without additional replica set initialization complexity.

---

# Enabling Transaction Support In Docker

To enable transaction support inside Docker:

### Update docker-compose.yml

Replace Mongo service with:

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

The system was tested using concurrent reservation requests.

Example result:

```text
Success: 50
Failed: 50
```

Available tickets:

```text
100 → 0
```

No overselling occurred.

This validates:

- Transaction correctness
- Queue processing
- Concurrency safety

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

- JWT Authentication
- Password Hashing using bcrypt
- Role-based authorization
- Input validation
- Protected admin routes
- Secure reservation processing

---

# Future Improvements

- Payment Integration
- Email Notifications
- Reservation History
- Advanced Analytics Dashboard
- Multi-day Slot Management
- Docker Replica Set Automation

---

# Author

Paritosh Singh

Full Stack Developer

Built as part of the Webisdom Backend Assignment.
