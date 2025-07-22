// js/forumsList.js
import { loadForums, createForum, auth } from "./firebase.js";

let allForums = [];
let forumCardTpl = "";

/**
 * Render the grid of forum cards.
 */
function displayForums(forums) {
  const container = document.getElementById("forumsContainer");
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

/**
 * Render the sidebar navigation links.
 */
function populateSidebar(forums) {
  const sidebar = document.getElementById("forumsSidebar");
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

async function init() {
  const searchInput  = document.getElementById("forumSearch");
  const newForumForm = document.getElementById("formNewForum");

  // 1. Load the forumCard template from the correct location
  const tplRes = await fetch("../forums/components/forumCard.html");
  if (!tplRes.ok) throw new Error("Forum card template not found");
  forumCardTpl = await tplRes.text();

  // 2. Fetch all forums once
  allForums = await loadForums();

  // 3. Initial render of grid + sidebar
  displayForums(allForums);
  populateSidebar(allForums);

  // 4. Live-search filtering on the grid
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = term
      ? allForums.filter(f =>
          f.title.toLowerCase().includes(term) ||
          f.description.toLowerCase().includes(term)
        )
      : allForums;
    displayForums(filtered);
  });

  // 5. Handle "New Forum" submissions
  newForumForm.addEventListener("submit", async ev => {
    ev.preventDefault();
    const title = document.getElementById("forumTitle").value.trim();
    const desc  = document.getElementById("forumDesc").value.trim();
    if (!title || !desc) return;

    const user = auth.currentUser;
    await createForum({
      title,
      description: desc,
      createdBy: user ? user.uid : "anonymous"
    });

    // Close & reset
    new bootstrap.Modal(document.getElementById("newForumModal")).hide();
    newForumForm.reset();

    // Reload data, clear search, re-render everything
    allForums = await loadForums();
    searchInput.value = "";
    displayForums(allForums);
    populateSidebar(allForums);
  });
}

document.addEventListener("DOMContentLoaded", init);