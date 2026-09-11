import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const contentRoot = resolve(root, "content", "linkedin");
const assetsRoot = resolve(root, "assets", "linkedin");
const profileUrl = "https://www.linkedin.com/in/dibayendu-mukherjee-bb897b267";
const siteUrl = "https://mrheaven1y.github.io/mrheaven1y.social.io/";

const ACRONYMS = new Set(["nlp", "ml", "ai", "cv", "gru", "lstm", "llm", "kv"]);
const escape = (value) => String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
const xml = (value) => escape(value).replaceAll("'", "&apos;");
const titleCase = (value) => value.split("-").map((part) => (ACRONYMS.has(part) ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1))).join(" ");

function parseValue(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) return trimmed.slice(1, -1).split(",").map((item) => item.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
  return trimmed.replace(/^["']|["']$/g, "");
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
  if (!match) throw new Error("Every LinkedIn note needs YAML frontmatter.");
  const values = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    values[line.slice(0, separator).trim()] = parseValue(line.slice(separator + 1));
  }
  return values;
}

function relativeAsset(route, path) {
  return relative(resolve(root, route), resolve(root, path)).replaceAll("\\", "/");
}

function shell(title, description, body, { stylesheet, script = "", homeLink, linkedinLink, branchesLink }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${escape(description)}" />
    <title>${escape(title)} — Dibyendu Mukherjee</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${stylesheet}" />
    <link rel="stylesheet" href="${stylesheet.replace("site.css", "content.css")}" />
  </head>
  <body>
    <header class="site-header">
      <a class="wordmark" href="${homeLink}">DM<span>.</span></a>
      <nav aria-label="Primary navigation"><a href="${linkedinLink}">LinkedIn notes</a><a href="${branchesLink}">Platforms</a></nav>
      <a class="header-action" href="https://t.me/dibayendu_mukherjee" target="_blank" rel="noopener">Message me ↗</a>
    </header>
    ${body}
    <footer class="site-footer"><a class="wordmark" href="${homeLink}">DM<span>.</span></a><p>© 2026 Dibyendu Mukherjee<br />AI research engineer · systems engineer</p><div><a href="${profileUrl}" target="_blank" rel="noopener">LinkedIn ↗</a><a href="https://t.me/dibayendu_mukherjee" target="_blank" rel="noopener">Telegram ↗</a></div></footer>
    ${script ? `<script defer src="${script}"></script>` : ""}
  </body>
</html>
`;
}

const card = (post, prefix = "", tagPrefix = "../tags/") => `<article class="content-card" data-search="${escape([post.title, post.summary, post.handnote, ...post.topics].join(" "))}">
  <div class="content-card-top"><span>${escape(post.format)}</span><span>${escape(post.date)}</span></div>
  <a class="content-card-body" href="${prefix}${post.slug}/"><h3>${escape(post.title)}</h3><p>${escape(post.summary)}</p><span class="handnote">${escape(post.handnote)}</span></a>
  <div class="content-card-bottom"><span>${post.topics.map((topic) => `<a href="${tagPrefix}${topic}/">${escape(titleCase(topic))}</a>`).join(" · ")}</span><a class="external-icon" href="${escape(post.url)}" target="_blank" rel="noopener" aria-label="Open ${escape(post.title)} on LinkedIn">↗</a></div>
</article>`;

const entries = await readdir(contentRoot, { withFileTypes: true });
const posts = [];
for (const entry of entries.filter((item) => item.isFile() && item.name.endsWith(".md"))) {
  const slug = entry.name.slice(0, -3);
  const metadata = parseFrontmatter(await readFile(resolve(contentRoot, entry.name), "utf8"));
  const articlePath = resolve(assetsRoot, slug, "article.html");
  const article = await readFile(articlePath, "utf8");
  posts.push({ slug, ...metadata, topics: Array.isArray(metadata.topics) ? metadata.topics : [], article });
}
posts.sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.title.localeCompare(b.title));

const topics = [...new Set(posts.flatMap((post) => post.topics))].sort();
const topicSections = topics.map((topic) => {
  const matches = posts.filter((post) => post.topics.includes(topic));
  return `<section class="topic-section" id="${topic}"><div class="topic-heading"><p class="section-index">${escape(titleCase(topic))}</p><span>${matches.length} ${matches.length === 1 ? "note" : "notes"}</span></div><div class="content-grid">${matches.map((post) => card(post, "", "../tags/")).join("")}</div></section>`;
}).join("");

await mkdir(resolve(root, "linkedin"), { recursive: true });
await writeFile(resolve(root, "linkedin", "index.html"), shell("LinkedIn notes", "Field Notes are the long-form LinkedIn notes archive.", `<main class="content-main"><section class="content-hero"><p class="eyebrow"><span></span> LinkedIn / Field Notes</p><h1>Ideas worth <em>staying with.</em></h1><p class="content-lede">The LinkedIn notes archive: one content source, grouped by topic, with the original decks and sources where available.</p><label class="search-field content-search" for="note-search"><span class="sr-only">Search LinkedIn notes</span><span class="search-icon" aria-hidden="true">⌕</span><input id="note-search" type="search" placeholder="Search notes, topics, and summaries" autocomplete="off" /></label><p class="search-hint">Press Escape to clear your search.</p></section><div class="topic-nav">${topics.map((topic) => `<a href="#${topic}">${escape(titleCase(topic))}</a>`).join("")}</div>${topicSections}<p class="empty-state" id="no-results" hidden>No notes match that search. Try a broader term.</p></main>`, { stylesheet: "../assets/site.css", script: "../assets/search.js", homeLink: "../", linkedinLink: "./", branchesLink: "../#platforms" }));

for (const topic of topics) {
  const matches = posts.filter((post) => post.topics.includes(topic));
  await mkdir(resolve(root, "tags", topic), { recursive: true });
  await writeFile(resolve(root, "tags", topic, "index.html"), shell(`${titleCase(topic)} notes`, `LinkedIn notes tagged ${titleCase(topic)}.`, `<main class="content-main"><section class="content-hero compact"><p class="eyebrow"><span></span> Topic archive</p><h1>${escape(titleCase(topic))} <em>notes.</em></h1><p class="content-lede">${matches.length} notes in this topic.</p></section><div class="content-grid">${matches.map((post) => card(post, "../../linkedin/", "../../tags/")).join("")}</div><a class="branch-back text-link" href="../../linkedin/">← All LinkedIn notes</a></main>`, { stylesheet: "../../assets/site.css", homeLink: "../../", linkedinLink: "../../linkedin/", branchesLink: "../../#platforms" }));
}

const pageSize = 6;
const pageCount = Math.ceil(posts.length / pageSize);
for (let page = 1; page <= pageCount; page += 1) {
  const slice = posts.slice((page - 1) * pageSize, page * pageSize);
  const directory = resolve(root, "page", String(page));
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, "index.html"), shell(`LinkedIn notes — page ${page}`, "Paginated LinkedIn notes archive.", `<main class="content-main"><section class="content-hero compact"><p class="eyebrow"><span></span> Page ${page}</p><h1>LinkedIn <em>notes.</em></h1></section><div class="content-grid">${slice.map((post) => card(post, "../../linkedin/", "../../tags/")).join("")}</div><nav class="pagination" aria-label="Notes pages">${page > 1 ? `<a href="../${page - 1}/">← Newer</a>` : ""}${page < pageCount ? `<a href="../${page + 1}/">Older →</a>` : ""}</nav></main>`, { stylesheet: "../../assets/site.css", homeLink: "../../", linkedinLink: "../../linkedin/", branchesLink: "../../#platforms" }));
}

for (const post of posts) {
  const directory = resolve(root, "linkedin", post.slug);
  const article = post.article.match(/<main class="post-main">([\s\S]*?)<\/main>/)?.[1] ?? `<p>${escape(post.summary)}</p>`;
  const assetPrefix = `${relativeAsset(`linkedin/${post.slug}/`, `assets/linkedin/${post.slug}/`)}/`;
  const rewritten = article.replaceAll('href="./post.pdf"', `href="${assetPrefix}post.pdf"`).replaceAll('href="./source.tex"', `href="${assetPrefix}source.tex"`).replaceAll('src="./', `src="${assetPrefix}`);
  await mkdir(directory, { recursive: true });
  const actions = `<div class="migrated-note-actions"><a class="button button-dark" href="${escape(post.url)}" target="_blank" rel="noopener">Open on LinkedIn ↗</a><a class="button button-outline" href="../">Back to notes</a></div>`;
  await writeFile(resolve(directory, "index.html"), shell(post.title, post.summary, `<main class="migrated-note"><p class="eyebrow"><span></span> LinkedIn / ${escape(post.topics.map(titleCase).join(" · "))}</p><h1>${escape(post.title)}</h1><p class="migrated-summary">${escape(post.summary)}</p>${actions}<p class="handnote">${escape(post.handnote)}</p>${rewritten}</main>`, { stylesheet: "../../assets/site.css", homeLink: "../../", linkedinLink: "../", branchesLink: "../../#platforms" }));
}

const index = posts.map((post) => ({ title: post.title, platform: post.platform, topics: post.topics, date: post.date, summary: post.summary, handnote: post.handnote, url: post.url, route: `linkedin/${post.slug}/` }));
await writeFile(resolve(root, "index.json"), JSON.stringify(index, null, 2) + "\n");

const lastmod = posts[0]?.date ?? "2026-09-10";
await writeFile(resolve(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["", "linkedin/", ...topics.map((topic) => `tags/${topic}/`), ...posts.map((post) => `linkedin/${post.slug}/`)].map((path) => `  <url><loc>${xml(new URL(path, siteUrl).href)}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}\n</urlset>\n`);
await writeFile(resolve(root, "feed.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Dibyendu Mukherjee — LinkedIn Notes</title><link>${siteUrl}linkedin/</link><description>Field Notes published through LinkedIn.</description>${posts.map((post) => `<item><title>${xml(post.title)}</title><link>${xml(new URL(`linkedin/${post.slug}/`, siteUrl).href)}</link><description>${xml(post.summary)}</description><pubDate>${post.date}</pubDate></item>`).join("")}</channel></rss>\n`);

const homePath = resolve(root, "index.html");
const home = await readFile(homePath, "utf8");
const latest = posts[0];
const linkedinCard = `<p class="platform-stats">${posts.length} ${posts.length === 1 ? "note" : "notes"} · ${topics.length} ${topics.length === 1 ? "topic" : "topics"}</p><p class="platform-handnote handnote">${escape(latest?.handnote ?? "")}</p>`;
const patchedHome = home.replace(/<!-- build:linkedin-card -->[\s\S]*?<!-- \/build:linkedin-card -->/, `<!-- build:linkedin-card -->\n            ${linkedinCard}\n            <!-- /build:linkedin-card -->`);
if (patchedHome === home && !home.includes("build:linkedin-card")) {
  console.warn("Home page missing <!-- build:linkedin-card --> markers; LinkedIn card stats were not updated.");
} else {
  await writeFile(homePath, patchedHome);
}

console.log(`Built social hub content for ${posts.length} LinkedIn notes, ${topics.length} topics, and ${pageCount} archive pages.`);
