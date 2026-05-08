# MeshPay

> Premium fintech payment platform — online & offline payments, budget tracking, and more.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 |
| Styling | Vanilla CSS (custom design system) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt |
| Icons | Lucide React |
| Charts | Recharts |
| Animations | Framer Motion |

## Features

- **UPI Payments** — Send/receive money via UPI IDs
- **QR Code** — Generate & scan QR codes for payments
- **Offline Payments** — Pay via SMS when there's no internet (Twilio)
- **Budget Tracker** — Monthly budgeting with category analytics
- **Notes** — Create, pin, archive, and manage notes
- **Transaction History** — Searchable, filterable transaction log

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### 1. Clone & install

```bash
git clone <your-repo-url>
cd MeshPay

# Server
cd server
cp .env.example .env   # Edit with your credentials
npm install

# Client
cd ../client
npm install
```

### 2. Configure environment

Edit `server/.env`:
```
PORT=8000
MONGO_URI=mongodb+srv://your_connection_string
SECRET_KEY=your_jwt_secret
NODE_ENV=development
```

### 3. Run

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open **http://localhost:5173**

## Project Structure

```
MeshPay/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── lib/            # API abstraction layer
│   │   ├── pages/          # Route pages
│   │   ├── App.jsx         # Router + providers
│   │   └── index.css       # Design system
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── config/             # Database connection
│   ├── controllers/        # Business logic
│   ├── middleware/          # Auth + error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   └── index.js            # Server entry
│
└── README.md
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/verify-pin` | Yes | Verify PIN |
| POST | `/api/payments/send` | Yes | Send money |
| POST | `/api/payments/check-balance` | Yes | Check balance |
| GET | `/api/budget` | Yes | Get budget data |
| POST | `/api/budget/update` | Yes | Update budget |
| POST | `/api/budget/expense` | Yes | Add expense |
| GET | `/api/budget/expenses` | Yes | List expenses |
| CRUD | `/api/notes` | Yes | Notes management |

## License

MIT
