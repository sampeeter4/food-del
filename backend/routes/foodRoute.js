import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import adminAuth from '../middleware/adminAuth.js';

const foodRouter = express.Router();
const uploadDir = 'uploads';
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
  cb(null, true);
} });

foodRouter.get('/list', listFood);
foodRouter.post('/add', adminAuth, upload.single('image'), addFood);
foodRouter.post('/remove', adminAuth, removeFood);
export default foodRouter;
