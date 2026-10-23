// Static smoke checks only; no live database required.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .flatMap(item => item.isDirectory()
      ? walk(path.join(dir, item.name))
      : [path.join(dir, item.name)]);
}
const scripts = [
  path.join(root, "index.js"),
  ...walk(path.join(root, "src")).filter(f => f.endsWith(".js")),
  ...walk(path.join(root, "public/js")).filter(f => f.endsWith(".js")),
  ...walk(__dirname).filter(f => f.endsWith(".js"))
];
for (const script of scripts) {
  new vm.Script(fs.readFileSync(script, "utf8"), { filename: script });
}
const webroot = path.join(root, "public");
const pages = fs.readdirSync(webroot).filter(f => f.endsWith(".html"));
for (const page of pages) {
  const html = fs.readFileSync(path.join(webroot, page), "utf8");
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|data:|#|mailto:|javascript:)/i.test(href)) continue;
    if (!fs.existsSync(path.join(webroot, href.split("?")[0]))) {
      throw new Error("Missing asset: " + page + " -> " + href);
    }
  }
}
console.log("Static checks passed: " + scripts.length + " JavaScript, " + pages.length + " HTML.");
