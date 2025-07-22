// js/threadPage.js
import {
  loadForumTopics,
  loadComments,
  addComment,
  auth
} from "../js/firebase.js";

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

async function renderThread() {
  const topicId = getQueryParam("topicId");

  // Fetch all threads (or fetch single doc directly)
  const allThreads = await loadForumTopics(/* forumId not needed */);
  const thread = allThreads.find(t => t.id === topicId);
  if (!thread) {
    document.getElementById("threadTitle").textContent = "Thread not found";
    return;
  }

  document.getElementById("threadTitle").textContent = thread.title;
  document.getElementById("threadBody").textContent = thread.body;
  document.getElementById("threadMeta").textContent =
    `by ${thread.createdBy || "anon"} • ${new Date(thread.createdAt.toDate()).toLocaleString()}`;
}

async function renderComments() {
  const topicId = getQueryParam("topicId");
  const container = document.getElementById("commentsContainer");
  container.innerHTML = "";

  // correct relative path from forums/thread.html
  const tplText = await fetch("./components/commentItem.html").then(r => {
    if (!r.ok) throw new Error("Comment template not found");
    return r.text();
  });

  const comments = await loadComments(topicId);
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
  const container = document.getElementById("commentFormContainer");

  // correct relative path from forums/thread.html
  const tplText = await fetch("./components/newCommentForm.html").then(r => {
    if (!r.ok) throw new Error("Comment form template not found");
    return r.text();
  });
  container.innerHTML = tplText;

  const form = document.getElementById("formNewComment");
  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    const text = document.getElementById("commentText").value.trim();
    if (!text) return;

    const topicId = getQueryParam("topicId");
    const user = auth.currentUser;
    await addComment({ topicId, text, createdBy: user ? user.uid : "anonymous" });

    form.reset();
    renderComments();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderThread();
  await setupCommentForm();
  await renderComments();
});