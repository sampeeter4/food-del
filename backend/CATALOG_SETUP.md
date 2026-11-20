# MealMate sample catalog setup

The menu contains 120 sample products (15 in each of the eight requested categories). The product records are shared from `shared/menuCatalog.json`.

To enable real backend ordering for these catalog products:

1. Configure `MONGODB_URI` in `backend/.env` (do not commit credentials).
2. From the `backend` directory run `npm run seed:catalog`.
3. Start the API with `npm run server`.
4. Keep `frontend/.env` configured with `VITE_API_URL=http://localhost:4000`.

The seed command upserts products by name and uses the image files in `backend/uploads`. The frontend can display the sample catalog without the API, but checkout intentionally blocks sample-only IDs until the catalog has been seeded and real MongoDB IDs are returned.

Image note: the repository originally contained 32 food photos. They are copied into `backend/uploads` and reused as fallback catalog imagery; a separate set of 120 distinct, category-matched food photographs has not been supplied yet.
