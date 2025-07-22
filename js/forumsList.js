// js/forumsList.js
import { loadForums, createForum, auth } from "./firebase.js";

let allForums = [];
let forumCardTpl = "";

/** Load the forumCard template from the correct path */
async function loadTemplate() {
  const res = await fetch("../forums/components/forumCard.html");
  if (!res.ok) throw new Error("Forum card template not found");
  forumCardTpl = await res.text();
}

/** Render the grid of forum cards */
function displayForums(forums) {
  const container = document.getElementById("forumsContainer");
  if (!container) return;
  container.innerHTML = "";

  forums.forEach(forum => {
    const tpl = document.createElement("template");
    tpl.innerHTML = forumCardTpl.trim();
    const card = tpl.content.firstElementChild;

    card.querySelector(".forum-title").textContent = forum.title;
    card.querySelector(".forum-desc").textContent  = forum.description;
    card.querySelector("a.forum-link").href        = `threads.html?forumId=${forum.id}`;

    const col = document.createElement("div");
    col.className = "col-md-4";
    col.appendChild(card);
    container.appendChild(col);
  });
}

/** Populate the sidebar navigation links */
function populateSidebar(forums) {
  const sidebar = document.getElementById("forumsSidebar");
  if (!sidebar) return;  // guard missing sidebar
  sidebar.innerHTML = "";

  forums.forEach(forum => {
    const li = document.createElement("li");
    li.className = "nav-item";
    li.innerHTML = `
      <a class="nav-link" href="threads.html?forumId=${forum.id}">
        ${forum.title}
      </a>
    `;
    sidebar.appendChild(li);
  });
}

/** Wire up the live search filter */
function setupSearch() {
  const input = document.getElementById("forumSearch");
  if (!input) return;
  input.addEventListener("input", () => {
    const term = input.value.trim().toLowerCase();
    const filtered = term
      ? allForums.filter(f =>
          f.title.toLowerCase().includes(term) ||
          f.description.toLowerCase().includes(term)
        )
      : allForums;
    displayForums(filtered);
  });
}

/** Handle “New Forum” submissions */
function setupNewForumForm() {
  const form = document.getElementById("formNewForum");
  if (!form) return;
  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    const title = document.getElementById("forumTitle")?.value.trim();
    const desc  = document.getElementById("forumDesc")?.value.trim();
    if (!title || !desc) return;

    const user = auth.currentUser;
    await createForum({
      title,
      description: desc,
      createdBy: user ? user.uid : "anonymous"
    });

    // Close modal & reset
    const modal = bootstrap.Modal.getInstance(document.getElementById("newForumModal"));
    modal?.hide();
    form.reset();

    // Reload data & UI
    allForums = await loadForums();
    const searchInput = document.getElementById("forumSearch");
    if (searchInput) searchInput.value = "";
    displayForums(allForums);
    populateSidebar(allForums);
  });
}

/** Entry point */
async function init() {
  try {
    await loadTemplate();
    allForums = await loadForums();

    displayForums(allForums);
    populateSidebar(allForums);
    setupSearch();
    setupNewForumForm();
  } catch (e) {
    console.error("forumsList init error:", e);
    const container = document.getElementById("forumsContainer");
    if (container) {
      container.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", init);