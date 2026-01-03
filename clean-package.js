const fs = require("fs");

try {
  // Try to read and parse the file to find errors
  const content = fs.readFileSync("package.json", "utf8");
  
  // Clean common issues:
  let cleaned = content
    .replace(/^\uFEFF/, "") // Remove BOM
    .replace(/\r/g, "") // Remove carriage returns
    .replace(/,\s*}/g, "}") // Remove trailing commas
    .replace(/,\s*\]/g, "]"); // Remove trailing commas in arrays
  
  // Fix: Remove any extra characters before {
  const jsonStart = cleaned.indexOf("{");
  if (jsonStart > 0) {
    cleaned = cleaned.substring(jsonStart);
  }
  
  // Try to parse to validate
  JSON.parse(cleaned);
  
  // Write back
  fs.writeFileSync("package.json", cleaned, "utf8");
  console.log(" package.json cleaned and validated");
  
} catch (error) {
  console.error("Error fixing package.json:", error.message);
  
  // Create a fresh template
  const freshPackage = {
    name: "kapeyamaha-web",
    version: "1.0.0",
    description: "",
    main: "index.js",
    scripts: {},
    dependencies: {},
    devDependencies: {}
  };
  
  fs.writeFileSync("package.json", JSON.stringify(freshPackage, null, 2));
  console.log(" Created fresh package.json template");
  console.log(" You need to re-add your dependencies");
}
