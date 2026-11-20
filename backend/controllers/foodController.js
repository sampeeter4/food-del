import foodModel from "../models/foodModel.js";
import fs from 'fs/promises';
import path from 'path';

const listFood = async (req, res) => {
  try { const foods = await foodModel.find({}).sort({ name: 1 }).lean(); return res.json({ success: true, data: foods }); }
  catch (error) { console.error("Food list error:", error.message); return res.status(500).json({ success: false, message: "Unable to load food list" }); }
};

const addFood = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "A food image is required" });
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    const category = String(req.body.category || "").trim();
    const price = Number(req.body.price);
    const categories = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles", "Biryani", "Burgers", "Pizza", "Chinese", "Wraps", "South Indian", "Desserts", "Beverages"];
    if (name.length < 2 || name.length > 100) return res.status(400).json({ success: false, message: "Food name must be 2–100 characters" });
    if (description.length < 5 || description.length > 1000) return res.status(400).json({ success: false, message: "Description must be 5–1000 characters" });
    if (!Number.isFinite(price) || price <= 0 || price > 100000) return res.status(400).json({ success: false, message: "Enter a valid price" });
    if (!categories.includes(category)) return res.status(400).json({ success: false, message: "Choose a valid category" });
    const food = await foodModel.create({ name, description, price, category, image: req.file.filename });
    return res.status(201).json({ success: true, message: "Food added successfully", data: food });
  } catch (error) {
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
    console.error("Add food error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to add food" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) return res.status(404).json({ success: false, message: "Food item not found" });
    await foodModel.findByIdAndDelete(req.body.id);
    if (food.image) await fs.unlink(path.join("uploads", food.image)).catch(() => {});
    return res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.error("Remove food error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to remove food" });
  }
};

export { listFood, addFood, removeFood };
