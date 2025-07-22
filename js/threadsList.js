// js/threadsList.js
import {
  db,
  loadForums,
  createTopic,
  auth
} from "../js/firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let unsubscribeTopics = null;
let threadTpl = "";

/** Helper to get forumId from URL */
function getForumId() {
  return new URLSearchParams(window.location.search).get("forumId");
}

/** Load the threadCard template */
async function loadTemplate() {
  const res = await fetch("./components/threadCard.html");
  if (!res.ok) throw new Error("Thread card template not found");
  threadTpl = await res.text();
}

/** Render the list of topic docs */
function displayThreads(topics) {
  const list = document.getElementById("threadsContainer");
  if (!list) return;
  list.innerHTML = "";

  topics.forEach(topic => {
    const tmp = document.createElement("template");
    tmp.innerHTML = threadTpl.trim();
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

/** Subscribe to real-time updates for this forum’s topics */
async function subscribeTopics() {
  const forumId = getForumId();
  if (unsubscribeTopics) unsubscribeTopics();

  const q = query(
    collection(db, "topics"),
    where("forumId", "==", forumId),
    orderBy("lastUpdated", "desc")
  );

  unsubscribeTopics = onSnapshot(q, snapshot => {
    const topics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    displayThreads(topics);
  }, err => {
    console.error("Topics subscription error:", err);
  });
}

/** Load forum metadata once */
async function loadForumHeader() {
  const forumId = getForumId();
  const forums = await loadForums();
  const forum  = forums.find(f => f.id === forumId);
  const titleEl = document.getElementById("forumTitle");
  const descEl  = document.getElementById("forumDesc");
  if (!forum) {
    titleEl.textContent = "Forum not found";
    descEl.textContent  = "";
    return;
  }
  titleEl.textContent = forum.title;
  descEl.textContent  = forum.description;
}

/** Handle “New Thread” form submission */
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
  });
}

/** Initialize page: load header, template, subscribe, form */
async function init() {
  try {
    await loadForumHeader();
    await loadTemplate();
    await subscribeTopics();
    setupForm();
  } catch (e) {
    console.error("threadsList init error:", e);
    const list = document.getElementById("threadsContainer");
    if (list) list.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
  }
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("beforeunload", () => unsubscribeTopics?.());