// js/forumsList.js
import { loadForums, createForum, auth } from "./firebase.js";

async function renderForums() {
  const container = document.getElementById("forumsContainer");
  container.innerHTML = ""; // clear any existing

  try {
    const forums = await loadForums();
    // fetch template relative to forums.html
    const templateText = await fetch("./components/forumCard.html").then(r => {
      if (!r.ok) throw new Error("Template not found");
      return r.text();
    });

    forums.forEach(forum => {
      const temp = document.createElement("template");
      temp.innerHTML = templateText.trim();
      const card = temp.content.firstElementChild;

      // Fill in data
      card.querySelector(".forum-title").textContent = forum.title;
      card.querySelector(".forum-desc").textContent = forum.description;
      card.querySelector("a.forum-link").href = `threads.html?forumId=${forum.id}`;

      // Wrap in grid column
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.appendChild(card);
      container.appendChild(col);
    });

  } catch (e) {
    console.error("Error rendering forums:", e);
    container.innerHTML = `<div class="alert alert-danger">Failed to load forums.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Render on load
  renderForums();

  // Handle New Forum creation
  const newForumForm = document.getElementById("formNewForum");
  newForumForm.addEventListener("submit", async ev => {
    ev.preventDefault();
    const title = document.getElementById("forumTitle").value.trim();
    const desc  = document.getElementById("forumDesc").value.trim();
    if (!title || !desc) return;

    try {
      const user = auth.currentUser;
      const createdBy = user ? user.uid : "anonymous";

      await createForum({ title, description: desc, createdBy });

      // Close modal & reset form
      const modalEl = document.getElementById("newForumModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      newForumForm.reset();

      // Re-render list
      renderForums();

    } catch (e) {
      console.error("Error creating forum:", e);
      alert("Could not create forum. See console for details.");
    }
  });
});