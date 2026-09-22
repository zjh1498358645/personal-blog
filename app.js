const posts = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : [];
const labels = ["全部记录", "学习", "生活", "工作", "收藏"];
const app = document.querySelector("#app");
const nav = document.querySelector("#categories");
const crumb = document.querySelector("#crumb");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}
function currentRoute() {
  const value = decodeURIComponent(location.hash.slice(1) || "/");
  if (value.startsWith("/post/")) return { post: value.slice(6) };
  if (value.startsWith("/category/")) return { category: value.slice(10) };
  return { category: "全部记录" };
}
function renderNav(active = "全部记录") {
  nav.innerHTML = labels.map(label => {
    const count = label === "全部记录" ? posts.length : posts.filter(p => p.category === label).length;
    return `<a class="${active === label ? "active" : ""}" href="#/category/${encodeURIComponent(label)}"><span>${escapeHtml(label)}</span><small>${count}</small></a>`;
  }).join("");
}
function mediaHtml(items = []) {
  return items.map(item => {
    const url = escapeHtml(item.url || "");
    const alt = escapeHtml(item.alt || "文章媒体");
    return item.type === "video"
      ? `<video controls preload="metadata" src="${url}"></video>`
      : `<img loading="lazy" src="${url}" alt="${alt}">`;
  }).join("");
}
function renderList(category) {
  const shown = category === "全部记录" ? posts : posts.filter(p => p.category === category);
  crumb.textContent = category;
  renderNav(category);
  app.innerHTML = `
    <section class="intro"><p class="eyebrow">A SPACE FOR YOUR THOUGHTS</p><h1>${category === "全部记录" ? "日有所记，心有所藏。" : escapeHtml(category) + "，慢慢记录。"}</h1><p>关于学习的收获、生活的片刻，以及工作中的每一次成长。</p></section>
    <div class="section-title"><h2>${category === "全部记录" ? "最近记录" : escapeHtml(category) + "记录"} <small>${shown.length}</small></h2><span>按日期排列</span></div>
    ${shown.length ? `<section class="cards">${shown.map(post => `<article class="card"><span class="tag">${escapeHtml(post.category)}</span><a href="#/post/${encodeURIComponent(post.id)}"><h2>${escapeHtml(post.title)}</h2></a><p>${escapeHtml(post.summary || "")}</p><footer><time>${escapeHtml(post.date)}</time><a href="#/post/${encodeURIComponent(post.id)}" aria-label="阅读${escapeHtml(post.title)}">阅读 →</a></footer></article>`).join("")}</section>` : `<section class="empty"><b>故事，从第一笔开始</b><p>编辑 posts.js，写下第一篇属于自己的记录。</p></section>`}
  `;
}
function renderPost(id) {
  const post = posts.find(p => p.id === id);
  renderNav("");
  if (!post) { app.innerHTML = '<section class="empty"><b>没有找到这篇文章</b><p><a href="#/">返回书房</a></p></section>'; return; }
  crumb.textContent = post.title;
  app.innerHTML = `<article class="reading"><a href="#/">← 回到书房</a><p class="eyebrow">${escapeHtml(post.category)} · ${escapeHtml(post.date)}</p><h1>${escapeHtml(post.title)}</h1><div class="prose">${(post.content || []).map(p => `<p>${escapeHtml(p)}</p>`).join("")}</div><div class="media">${mediaHtml(post.media)}</div></article>`;
}
function render() {
  const route = currentRoute();
  route.post ? renderPost(route.post) : renderList(labels.includes(route.category) ? route.category : "全部记录");
}
document.querySelector("#theme").addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  localStorage.setItem("blog-theme", dark ? "dark" : "light");
});
document.documentElement.dataset.theme = localStorage.getItem("blog-theme") || "light";
addEventListener("hashchange", render);
render();
