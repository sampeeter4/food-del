


# MealMate — Food Ordering Platform

MealMate is a full-stack food ordering application built with **React, Vite, Node.js, Express, and MongoDB**. It includes a customer-facing website, a separate administration panel, and a REST API for authentication, menu items, carts, orders, and restaurant/delivery operations.


The repository contains three independently run applications:

- **Customer frontend** — browse restaurants and dishes, manage a cart, and place orders.
- **Admin panel** — sign in to manage food items and review/update orders.
- **Backend API** — authenticate users, persist catalog and order data, and expose protected management endpoints.

> The restaurant listings on the current Discover page are sample presentation data. Their names, ratings, prices, and delivery times are illustrative, not live business listings.

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Menu catalog](#menu-catalog)
- [Repository structure](#repository-structure)
- [Requirements](#requirements)
- [Run locally](#run-locally)
- [Seed the sample catalog](#seed-the-sample-catalog)
- [API overview](#api-overview)
- [Authentication and roles](#authentication-and-roles)
- [Build for production](#build-for-production)
- [Environment and security](#environment-and-security)
- [Documentation](#documentation)

## Features

### Customer website

- Responsive home page and food discovery experience.
- Menu browsing with category navigation and food search/filtering.
- Food detail pages with descriptions, prices, and images.
- Restaurant discovery page with 15 sample restaurant cards.
- About Us, Contact, and mobile-app information pages.
- Customer registration and login using JWT authentication.
- Shopping cart with quantity controls and local cart persistence.
- Order placement, order history, and payment verification pages.
- Cash on delivery and optional Stripe Checkout when Stripe is configured.

### Admin panel

- Separate admin sign-in screen.
- Add food items with image uploads.
- View and remove food items.
- View orders and update order status.
- Admin-only API access for protected food and order operations.

### Backend and platform API

- Express REST API connected to MongoDB through Mongoose.
- Customer registration, login, and admin login.
- Food catalog listing, creation, and removal.
- Authenticated cart operations and customer order history.
- Server-side validation of order items and prices before order creation.
- Cash-on-delivery order placement and optional Stripe Checkout integration.
- Restaurant listing and restaurant application endpoints.
- Restaurant order and open/closed status endpoints.
- Delivery partner application, availability, location, and delivery-status endpoints.
- Admin platform endpoints for restaurant approvals, rider verification, rider assignment, overview data, and coupon management/validation.
- CORS origin allow-list, request throttling for write/auth requests, and basic security response headers.

## Technology stack

| Area | Technologies |
|---|---|
| Customer frontend | React 18, Vite, React Router, Axios, React Toastify |
| Admin frontend | React 18, Vite, React Router, Axios, React Toastify |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Payments | Stripe Checkout (optional), cash on delivery |
| Image handling | Multer; local static image folders |

## Menu catalog

The shared sample catalog contains **120 dishes**, with 15 products in each category:

| Category | Sample products |
|---|---:|
| Biryani | 15 |
| Burgers | 15 |
| Pizza | 15 |
| Chinese | 15 |
| Wraps | 15 |
| South Indian | 15 |
| Desserts | 15 |
| Beverages | 15 |
| **Total** | **120** |

The shared source is `shared/menuCatalog.json`. The frontend has a catalog copy at `frontend/src/data/menuCatalog.json` for displaying sample menu data. The frontend can show this sample catalog without a database connection; database-backed checkout requires the catalog to be seeded so the browser receives real MongoDB product IDs.

## Repository structure

```text
food-del/
├── admin/                         # Admin React/Vite application
│   └── src/
│       ├── components/
│       └── pages/                  # Add, List, Orders
├── backend/                       # Express API
│   ├── config/                    # MongoDB connection
│   ├── controllers/               # API controllers
│   ├── middleware/                # Customer, admin, and role checks
│   ├── models/                    # Mongoose models
│   ├── routes/                    # API route definitions
│   ├── uploads/                   # Backend-uploaded images (local)
│   ├── .env.example
│   ├── seedCatalog.js
│   └── server.js
├── frontend/                      # Customer React/Vite application
│   ├── public/menu-images/        # Public menu and restaurant images
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── Context/
│       ├── data/
│       ├── pages/                  # Home, Menu, Discover, About, etc.
│       └── utils/
├── shared/
│   └── menuCatalog.json           # Shared sample catalog
├── scripts/                       # Menu image build/validation scripts
├── reports/                       # Menu image and catalog reports
├── SETUP.md                       # Detailed local setup instructions
└── README.md
```

## Requirements

Install the following before running the project:

- Node.js and npm.
- MongoDB (local MongoDB server or a MongoDB Atlas database).
- Git (to clone the repository).

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/sampeeter4/food-del.git
cd food-del
```

### 2. Install dependencies

Each application has its own `package.json`. Install dependencies in all three folders:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

### 3. Configure environment variables

Create the local environment files from the examples:

- Copy `backend/.env.example` to `backend/.env` and set the real backend values.
- Copy `frontend/.env.example` to `frontend/.env`.
- Copy `admin/.env.example` to `admin/.env`.

The customer and admin frontends use this API URL by default:

```env
VITE_API_URL=http://localhost:4000
```

The backend requires at least:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

For Stripe Checkout, configure `STRIPE_SECRET_KEY` and `FRONTEND_URL`. Configure `CLIENT_ORIGINS` with the exact comma-separated frontend origins used in your local environment or deployment. Admin login also requires `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`.

See [SETUP.md](SETUP.md) for the complete environment-variable descriptions and admin password-hash setup.

### 4. Start the backend

Open a terminal at the repository root:

```bash
cd backend
npm run server
```

The API uses port `4000` by default. Check that it is running at:

```text
http://localhost:4000/health
```

### 5. Start the customer website

Open a second terminal:

```bash
cd frontend
npm run dev
```

Vite normally serves the customer website at `http://localhost:5173`. If that port is already in use, Vite may select another available port.

### 6. Start the admin panel

Open a third terminal:

```bash
cd admin
npm run dev
```

Vite normally serves the admin panel at `http://localhost:5174` if the port is available. If the frontend or admin uses a different port, update `CLIENT_ORIGINS` in `backend/.env` to allow the actual origins, then restart the backend.

## Seed the sample catalog

The customer frontend can display its local sample catalog without MongoDB. To enable database-backed ordering:

1. Configure `MONGODB_URI` in `backend/.env`.
2. From the backend folder, run:

   ```bash
   npm run seed:catalog
   ```

3. Start or restart the backend:

   ```bash
   npm run server
   ```

4. Keep `frontend/.env` configured with `VITE_API_URL=http://localhost:4000`.

The seed command upserts catalog products by name and uses the image files available in `backend/uploads`. More details are in [backend/CATALOG_SETUP.md](backend/CATALOG_SETUP.md).

## API overview

The backend base URL is `http://localhost:4000` by default.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API health check |
| POST | `/api/user/register` | Customer registration |
| POST | `/api/user/login` | Customer login |
| POST | `/api/user/admin-login` | Admin login |
| GET | `/api/food/list` | List food items |
| POST | `/api/food/add` | Add a food item (admin) |
| POST | `/api/food/remove` | Remove a food item (admin) |
| POST | `/api/cart/get` | Get authenticated customer cart |
| POST | `/api/cart/add` | Add to authenticated customer cart |
| POST | `/api/cart/remove` | Remove from authenticated customer cart |
| POST | `/api/order/placecod` | Place a cash-on-delivery order |
| POST | `/api/order/place` | Start Stripe Checkout |
| POST | `/api/order/verify` | Verify Stripe payment |
| POST | `/api/order/userorders` | Get authenticated customer orders |
| GET | `/api/order/list` | List orders (admin) |
| POST | `/api/order/status` | Update order status (admin) |
| GET | `/api/platform/restaurants` | List approved restaurants |
| POST | `/api/platform/restaurants/apply` | Submit a restaurant application |
| POST | `/api/platform/rider/apply` | Submit a delivery partner application |
| POST | `/api/platform/coupons/validate` | Validate a coupon |

The platform API also provides restaurant-owner dashboard/order operations, delivery-partner availability/location/delivery operations, and admin endpoints for approvals, rider verification/assignment, overview data, and coupon creation. These endpoints are role-protected where appropriate. See `backend/routes/platformRoute.js` for the full route list.

## Authentication and roles

The user model supports these roles:

- `customer`
- `admin`
- `restaurant`
- `delivery_partner`

Customer and admin authentication return JWTs. Protected API requests must send the token using the `token` request header. Admin food/order management routes use admin authorization middleware; restaurant and delivery operations use role-based middleware.

## Build for production

Build the customer frontend:

```bash
cd frontend
npm run build
```

Build the admin frontend:

```bash
cd admin
npm run build
```

The generated frontend files are written to each application's `dist/` folder. Configure the production hosting URLs, API URL, CORS origins, MongoDB connection, JWT secret, and any payment credentials in the deployment environment. Do not commit local `.env` files or put backend secrets in frontend `VITE_` variables.

## Environment and security

- Keep `backend/.env`, `frontend/.env`, and `admin/.env` private and out of Git.
- Use strong, unique values for `JWT_SECRET` and admin credentials.
- Use a MongoDB database user with only the permissions the application needs.
- Restrict `CLIENT_ORIGINS` to the exact trusted frontend origins.
- Use Stripe test keys for local testing and production keys only in a secure deployment environment.
- If a database credential has ever been committed to Git history, rotate it in MongoDB Atlas; deleting the file in a later commit does not remove it from earlier commits.

## Documentation

- [Local setup and environment variables](SETUP.md)
- [Sample catalog seeding](backend/CATALOG_SETUP.md)
- [Backend route definitions](backend/routes/)

