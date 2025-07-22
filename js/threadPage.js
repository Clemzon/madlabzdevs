// js/threadPage.js
import {
  loadThread,    // used once to populate header if you prefer, but we’ll use onSnapshot
  addComment,
  auth,
  db
} from "./firebase.js";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let unsubscribeThread = null;
let unsubscribeComments = null;
let commentTpl = "";
let formTpl    = "";

/** Get topicId from URL */
function getTopicId() {
  return new URLSearchParams(window.location.search).get("topicId");
}

/** Load both the comment item and form templates */
async function loadTemplates() {
  const [cRes, fRes] = await Promise.all([
    fetch("./components/commentItem.html"),
    fetch("./components/newcommentForm.html")
  ]);
  if (!cRes.ok) throw new Error("Comment template not found");
  if (!fRes.ok) throw new Error("Comment form template not found");
  commentTpl = await cRes.text();
  formTpl    = await fRes.text();
}

/** Subscribe to the thread document for real-time updates */
function subscribeThread() {
  const topicId = getTopicId();
  if (!topicId) return;

  const threadRef = doc(db, "topics", topicId);
  unsubscribeThread = onSnapshot(threadRef, snap => {
    if (!snap.exists()) {
      document.getElementById("threadContent").innerHTML =
        `<div class="alert alert-danger">Thread not found</div>`;
      return;
    }
    const data = snap.data();
    document.getElementById("threadTitle").textContent = data.title;
    document.getElementById("threadBody").textContent  = data.body;
    document.getElementById("threadMeta").textContent  =
      `by ${data.createdBy || "anonymous"} • ${new Date(data.createdAt.toDate()).toLocaleString()}`;
  }, err => {
    console.error("Thread subscription error:", err);
  });
}

/** Subscribe to comments under this topic in real time */
function subscribeComments() {
  const topicId = getTopicId();
  if (!topicId) return;

  const q = query(
    collection(db, "comments"),
    where("topicId", "==", topicId),
    orderBy("createdAt", "asc")
  );
  unsubscribeComments = onSnapshot(q, snap => {
    const container = document.getElementById("commentsContainer");
    container.innerHTML = "";
    snap.docs.forEach(docSnap => {
      const data = docSnap.data();
      const tmp = document.createElement("template");
      tmp.innerHTML = commentTpl.trim();
      const card = tmp.content.firstElementChild;
      card.querySelector(".comment-author").textContent    = data.createdBy;
      card.querySelector(".comment-timestamp").textContent =
        new Date(data.createdAt.toDate()).toLocaleString();
      card.querySelector(".comment-text").textContent      = data.text;
      container.appendChild(card);
    });
  }, err => {
    console.error("Comments subscription error:", err);
  });
}

/** Render & wire up the new-comment form */
function setupCommentForm() {
  const topicId = getTopicId();
  if (!topicId) return;

  const container = document.getElementById("commentFormContainer");
  container.innerHTML = formTpl.trim();
  const form = document.getElementById("formNewComment");

  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    const text = document.getElementById("commentText").value.trim();
    if (!text) return;

    try {
      const user = auth.currentUser;
      await addComment({
        topicId,
        text,
        createdBy: user ? user.uid : "anonymous"
      });
      form.reset();
    } catch (e) {
      console.error("Error posting comment:", e);
      alert("Could not post comment. See console for details.");
    }
  });
}

/** Initialize everything */
async function init() {
  try {
    await loadTemplates();
    subscribeThread();
    subscribeComments();
    setupCommentForm();
  } catch (e) {
    console.error("threadPage init error:", e);
    document.getElementById("threadContent").innerHTML =
      `<div class="alert alert-danger">${e.message}</div>`;
  }
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("beforeunload", () => {
  unsubscribeThread?.();
  unsubscribeComments?.();
});