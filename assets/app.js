const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
function sortByDateDesc(a,b){ return (b.date||"").localeCompare(a.date||""); }

function initTheme(){
  const stored = localStorage.getItem("theme");
  if (stored) document.documentElement.dataset.theme = stored;

  const btn = $("#themeBtn");
  const setIcon = () => {
    const theme = document.documentElement.dataset.theme || "dark";
    btn.querySelector(".icon").textContent = theme === "light" ? "☼" : "☾";
  };
  setIcon();

  btn?.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || "dark";
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setIcon();
  });
}

function initMenu(){
  const modal = $("#menu");
  const btn = $("#menuBtn");
  const open = () => { modal.hidden = false; };
  const close = () => { modal.hidden = true; };

  btn?.addEventListener("click", open);
  modal?.addEventListener("click", (e) => {
    const t = e.target;
    if (t?.dataset?.close === "true") close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) close();
  });
}

function initReveal(scope=document){
  const els = $$(".reveal", scope);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

async function loadJson(path){
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

/* Home: stats only */
async function bootHome(){
  try{
    const [w,p,n] = await Promise.all([
      loadJson("content/writeups.json"),
      loadJson("content/projects.json"),
      loadJson("content/notes.json"),
    ]);
    $("#statWriteups").textContent = String(w.length);
    $("#statProjects").textContent = String(p.length);
    $("#statNotes").textContent = String(n.length);
  }catch(err){
    console.error(err);
  }
}

/* Category renderers */
function renderCardList(items){
  return items.map(x => `
    <a class="cardlink reveal" href="${escapeHtml(x.url||"#")}" ${x.external ? 'target="_blank" rel="noreferrer"' : ''}>
      <div class="meta">
        ${x.platform ? `<span class="tag">${escapeHtml(x.platform)}</span>` : (x.type ? `<span class="tag">${escapeHtml(x.type)}</span>` : `<span class="tag">Item</span>`)}
        ${x.date ? `<span>•</span><span>${escapeHtml(x.date)}</span>` : ``}
        ${x.stack ? `<span>•</span><span class="muted2">${escapeHtml(x.stack)}</span>` : ``}
      </div>
      <h3>${escapeHtml(x.title||"Untitled")}</h3>
      ${x.summary ? `<p>${escapeHtml(x.summary)}</p>` : ``}
      ${(x.tags && x.tags.length) ? `<div class="chips">${x.tags.slice(0,10).map(t=>`<span class="tag">#${escapeHtml(t)}</span>`).join("")}</div>` : ``}
    </a>
  `).join("");
}

function groupByPlatform(items){
  const order = ["HTB","THM","WASA","CTF","Other"];
  const groups = {};
  items.forEach(x => {
    const k = x.platform || "Other";
    if (!groups[k]) groups[k] = [];
    groups[k].push(x);
  });
  // ensure stable order
  const keys = [...new Set([...order.filter(k=>groups[k]), ...Object.keys(groups).filter(k=>!order.includes(k))])];
  return keys.map(k => ({ key:k, items: groups[k].slice().sort(sortByDateDesc) }));
}

function applySearch(items, q){
  const query = (q||"").trim().toLowerCase();
  if (!query) return items;
  return items.filter(x => {
    const hay = `${x.title||""} ${(x.tags||[]).join(" ")} ${x.summary||""} ${x.platform||""} ${x.stack||""}`.toLowerCase();
    return hay.includes(query);
  });
}

async function bootWriteups(){
  const area = $("#contentArea");
  const empty = $("#empty");
  let all = [];
  try{
    all = await loadJson("content/writeups.json");
  }catch(err){
    console.error(err);
    area.innerHTML = `<div class="empty">Couldn’t load writeups.json (check paths).</div>`;
    return;
  }

  const render = (q) => {
    const filtered = applySearch(all, q);
    const grouped = groupByPlatform(filtered);
    area.innerHTML = grouped.map(g => `
      <div class="group">
        <div class="group__head">
          <h2 class="group__title">${escapeHtml(g.key)}</h2>
          <div class="group__count">${g.items.length} item${g.items.length===1?"":"s"}</div>
        </div>
        <div class="grid grid--cards">
          ${renderCardList(g.items)}
        </div>
      </div>
    `).join("");

    initReveal(area);
    empty.hidden = filtered.length !== 0;
  };

  render("");
  $("#search")?.addEventListener("input", (e) => render(e.target.value));
}

async function bootProjects(){
  const area = $("#contentArea");
  const empty = $("#empty");
  let all = [];
  try{
    all = await loadJson("content/projects.json");
  }catch(err){
    console.error(err);
    area.innerHTML = `<div class="empty">Couldn’t load projects.json (check paths).</div>`;
    return;
  }
  const render = (q) => {
    const filtered = applySearch(all, q).slice().sort(sortByDateDesc);
    area.innerHTML = `<div class="grid grid--cards">${renderCardList(filtered)}</div>`;
    initReveal(area);
    empty.hidden = filtered.length !== 0;
  };
  render("");
  $("#search")?.addEventListener("input", (e) => render(e.target.value));
}

async function bootNotes(){
  const area = $("#contentArea");
  const empty = $("#empty");
  let all = [];
  try{
    all = await loadJson("content/notes.json");
  }catch(err){
    console.error(err);
    area.innerHTML = `<div class="empty">Couldn’t load notes.json (check paths).</div>`;
    return;
  }
  const render = (q) => {
    const filtered = applySearch(all, q).slice().sort(sortByDateDesc);
    area.innerHTML = `<div class="grid grid--list">${renderCardList(filtered)}</div>`;
    initReveal(area);
    empty.hidden = filtered.length !== 0;
  };
  render("");
  $("#search")?.addEventListener("input", (e) => render(e.target.value));
}

/* Boot */
(async function(){
  $("#year").textContent = String(new Date().getFullYear());
  initTheme();
  initMenu();
  initReveal(document);

  const page = document.body.dataset.page;
  if (page === "home") await bootHome();
  if (page === "writeups") await bootWriteups();
  if (page === "projects") await bootProjects();
  if (page === "notes") await bootNotes();
})();
