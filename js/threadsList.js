// js/threadsList.js
import {
  loadForums,
  loadForumTopics,
  // you’ll need createTopic in firebase.js (see note below)
  createTopic,
  auth
} from "../js/firebase.js";

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

async function renderThreads() {
  const forumId = getQueryParam("forumId");
  const titleEl = document.getElementById("forumTitle");
  const descEl  = document.getElementById("forumDesc");
  const list     = document.getElementById("threadsContainer");
  list.innerHTML = "";

  // 1. Load forum metadata
  const forums = await loadForums();
  const forum  = forums.find(f => f.id === forumId);
  if (!forum) {
    titleEl.textContent = "Forum not found";
    descEl.textContent  = "";
    return;
  }
  titleEl.textContent = forum.title;
  descEl.textContent  = forum.description;

  // 2. Load & render threads
  const topics = await loadForumTopics(forumId);
  const tplText = await fetch("./components/threadCard.html").then(r => {
    if (!r.ok) throw new Error("Template not found");
    return r.text();
  });

  topics.forEach(topic => {
    const temp = document.createElement("template");
    temp.innerHTML = tplText.trim();
    const item = temp.content.firstElementChild;

    item.href = `thread.html?topicId=${topic.id}`;
    item.querySelector(".thread-title").textContent = topic.title;
    item.querySelector(".thread-body-snippet").textContent =
      topic.body.slice(0, 100) + (topic.body.length > 100 ? "…" : "");
    item.querySelector(".thread-author").textContent = `by ${topic.createdBy || "anon"}`;
    item.querySelector(".thread-updated").textContent =
      new Date(topic.lastUpdated?.toDate()).toLocaleString();

    list.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderThreads();

  // Handle New Thread
  const form = document.getElementById("formNewThread");
  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    const title = document.getElementById("threadTitle").value.trim();
    const body  = document.getElementById("threadBody").value.trim();
    if (!title || !body) return;

    const forumId = getQueryParam("forumId");
    const user    = auth.currentUser;
    const createdBy = user ? user.uid : "anonymous";

    await createTopic({ forumId, title, body, createdBy });

    // close modal + reset
    const modalEl = document.getElementById("newThreadModal");
    bootstrap.Modal.getInstance(modalEl).hide();
    form.reset();

    // re-render
    renderThreads();
  });
});