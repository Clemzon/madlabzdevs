// js/forumsList.js
import { db, createForum, auth } from "./firebase.js";
import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let forumCardTpl = "";
let unsubscribeForums = null;

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

    // Populate title link
    const linkEl = card.querySelector("a.forum-link");
    if (linkEl) {
      linkEl.href = `threads.html?forumId=${forum.id}`;
      linkEl.textContent = forum.title;
    }

    // Populate description
    const descEl = card.querySelector(".forum-desc");
    if (descEl) {
      descEl.textContent = forum.description;
    }

    // Populate author name
    const authorEl = card.querySelector(".forum-author");
    if (authorEl) {
      authorEl.textContent = forum.username || "Anonymous";
    }

    // Wrap in column and append
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.appendChild(card);
    container.appendChild(col);
  });
}

/** Populate the sidebar navigation links */
function populateSidebar(forums) {
  const sidebar = document.getElementById("forumsSidebar");
  if (!sidebar) return;
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
function setupSearch(allForums) {
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
      createdBy: user ? user.uid : "anonymous",
      username: user ? user.displayName : "Anonymous"
    });

    // Close modal & reset
    const modal = bootstrap.Modal.getInstance(document.getElementById("newForumModal"));
    modal?.hide();
    form.reset();
  });
}

/** Subscribe to forums collection in real–time */
async function subscribeForums() {
  const forumsRef = collection(db, "forums");
  unsubscribeForums?.();
  unsubscribeForums = onSnapshot(forumsRef, snapshot => {
    const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    displayForums(all);
    populateSidebar(all);
    setupSearch(all);
  }, error => {
    console.error("Forums subscription error:", error);
  });
}

/** Entry point */
async function init() {
  try {
    await loadTemplate();
    await subscribeForums();
    setupNewForumForm();
  } catch (e) {
    console.error("forumsList init error:", e);
    const container = document.getElementById("forumsContainer");
    if (container) {
      container.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
    }
  }
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("beforeunload", () => unsubscribeForums?.());