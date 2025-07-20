// components/topicList.js

/**
 * Renders topic documents into the topics table <tbody>.
 * @param {HTMLElement} tbodyEl
 * @param {Array<import("@firebase/firestore").DocumentSnapshot>} topicDocs
 */
export function renderTopics(tbodyEl, topicDocs) {
  tbodyEl.innerHTML = "";
  topicDocs.forEach(docSnap => {
    const data = docSnap.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <a href="#" class="fw-semibold">${data.title}</a>
      </td>
      <td>${data.starterName}</td>
      <td>${data.replyCount || 0}</td>
      <td>
        ${new Date(data.lastUpdated.toMillis()).toLocaleDateString()}
        <br><small>by ${data.lastPosterName}</small>
      </td>
    `;
    tbodyEl.appendChild(tr);
  });
}