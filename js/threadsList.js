// js/threadsList.js
import {
  loadForums,
  loadForumTopics,  // returns { docs, lastVisible }
  createTopic,
  auth
} from "../js/firebase.js";

let threadTpl = "";
let lastVisible = null;
const pageSize = 10;  // adjust as desired

/** Get forumId from URL */
function getForumId() {
  return new URLSearchParams(window.location.search).get("forumId");
}

/** Load the threadCard template once */
async function loadTemplate() {
  if (threadTpl) return;
  const res = await fetch("./components/threadCard.html");
  if (!res.ok) throw new Error("Thread card template not found");
  threadTpl = await res.text();
}

/** Render an array of threads; append if second argument is true */
function displayThreads(threads, append = false) {
  const list = document.getElementById("threadsContainer");
  if (!list) return;
  if (!append) list.innerHTML = "";

  threads.forEach(topic => {
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

/** Load and render the next page of threads */
async function loadPage(append = false) {
  const forumId = getForumId();
  try {
    const { docs, lastVisible: lv } = await loadForumTopics(forumId, {
      pageSize,
      startAfterDoc: append ? lastVisible : undefined
    });
    await loadTemplate();
    displayThreads(docs, append);
    lastVisible = lv;

    // Hide the button if no more pages
    const btn = document.getElementById("btnLoadMoreThreads");
    if (!lv || docs.length < pageSize) {
      btn.style.display = "none";
    } else {
      btn.style.display = "";
    }
  } catch (e) {
    console.error("Error loading threads page:", e);
    const list = document.getElementById("threadsContainer");
    if (list) {
      list.insertAdjacentHTML(
        "beforeend",
        `<div class="alert alert-danger">${e.message}</div>`
      );
    }
  }
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

/** Handle “New Thread” form */
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

    form.reset();
    // reload first page
    lastVisible = null;
    await loadPage(false);
  });
}

/** Initialize */
async function init() {
  try {
    await loadForumHeader();
    await loadPage(false);

    // Hook up Load More button
    const btn = document.getElementById("btnLoadMoreThreads");
    if (btn) {
      btn.addEventListener("click", () => loadPage(true));
    }

    setupForm();
  } catch (e) {
    console.error("threadsList init error:", e);
  }
}

document.addEventListener("DOMContentLoaded", init);