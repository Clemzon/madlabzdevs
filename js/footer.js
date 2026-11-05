// /js/footer.js
async function loadFooter() {
  const placeholder = document.getElementById("shared-footer");
  if (!placeholder) return;

  try {
    const response = await fetch("/components/footer.html");

    if (!response.ok) {
      throw new Error(`Failed to load footer (status ${response.status})`);
    }

    placeholder.innerHTML = await response.text();

    const yearElement = placeholder.querySelector("#year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  } catch (error) {
    console.error("Footer load failed:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadFooter);