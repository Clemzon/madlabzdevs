// js/threadPage.js
import {
  loadThread,
  loadComments,
  addComment,
  auth
} from "./firebase.js";

function getTopicId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("topicId");
}

async function renderThread() {
  const topicId = getTopicId();
  const contentEl = document.getElementById("threadContent");

  if (!topicId) {
    contentEl.innerHTML = `<div class="alert alert-warning">No thread specified in the URL.</div>`;
    return false;
  }

  try {
    const thread = await loadThread(topicId);

    document.getElementById("threadTitle").textContent = thread.title;
    document.getElementById("threadBody").textContent = thread.body;
    document.getElementById("threadMeta").textContent =
      `by ${thread.createdBy || "anonymous"} • ${new Date(thread.createdAt.toDate()).toLocaleString()}`;

    return true;
  } catch (e) {
    console.error("Error loading thread:", e);
    contentEl.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
    return false;
  }
}

async function renderComments() {
  const topicId = getTopicId();
  if (!topicId) return;

  const container = document.getElementById("commentsContainer");
  container.innerHTML = "";

  // Load comment template
  let tplText;
  try {
    const res = await fetch("./components/commentItem.html");
    if (!res.ok) throw new Error("Comment template not found");
    tplText = await res.text();
  } catch (e) {
    console.error(e);
    container.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
    return;
  }

  // Load comments from Firestore
  let comments;
  try {
    comments = await loadComments(topicId);
  } catch (e) {
    console.error("Error loading comments:", e);
    container.innerHTML = `<div class="alert alert-danger">Could not load comments.</div>`;
    return;
  }

  // Render each comment
  comments.forEach(c => {
    const temp = document.createElement("template");
    temp.innerHTML = tplText.trim();
    const card = temp.content.firstElementChild;

    card.querySelector(".comment-author").textContent = c.createdBy;
    card.querySelector(".comment-timestamp").textContent =
      new Date(c.createdAt.toDate()).toLocaleString();
    card.querySelector(".comment-text").textContent = c.text;

    container.appendChild(card);
  });
}

async function setupCommentForm() {
  const topicId = getTopicId();
  if (!topicId) return;

  const container = document.getElementById("commentFormContainer");

  // Load the form template
  let tplText;
  try {
    const res = await fetch("./components/newCommentForm.html");
    if (!res.ok) throw new Error("Comment form template not found");
    tplText = await res.text();
  } catch (e) {
    console.error(e);
    container.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
    return;
  }

  container.innerHTML = tplText;
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
      renderComments();
    } catch (e) {
      console.error("Error posting comment:", e);
      alert("Could not post comment. See console for details.");
    }
  });
}

// Bootstrap/modal scripts should be loaded after this module
document.addEventListener("DOMContentLoaded", async () => {
  const ok = await renderThread();
  if (!ok) return;
  await setupCommentForm();
  await renderComments();
});