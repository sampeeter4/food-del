import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "shared", "menuCatalog.json");
const products = JSON.parse(fs.readFileSync(catalogPath, "utf8").replace(/^\uFEFF/, ""));
const categoryFolders = { "Biryani":"biryani", "Burgers":"burgers", "Pizza":"pizza", "Chinese":"chinese", "Wraps":"wraps", "South Indian":"south-indian", "Desserts":"desserts", "Beverages":"beverages" };
const slug = value => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const categoryStyle = {
 Biryani: "Indian biryani served in a traditional bowl, distinct long-grain rice, visible named protein or vegetables, caramelized onions, fresh herbs and whole spices",
 Burgers: "restaurant burger with a toasted bun, clearly visible named patty and toppings, fresh lettuce and tomato where appropriate, appetizing layered cross-section",
 Pizza: "whole artisan pizza viewed at a three-quarter angle, accurately rendered named toppings, baked crust, melted cheese only where appropriate",
 Chinese: "authentic Chinese-style restaurant dish in a tasteful ceramic serving bowl or plate, accurately showing the named noodles, rice, vegetables or protein",
 Wraps: "single freshly grilled wrap or roll cut diagonally to reveal the accurately named filling, lightly toasted flatbread and natural textures",
 "South Indian": "authentic South Indian meal on a traditional plate or banana leaf, correctly showing the named dosa, idli, vada, appam, puttu or curry",
 Desserts: "premium patisserie or Indian dessert presentation, accurately showing the named dessert, realistic crumb, cream, syrup or garnish",
 Beverages: "single glass or cup of the accurately named beverage, realistic liquid colour, condensation or foam only when appropriate, restrained garnish"
};
if (products.length !== 120) throw new Error(`Expected 120 products; found ${products.length}`);
const counts = new Map();
const entries = products.map(product => {
 const folder = categoryFolders[product.category];
 if (!folder) throw new Error(`Unsupported category: ${product.category}`);
 counts.set(product.category, (counts.get(product.category) || 0) + 1);
 const filename = `${slug(product.name)}.jpg`;
 const relativePath = `${folder}/${filename}`;
 const ingredients = Array.isArray(product.ingredients) ? product.ingredients.join(", ") : "";
 const prompt = `Create one photorealistic premium restaurant food photograph of ${product.name}. ${categoryStyle[product.category]}. Food identity must match the exact product name${ingredients ? ` and these catalog ingredients: ${ingredients}` : ""}. One dish or one drink only, hero subject centered, appetizing but natural warm restaurant lighting, true-to-life ingredient colours and textures, elegant dark-walnut or neutral stone tabletop, subtle soft shadows, refined classic restaurant styling, professional commercial food photography, square composition, crisp detail. No text, labels, logos, watermark, collage, illustration, extra unrelated dishes, or artificial oversaturation.`;
 return { name: product.name, category: product.category, categoryFolder: folder, filename, relativePath, prompt, imageStatus: "not-generated" };
});
for (const [category, count] of counts) if (count !== 15) throw new Error(`${category} has ${count} products, expected 15`);
const output = path.join(root, "reports", "menu-image-prompt-manifest.json");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ generatedAt: new Date().toISOString(), totalProducts: entries.length, categoryCounts: Object.fromEntries(counts), entries }, null, 2) + "\n", "utf8");
console.log(`Created ${entries.length} product-specific image prompts at ${path.relative(root, output)}. No image files were fabricated.`);
