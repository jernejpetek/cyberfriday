"use strict";

const DATA_FILES = {
  blog: "content/blog.json",
  labs: "content/labs.json",
  projects: "content/projects.json",
  research: "content/research.json"
};

const PAGE_LABELS = {
  blog: "Blog",
  labs: "Lab",
  projects: "Project",
  research: "Research"
};

document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  loadPageContent();
});

function setCurrentYear() {
  const yearElements = document.querySelectorAll("#year");

  yearElements.forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

async function loadPageContent() {
  const page = document.body.dataset.page;
  const contentArea = document.getElementById("contentArea");
  const emptyState = document.getElementById("empty");

  if (!page || !contentArea) {
    return;
  }

  const dataFile = DATA_FILES[page];

  if (!dataFile) {
    return;
  }

  try {
    const items = await fetchJson(dataFile);
    const normalizedItems = Array.isArray(items) ? items : [];

    if (normalizedItems.length === 0) {
      showEmpty(contentArea, emptyState);
      return;
    }

    const sortedItems = sortByDate(normalizedItems);

    contentArea.innerHTML = sortedItems
      .map((item) => renderListItem(item, page))
      .join("");

    if (emptyState) {
      emptyState.hidden = true;
    }
  } catch (error) {
    console.error(error);

    contentArea.innerHTML = "";

    if (emptyState) {
      emptyState.hidden = false;
      emptyState.textContent = "Content could not be loaded.";
    }
  }
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json();
}

function sortByDate(items) {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date || "1970-01-01").getTime();
    const dateB = new Date(b.date || "1970-01-01").getTime();

    return dateB - dateA;
  });
}

function renderListItem(item, page) {
  const title = escapeHtml(item.title || "Untitled");
  const summary = escapeHtml(item.summary || item.description || "");
  const date = formatDate(item.date);
  const type = escapeHtml(item.type || PAGE_LABELS[page] || "Post");
  const href = getItemHref(item);
  const tags = Array.isArray(item.tags) ? item.tags : [];

  const metaParts = [date, type].filter(Boolean);

  return `
    <a class="item" href="${escapeAttribute(href)}">
      ${
        metaParts.length > 0 || tags.length > 0
          ? `
            <div class="item__meta">
              ${metaParts.map((part) => `<span>${part}</span>`).join("")}
              ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
            </div>
          `
          : ""
      }

      <h2>${title}</h2>

      ${summary ? `<p>${summary}</p>` : ""}
    </a>
  `;
}

function getItemHref(item) {
  if (item.url) {
    return item.url;
  }

  if (item.href) {
    return item.href;
  }

  if (item.link) {
    return item.link;
  }

  if (item.md) {
    return `read.html?md=${encodeURIComponent(item.md)}`;
  }

  if (item.path) {
    return `read.html?md=${encodeURIComponent(item.path)}`;
  }

  if (item.file) {
    return item.file;
  }

  return "#";
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return escapeHtml(value);
  }

  return date.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function showEmpty(contentArea, emptyState) {
  contentArea.innerHTML = "";

  if (emptyState) {
    emptyState.hidden = false;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}