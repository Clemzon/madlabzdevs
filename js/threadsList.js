// js/threadsList.js
import {
  loadForums,
  loadForumTopics,
  createTopic,
  auth
} from "../js/firebase.js";

function getForumId() {
  return new URLSearchParams(window.location.search).get("forumId");
}

async function renderThreads() {
  const forumId = getForumId();
  const titleEl = document.getElementById("forumTitle");
  const descEl  = document.getElementById("forumDesc");
  const list    = document.getElementById("threadsContainer");

  if (!list || !titleEl || !descEl) return;

  list.innerHTML = ""; // clear existing

  // Load forum info
  const forums = await loadForums();
  const forum  = forums.find(f => f.id === forumId);
  if (!forum) {
    titleEl.textContent = "Forum not found";
    descEl.textContent  = "";
    return;
  }
  titleEl.textContent = forum.title;
  descEl.textContent  = forum.description;

  // Load threads
  const topics = await loadForumTopics(forumId);

  // Fetch threadCard template
  const res = await fetch("./components/threadCard.html");
  if (!res.ok) {
    list.innerHTML = `<div class="alert alert-danger">Template not found</div>`;
    return;
  }
  const tplText = await res.text();

  // Render each thread
  topics.forEach(topic => {
    const tmp = document.createElement("template");
    tmp.innerHTML = tplText.trim();
    const item = tmp.content.firstElementChild;

    item.href = `thread.html?topicId=${topic.id}`;
    item.querySelector(".thread-title").textContent        = topic.title;
    item.querySelector(".thread-body-snippet").textContent =
      topic.body.slice(0,100) + (topic.body.length > 100 ? "…" : "");
    item.querySelector(".thread-author").textContent       = `by ${topic.createdBy || "anon"}`;
    item.querySelector(".thread-updated").textContent      =
      new Date(topic.lastUpdated.toDate()).toLocaleString();

    list.appendChild(item);
  });
}

function setupForm() {
  const form = document.getElementById("formNewThread");
  if (!form) return;

  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    const title = document.getElementById("threadTitle").value.trim();
    const body  = document.getElementById("threadBody").value.trim();
    if (!title || !body) return;

    const forumId = getForumId();
    const user    = auth.currentUser;
    await createTopic({ forumId, title, body, createdBy: user?.uid || "anonymous" });

    // Close modal & reset
    const modalEl = document.getElementById("newThreadModal");
    bootstrap.Modal.getInstance(modalEl).hide();
    form.reset();

    // Re-render
    await renderThreads();
  });
}

async function init() {
  await renderThreads();
  setupForm();
}

document.addEventListener("DOMContentLoaded", init);