// js/subforumList.js
import { db } from './firebase.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

/**
 * Fetch and render the list of subforums.
 * Expects a <ul id="subforumList" class="list-group"> in the DOM.
 */
export async function loadSubforums() {
  const list = document.getElementById('subforumList');
  if (!list) {
    console.warn('No #subforumList element found.');
    return;
  }

  try {
    const snapshot = await getDocs(collection(db, 'subforums'));
    list.innerHTML = ''; // clear existing

    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <span>${data.name}</span>
        <button class="btn btn-sm btn-outline-primary" data-id="${doc.id}">
          New Topic
        </button>
      `;
      list.appendChild(li);
    });

    // Wire up each “New Topic” button
    list.querySelectorAll('button[data-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const subforumId = btn.dataset.id;
        document.dispatchEvent(new CustomEvent('subforumSelected', { detail: { subforumId } }));
      });
    });

  } catch (e) {
    console.error('Error loading subforums:', e);
    list.innerHTML = '<li class="list-group-item text-danger">Failed to load subforums.</li>';
  }
}

// Auto-run on page load
document.addEventListener('DOMContentLoaded', loadSubforums);