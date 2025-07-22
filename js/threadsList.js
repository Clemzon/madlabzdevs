// js/threadsList.js
import {
  loadForums,
  loadForumTopics,
  createTopic,
  auth
} from "../js/firebase.js";

/** Simple helper to read ?forumId= from the URL */
function getForumId() {
  return new URLSearchParams(window.location.search).get("forumId");
}

async function init() {
  const forumId = getForumId();
  const titleEl = document.getElementById("forumTitle");
  const descEl  = document.getElementById("forumDesc");
  const list    = document.getElementById("threadsContainer");

  // Sanity check
  if (!list) {
    console.error("threadsContainer element not found on this page.");
    return;
  }

  // 1. Show forum metadata
  let forum;
  try {
    const forums = await loadForums();
    forum = forums.find(f => f.id === forumId);
  } catch (e) {
    console.error("Error loading forums:", e);
  }
  if (!forum) {
    titleEl.textContent = "Forum not found";
    descEl.textContent  = "";
    return;
  }
  titleEl.textContent = forum.title;
  descEl.textContent  = forum.description;

  // 2. Load & render threads
  list.innerHTML = "";  // clear
  let topics = [];
  try {
    topics = await loadForumTopics(forumId);
  } catch (e) {
    console.error("Error loading topics:", e);
    list.innerHTML = `<div class="alert alert-danger">Could not load threads.</div>`;
    return;
  }

  // 3. Fetch thread‐card template
  let tplText = "";
  try {
    const res = await fetch("./components/threadCard.html");
    if (!res.ok) throw new Error("Thread card template not found");
    tplText = await res.text();
  } catch (e) {
    console.error(e);
    list.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
    return;
  }

  // 4. Render each topic
  topics.forEach(topic => {
    const temp = document.createElement("template");
    temp.innerHTML = tplText.trim();
    const item = temp.content.firstElementChild;

    item.href = `thread.html?topicId=${topic.id}`;
    item.querySelector(".thread-title").textContent = topic.title;
    item.querySelector(".thread-body-snippet").textContent =
      topic.body.slice(0, 100) + (topic.body.length > 100 ? "…" : "");
    item.querySelector(".thread-author").textContent =
      `by ${topic.createdBy || "anonymous"}`;
    item.querySelector(".thread-updated").textContent =
      new Date(topic.lastUpdated.toDate()).toLocaleString();

    list.appendChild(item);
  });

  // 5. Wire up “New Thread” form (if present)
  const form = document.getElementById("formNewThread");
  if (form) {
    form.addEventListener("submit", async ev => {
      ev.preventDefault();
      const title = document.getElementById("threadTitle").value.trim();
      const body  = document.getElementById("threadBody").value.trim();
      if (!title || !body) return;

      try {
        const user = auth.currentUser;
        await createTopic({
          forumId,
          title,
          body,
          createdBy: user ? user.uid : "anonymous"
        });
        // Close modal & reset
        const modalEl = document.getElementById("newThreadModal");
        bootstrap.Modal.getInstance(modalEl).hide();
        form.reset();
        // Reload threads
        init();
      } catch (e) {
        console.error("Error creating thread:", e);
        alert("Could not post thread. See console for details.");
      }
    });
  }
}

// Kick off once the DOM is ready
document.addEventListener("DOMContentLoaded", init);