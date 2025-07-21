// js/topicList.js

/**
 * Render an array of Firestore topic documents into the table body.
 * @param {HTMLTableSectionElement} tbody - The <tbody> element to populate.
 * @param {Array<import("https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js").QueryDocumentSnapshot>} topicDocs
 */
export function renderTopics(tbody, topicDocs) {
  // Clear existing rows
  tbody.innerHTML = '';

  topicDocs.forEach(doc => {
    const data = doc.data();
    const title       = data.title || '';
    const starterName = data.starterName || '';
    const replies     = data.replyCount != null ? data.replyCount : '';
    const lastUpdated = data.lastUpdated ? formatTimestamp(data.lastUpdated) : '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <a href="topic_detail.html?topicId=${encodeURIComponent(doc.id)}">
          ${escapeHtml(title)}
        </a>
      </td>
      <td>${escapeHtml(starterName)}</td>
      <td>${replies}</td>
      <td>${lastUpdated}</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Format a Firestore Timestamp to a human-readable string.
 * @param {import("https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js").Timestamp} ts
 * @returns {string}
 */
function formatTimestamp(ts) {
  const date = ts.toDate();
  return date.toLocaleString();
}

/**
 * Simple HTML-escape to prevent XSS in text content.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}