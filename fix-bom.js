const fs = require("fs");
const content = fs.readFileSync("package.json", "utf8");
// Remove BOM if present
const cleaned = content.replace(/^\uFEFF/, "");
fs.writeFileSync("package.json", cleaned, "utf8");
console.log("BOM removed from package.json");
