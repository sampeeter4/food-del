# MealMate local setup

## 1. Backend environment

Create `backend/.env` from `backend/.env.example` and set real values:

- `MONGODB_URI`: a newly rotated MongoDB Atlas connection string. The old credential was exposed in source code; rotate it in Atlas before using this project.
- `JWT_SECRET`: a long random secret (at least 32 random bytes).
- `STRIPE_SECRET_KEY`: Stripe test secret for local testing. Leave it unset if you only want cash on delivery.
- `FRONTEND_URL`: `http://localhost:5173` for local testing.
- `CLIENT_ORIGINS`: `http://localhost:5173,http://localhost:5174` for local testing.
- `ADMIN_EMAIL`: the email used for admin sign-in.
- `ADMIN_PASSWORD_HASH`: a bcrypt hash generated in the next step.

Generate the admin password hash from the backend folder:

```bash
node generateAdminHash.js
```

Copy the generated hash into `backend/.env` as `ADMIN_PASSWORD_HASH`. Use a strong password of at least 12 characters. Do not commit `.env` files.

## 2. Frontend environment

Create `frontend/.env` containing:

```env
VITE_API_URL=http://localhost:4000
```

Create `admin/.env` with the same `VITE_API_URL` value.

## 3. Start the applications

Open three terminals from the repository root:

```bash
cd backend
npm install
npm run server
```

```bash
cd frontend
npm install
npm run dev
```

```bash
cd admin
npm install
npm run dev
```

Frontend: `http://localhost:5173`
Admin: `http://localhost:5174` (Vite may choose another port if 5174 is busy)
Backend health check: `http://localhost:4000/health`

## 4. Production deployment

Set the same environment variables in the hosting provider. Set `FRONTEND_URL` to the deployed customer frontend URL and `CLIENT_ORIGINS` to the exact comma-separated customer and admin frontend origins. Never put MongoDB credentials, Stripe secret keys, JWT secrets, or admin password hashes in a `VITE_` variable.

Admin food-management and order-management endpoints now require an admin JWT. Customer order endpoints require a customer JWT. The server calculates order prices from the database rather than trusting prices submitted by the browser.
