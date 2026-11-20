import "dotenv/config";
import mongoose from "mongoose";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import foodModel from "./models/foodModel.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const catalogPath = path.join(root, "shared", "menuCatalog.json");
const products = JSON.parse(fs.readFileSync(catalogPath, "utf8").replace(/^\uFEFF/, ""));
const frontendImages = path.join(root, "frontend", "public", "menu-images");
const backendImages = path.join(here, "uploads");
const apply = process.argv.includes("--apply");
const categoryFolders = { Biryani: "biryani", Burgers: "burgers", Pizza: "pizza", Chinese: "chinese", Wraps: "wraps", "South Indian": "south-indian", Desserts: "desserts", Beverages: "beverages" };
const imageHashes = new Set();
const imagePaths = new Set();

if (products.length !== 120) throw new Error(`Expected 120 catalog products; found ${products.length}`);
const missingImages = [];
for (const product of products) {
  const relative = String(product.image || "").replaceAll("\\", "/").replace(/^\/+/, "");
  if (!relative || relative.split("/").some(part => !part || part === "." || part === "..") || relative.split("/")[0] !== categoryFolders[product.category]) {
    missingImages.push(`${product.name}: invalid image path`);
    continue;
  }
  if (imagePaths.has(relative)) missingImages.push(`${product.name}: image path is assigned to more than one product (${relative})`);
  imagePaths.add(relative);
  const frontendFile = path.join(frontendImages, relative);
  const backendFile = path.join(backendImages, relative);
  if (!fs.existsSync(frontendFile)) missingImages.push(`${product.name}: frontend image missing (${relative})`);
  if (!fs.existsSync(backendFile)) missingImages.push(`${product.name}: backend image missing (${relative})`);
  if (fs.existsSync(frontendFile)) {
    const hash = crypto.createHash("sha256").update(fs.readFileSync(frontendFile)).digest("hex");
    if (imageHashes.has(hash)) missingImages.push(`${product.name}: duplicate image file content (${relative})`);
    imageHashes.add(hash);
    if (fs.existsSync(backendFile) && !fs.readFileSync(frontendFile).equals(fs.readFileSync(backendFile))) missingImages.push(`${product.name}: frontend/backend image bytes differ (${relative})`);
  }
}
if (missingImages.length) {
  console.error(`Image preflight failed (${missingImages.length} issues). MongoDB was not contacted.`);
  console.error(missingImages.slice(0, 30).join("\n"));
  process.exit(1);
}
if (!apply) {
  console.log(`Dry run passed: ${products.length} image files exist in both locations. Re-run with --apply to update only the image field on existing MongoDB products.`);
  process.exit(0);
}
if (!process.env.MONGODB_URI) throw new Error("Set MONGODB_URI in backend/.env before applying image paths.");
await mongoose.connect(process.env.MONGODB_URI);
let matched = 0;
let modified = 0;
let missingProducts = 0;
try {
  for (const product of products) {
    const result = await foodModel.updateOne({ name: product.name }, { $set: { image: product.image } }, { runValidators: true });
    matched += result.matchedCount || 0;
    modified += result.modifiedCount || 0;
    if (!result.matchedCount) missingProducts += 1;
  }
  console.log(`Image paths applied: ${modified} updated, ${matched} matched, ${missingProducts} products absent. No product details or records were overwritten or deleted.`);
} finally {
  await mongoose.disconnect();
}
