const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[m]));
}

function sortByDateDesc(a, b) {
  return (b.date || "").localeCompare(a.date || "");
}

function initTheme() {
  const stored = localStorage.getItem("theme");
  if (stored) document.documentElement.dataset.theme = stored;

  const btn = $("#themeBtn");
  const setIcon = () => {
    const theme = document.documentElement.dataset.theme || "dark";
    if (btn) btn.querySelector(".icon").textContent = theme === "light" ? "☼" : "☾";
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

function initMenu() {
  const modal = $("#menu");
  const btn = $("#menuBtn");

  const open = () => { if (modal) modal.hidden = false; };
  const close = () => { if (modal) modal.hidden = true; };

  btn?.addEventListener("click", open);

  modal?.addEventListener("click", (e) => {
    const t = e.target;
    if (t?.dataset?.close === "true") close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) close();
  });
}

function initReveal(scope = document) {
  const els = $$(".reveal", scope);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("in");
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

/* Home */
async function bootHome(){
  try{
    const [w,p,n,lr] = await Promise.all([
      loadJson("content/writeups.json"),
      loadJson("content/projects.json"),
      loadJson("content/notes.json"),
      loadJson("content/learning-resources.json"),
    ]);

    $("#statWriteups").textContent = String(w.length);
    $("#statProjects").textContent = String(p.length);
    $("#statNotes").textContent = String(n.length);

    const el = $("#statLearning");
    if (el) el.textContent = String(lr.length);
  }catch(err){
    console.error(err);
  }
}

/* Shared renderers */
function renderCardList(items) {
  return items.map(x => `
    <a class="cardlink reveal" href="${escapeHtml(x.url || "#")}" ${x.external ? 'target="_blank" rel="noreferrer"' : ''}>
      <div class="meta">
        ${x.platform ? `<span class="tag">${escapeHtml(x.platform)}</span>` :
          (x.type ? `<span class="tag">${escapeHtml(x.type)}</span>` :
            `<span class="tag">Item</span>`)}
        ${x.date ? `<span>•</span><span>${escapeHtml(x.date)}</span>` : ``}
        ${x.stack ? `<span>•</span><span class="muted2">${escapeHtml(x.stack)}</span>` : ``}
      </div>
      <h3>${escapeHtml(x.title || "Untitled")}</h3>
      ${x.summary ? `<p>${escapeHtml(x.summary)}</p>` : ``}
      ${(x.tags && x.tags.length) ?
        `<div class="chips">${x.tags.slice(0, 10).map(t =>
          `<span class="tag">#${escapeHtml(t)}</span>`).join("")}</div>`
        : ``}
    </a>
  `).join("");
}

function applySearch(items, q) {
  const query = (q || "").trim().toLowerCase();
  if (!query) return items;

  return items.filter(x => {
    const hay = `${x.title || ""} ${(x.tags || []).join(" ")} ${x.summary || ""} ${x.platform || ""} ${x.stack || ""}`.toLowerCase();
    return hay.includes(query);
  });
}

/* Writeups */
async function bootWriteups() {
  const area = $("#contentArea");
  const empty = $("#empty");
  let all = [];

  try {
    all = await loadJson("content/writeups.json");
  } catch (err) {
    console.error(err);
    if (area) area.innerHTML = `<div class="empty">Couldn’t load writeups.json</div>`;
    return;
  }

  const render = (q) => {
    const filtered = applySearch(all, q).slice().sort(sortByDateDesc);
    if (area) area.innerHTML = `<div class="grid grid--cards">${renderCardList(filtered)}</div>`;
    if (area) initReveal(area);
    if (empty) empty.hidden = filtered.length !== 0;
  };

  render("");
  $("#search")?.addEventListener("input", e => render(e.target.value));
}

/* Projects */
async function bootProjects() {
  const area = $("#contentArea");
  const empty = $("#empty");
  let all = [];

  try {
    all = await loadJson("content/projects.json");
  } catch (err) {
    console.error(err);
    if (area) area.innerHTML = `<div class="empty">Couldn’t load projects.json</div>`;
    return;
  }

  const render = (q) => {
    const filtered = applySearch(all, q).slice().sort(sortByDateDesc);
    if (area) area.innerHTML = `<div class="grid grid--cards">${renderCardList(filtered)}</div>`;
    if (area) initReveal(area);
    if (empty) empty.hidden = filtered.length !== 0;
  };

  render("");
  $("#search")?.addEventListener("input", e => render(e.target.value));
}

/* Notes */
async function bootNotes() {
  const area = $("#contentArea");
  const empty = $("#empty");
  let all = [];

  try {
    all = await loadJson("content/notes.json");
  } catch (err) {
    console.error(err);
    if (area) area.innerHTML = `<div class="empty">Couldn’t load notes.json</div>`;
    return;
  }

  const render = (q) => {
    const filtered = applySearch(all, q).slice().sort(sortByDateDesc);
    if (area) area.innerHTML = `<div class="grid grid--cards">${renderCardList(filtered)}</div>`;
    if (area) initReveal(area);
    if (empty) empty.hidden = filtered.length !== 0;
  };

  render("");
  $("#search")?.addEventListener("input", e => render(e.target.value));
}

/* Learning Resources */
async function bootLearningResources() {
  const area = $("#contentArea");
  const empty = $("#empty");
  let all = [];

  try {
    all = await loadJson("content/learning-resources.json");
  } catch (err) {
    console.error(err);
    if (area) area.innerHTML = `<div class="empty">Couldn’t load learning-resources.json</div>`;
    return;
  }

  const render = (q) => {
    const filtered = applySearch(all, q).slice().sort(sortByDateDesc);
    if (area) area.innerHTML = `<div class="grid grid--cards">${renderCardList(filtered)}</div>`;
    if (area) initReveal(area);
    if (empty) empty.hidden = filtered.length !== 0;
  };

  render("");
  $("#search")?.addEventListener("input", e => render(e.target.value));
}

/* Read page */
function bootRead() {
  const backBtn = $("#backBtn");
  if (!backBtn) return;

  const params = new URLSearchParams(window.location.search);
  const mdPath = params.get("md");
  const srcUrl = params.get("src");

  if (!mdPath && srcUrl) {
    backBtn.hidden = true;
    return;
  }

  if (!mdPath) {
    backBtn.hidden = true;
    return;
  }

  let href = "";
  let label = "";

  if (mdPath.startsWith("writeups/")) {
    href = "writeups.html";
    label = "← Back to Writeups";
  } else if (mdPath.startsWith("projects/")) {
    href = "projects.html";
    label = "← Back to Projects";
  } else if (mdPath.startsWith("notes/")) {
    href = "notes.html";
    label = "← Back to Notes";
  } else if (mdPath.startsWith("learning-resources/")) {
    href = "learning-resources.html";
    label = "← Back to Learning Resources";
  }

  if (href && label) {
    backBtn.href = href;
    backBtn.textContent = label;
    backBtn.hidden = false;
  } else {
    backBtn.hidden = true;
  }
}

/* Boot */
(async function () {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  initTheme();
  initMenu();
  initReveal(document);

  const page = document.body.dataset.page;

  if (page === "home") await bootHome();
  if (page === "writeups") await bootWriteups();
  if (page === "projects") await bootProjects();
  if (page === "notes") await bootNotes();
  if (page === "learning-resources") await bootLearningResources();
  if (page === "read") bootRead();
})();
