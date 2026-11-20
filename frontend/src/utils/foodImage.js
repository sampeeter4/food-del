export const getFoodImageUrl = (image, item, apiBase = "") => {
  if (typeof image !== "string" || !image.trim()) return "";
  const value = image.trim();
  if (/^(https?:|data:|blob:)/i.test(value) || value.startsWith("/src/")) return value;

  const normalized = value.replaceAll("\\", "/").replace(/^\/+/, "");
  if (!normalized || normalized.split("/").some((part) => !part || part === "." || part === "..")) return "";

  const base = String(apiBase).replace(/\/+$/, "");
  if (normalized.startsWith("menu-images/")) return `/${normalized}`;
  if (/^(biryani|burgers|pizza|chinese|wraps|south-indian|desserts|beverages)\//i.test(normalized)) return `/menu-images/${normalized}`;
  if (normalized.startsWith("images/")) return `${base}/${normalized}`;

  const fileName = normalized.split("/").pop();
  if (item?.isDemo || /^food_\d+\.png$/i.test(fileName)) return `/menu-images/${normalized}`;
  return `${base}/images/${normalized}`;
};
