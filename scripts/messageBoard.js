// js/messageBoard.js
import { db } from './firebase.js';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

let currentSubforumId = null;

/**  
 * Render a list of topics under the selected subforum.
 * Expects a <ul id="topicList" class="list-group"> in the DOM.
 */
function loadTopics(subforumId) {
  const topicList = document.getElementById('topicList');
  if (!topicList) return;

  // Clear previous subscription
  if (window._topicUnsub) {
    window._topicUnsub();
    window._topicUnsub = null;
  }

  // Listen for real-time updates
  const q = query(
    collection(db, 'subforums', subforumId, 'topics'),
    orderBy('createdAt', 'desc')
  );
  window._topicUnsub = onSnapshot(q, snapshot => {
    topicList.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `<strong>${data.title}</strong><br><small>${new Date(data.createdAt.seconds * 1000).toLocaleString()}</small>`;
      topicList.appendChild(li);
    });
  });

  currentSubforumId = subforumId;
}

/**  
 * Handle “post new topic” form submissions.
 * Expects:
 *  - <form id="newTopicForm">
 *      <input id="topicTitle" />
 *      <textarea id="topicBody"></textarea>
 *      <button type="submit">Post</button>
 *    </form>
 */
function wireNewTopicForm() {
  const form = document.getElementById('newTopicForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!currentSubforumId) {
      alert('Please select a subforum first.');
      return;
    }

    const title = form.topicTitle.value.trim();
    const body  = form.topicBody.value.trim();
    if (!title || !body) {
      alert('Title and body cannot be empty.');
      return;
    }

    try {
      await addDoc(
        collection(db, 'subforums', currentSubforumId, 'topics'),
        {
          title,
          body,
          createdAt: new Date()
        }
      );
      form.reset();
    } catch (err) {
      console.error('Error posting topic:', err);
      alert('Failed to post topic.');
    }
  });
}

// Listen for subforum selection
document.addEventListener('subforumSelected', e => {
  const { subforumId } = e.detail;
  loadTopics(subforumId);
  // Optionally, scroll into view or open a modal...
});

// Wire the form once the DOM is ready
document.addEventListener('DOMContentLoaded', wireNewTopicForm);