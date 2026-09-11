import { access, readFile, stat, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const contentRoot = resolve(root, "content", "linkedin");

const required = ["index.html", "linkedin/index.html", "index.json", "sitemap.xml", "feed.xml", "assets/site.css", "assets/content.css", "assets/search.js"];
for (const file of required) {
  await access(resolve(root, file));
  if (!(await stat(resolve(root, file))).size) throw new Error(`${file} is empty.`);
}

const sourceCount = (await readdir(contentRoot)).filter((name) => name.endsWith(".md")).length;
const index = JSON.parse(await readFile(resolve(root, "index.json"), "utf8"));
if (index.length !== sourceCount) throw new Error(`Expected ${sourceCount} LinkedIn notes in index.json, found ${index.length}.`);

for (const post of index) {
  const slug = post.route.split("/")[1];
  for (const file of [`${post.route}index.html`, `assets/linkedin/${slug}/post.pdf`, `assets/linkedin/${slug}/source.tex`, `assets/linkedin/${slug}/article.html`]) {
    await access(resolve(root, file));
  }
}

console.log(`Validated ${required.length} core files and ${index.length} LinkedIn notes.`);
