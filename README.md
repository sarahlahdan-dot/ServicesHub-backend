# ServiceHub — Backend
 
REST API + real-time server for ServiceHub, a local consumer services marketplace for Bahrain.
 
**Stack:** Node.js · Express · MongoDB (Mongoose) · Socket.io · JWT Auth
 
---
 
## Setup
 
```bash
npm install
```
 
Create a `.env` file in the root:
 
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/servicehub
JWT_SECRET=your-secret-key
PORT=3000
FRONTEND_URL=http://localhost:5173
```
 
```bash
npm run dev
```
 
Server runs on `http://localhost:3000`
 
---
 
## API Routes
 
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Register (name, email, password, role) |
| POST | `/api/auth/login` | — | Login → returns JWT |
| GET | `/api/auth/verify` | ✅ | Verify token |
| GET | `/api/services` | — | List services (`?category=` `?search=`) |
| POST | `/api/services` | provider | Create service |
| GET | `/api/services/:id` | — | Get one service |
| PUT | `/api/services/:id` | provider | Update own service |
| DELETE | `/api/services/:id` | provider | Delete own service |
| POST | `/api/bookings` | customer | Create booking |
| GET | `/api/bookings/mine` | customer | My bookings |
| GET | `/api/bookings/provider` | provider | Incoming bookings |
| PATCH | `/api/bookings/:id/status` | provider | Update status |
| GET | `/api/bookings/:id/chat` | party | Get chat history |
| POST | `/api/bookings/:id/chat` | party | Send chat message |
| POST | `/api/reviews/:bookingId` | customer | Submit review |
| GET | `/api/reviews/service/:id` | — | Get service reviews |
| GET | `/api/admin/stats` | admin | Platform stats |
| GET | `/api/admin/users` | admin | All users |
 
---
 
## Socket.io Events
 
| Event | Direction | Description |
|-------|-----------|-------------|
| `joinUserRoom(userId)` | client → server | Join personal notification room |
| `joinRoom(bookingId)` | client → server | Join booking chat room |
| `leaveRoom(bookingId)` | client → server | Leave booking chat room |
| `booking:statusUpdate` | server → client | Status changed (to booking room) |
| `notification:new` | server → client | New booking or status alert (to user room) |
| `message:new` | server → client | New chat message (to booking room) |
 
---
 
## Roles
 
- **customer** — browse services, create bookings, chat, leave reviews
- **provider** — create services, manage bookings, chat
- **admin** — view stats and all users