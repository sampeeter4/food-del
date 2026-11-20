import catalog from "./menuCatalog.json";
export const menuCatalog = catalog.map((item, index) => ({ ...item, _id: `demo-${String(index + 1).padStart(3, "0")}`, isDemo: true }));
