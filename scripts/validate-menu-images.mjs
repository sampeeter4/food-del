import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(fs.readFileSync(path.join(root,"shared","menuCatalog.json"),"utf8").replace(/^\uFEFF/,""));
const frontendRoot = path.join(root,"frontend","public","menu-images");
const backendRoot = path.join(root,"backend","uploads");
const expected = {Biryani:"biryani",Burgers:"burgers",Pizza:"pizza",Chinese:"chinese",Wraps:"wraps","South Indian":"south-indian",Desserts:"desserts",Beverages:"beverages"};
const issues=[]; const hashes=new Map(); const paths=new Set(); const categories={}; const checks=[];
const safePath = value => { const normalized=String(value||"").replaceAll("\\","/").replace(/^\/+/,""); return normalized && !normalized.split("/").some(part=>!part||part==="."||part==="..") ? normalized : null; };
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const validMagic = file => { const b=fs.readFileSync(file); return (b[0]===0xff&&b[1]===0xd8&&b[2]===0xff)||(b.length>=8&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))||(b.subarray(0,4).toString()==="RIFF"&&b.subarray(8,12).toString()==="WEBP"); };
for (const product of products) {
 categories[product.category]=(categories[product.category]||0)+1;
 const rel=safePath(product.image); const expectedFolder=expected[product.category];
 if(!rel){issues.push(`${product.name}: invalid or unsafe image path`);continue;}
 paths.add(rel);
 if(!expectedFolder || rel.split("/")[0]!==expectedFolder) issues.push(`${product.name}: image path must start with ${expectedFolder||"a valid category"}/`);
 const front=path.resolve(frontendRoot,rel); const back=path.resolve(backendRoot,rel);
 if(!front.startsWith(frontendRoot+path.sep)||!back.startsWith(backendRoot+path.sep)){issues.push(`${product.name}: path escapes image directory`);continue;}
 if(!fs.existsSync(front)){issues.push(`${product.name}: missing frontend image ${rel}`);continue;}
 if(!fs.existsSync(back)){issues.push(`${product.name}: missing backend image ${rel}`);continue;}
 if(!validMagic(front)){issues.push(`${product.name}: unsupported or invalid image file ${rel}`);continue;}
 const frontHash=hash(front); const backHash=hash(back);
 if(frontHash!==backHash) issues.push(`${product.name}: frontend/backend image bytes differ (${rel})`);
 if(hashes.has(frontHash)) issues.push(`${product.name}: duplicate image content with ${hashes.get(frontHash)} (${rel})`); else hashes.set(frontHash,product.name);
 checks.push({name:product.name,category:product.category,image:rel,sha256:frontHash,frontendExists:true,backendExists:true,frontendBackendMatch:frontHash===backHash});
}
for(const [category,folder] of Object.entries(expected)) if(categories[category]!==15) issues.push(`${category}: expected 15 products, found ${categories[category]||0}`);
if(products.length!==120) issues.push(`Expected 120 products, found ${products.length}`);
const report={checkedAt:new Date().toISOString(),totalProducts:products.length,categoryCounts:categories,uniqueImagePaths:paths.size,uniqueImageContents:hashes.size,checkedProducts:checks.length,missingOrInvalidCount:issues.length,issues,checks};
const args=process.argv.slice(2); const frontendUrl=args.find(x=>x.startsWith("--frontend-url="))?.split("=")[1]; const backendUrl=args.find(x=>x.startsWith("--backend-url="))?.split("=")[1];
for(const [label,base,prefix] of [["frontend",frontendUrl,"/menu-images/"],["backend",backendUrl,"/images/"]]) if(base){ report[`${label}HttpChecks`]=[]; for(const item of checks){try{const response=await fetch(new URL(prefix+item.image.split("/").map(encodeURIComponent).join("/"),base)); report[`${label}HttpChecks`].push({image:item.image,status:response.status,ok:response.ok}); if(!response.ok)issues.push(`${label} HTTP ${response.status}: ${item.image}`);}catch(error){issues.push(`${label} HTTP request failed for ${item.image}: ${error.message}`);}} }
report.missingOrInvalidCount=issues.length;
const out=path.join(root,"reports","menu-image-validation.json"); fs.mkdirSync(path.dirname(out),{recursive:true}); fs.writeFileSync(out,JSON.stringify(report,null,2)+"\n","utf8");
console.log(JSON.stringify({totalProducts:report.totalProducts,categoryCounts:report.categoryCounts,uniqueImagePaths:report.uniqueImagePaths,uniqueImageContents:report.uniqueImageContents,checkedProducts:report.checkedProducts,issues:issues.length,report:path.relative(root,out)},null,2));
if(issues.length){console.error(issues.slice(0,30).join("\n"));process.exitCode=1;}
