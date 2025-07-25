// js/forumsList.js
import { loadForums, createForum, auth } from "../js/firebase.js";

async function renderForums() {
  const container = document.getElementById("forumsContainer");
  container.innerHTML = "";

  try {
    const forums = await loadForums();
    const templateText = await fetch("./components/forumCard.html").then(r => {
      if (!r.ok) throw new Error("Template not found");
      return r.text();
    });

    forums.forEach(forum => {
      const temp = document.createElement("template");
      temp.innerHTML = templateText.trim();
      const card = temp.content.firstElementChild;

      // Populate title link (forum title is now the link)
      const linkEl = card.querySelector("a.forum-link");
      linkEl.href = `threads.html?forumId=${forum.id}`;
      linkEl.textContent = forum.title;

      // Populate description
      const descEl = card.querySelector(".forum-desc");
      descEl.textContent = forum.description;

      // Populate author link
      const authorLink = card.querySelector(".forum-author-link");
      if (authorLink) {
        authorLink.href = `/profile.html?uid=${forum.createdBy}`;
        authorLink.textContent = forum.username || "Anonymous";
      }

      // Wrap in column and append
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.appendChild(card);
      container.appendChild(col);
    });

  } catch (e) {
    console.error("Error rendering forums:", e);
    container.innerHTML = `<div class="alert alert-danger">Failed to load discussions.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderForums();

  const form = document.getElementById("formNewForum");
  form?.addEventListener("submit", async ev => {
    ev.preventDefault();
    const title = document.getElementById("forumTitle")?.value.trim();
    const desc  = document.getElementById("forumDesc")?.value.trim();
    if (!title || !desc) return;

    try {
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
      renderForums();
    } catch (err) {
      console.error("Error creating discussion:", err);
      alert("Could not create discussion. Please try again.");
    }
  });
});