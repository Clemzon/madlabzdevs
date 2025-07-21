// js/subforumList.js

/**
 * Render an array of subforum objects into a Bootstrap list-group.
 * @param {HTMLElement} container The <ul> element to populate.
 * @param {Array<{id: string, name: string}>} subforums
 */
export function renderSubforums(container, subforums) {
  // Clear existing items
  container.innerHTML = '';

  subforums.forEach(sub => {
    const li = document.createElement('li');
    li.className = 'list-group-item';

    const a = document.createElement('a');
    a.href = '#';
    a.className = 'text-decoration-none';
    a.dataset.subforumId = sub.id;
    a.textContent = sub.name;

    li.appendChild(a);
    container.appendChild(li);
  });
}

/**
 * Escape HTML to prevent XSS in text content.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}