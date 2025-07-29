// /js/header.js
import { onAuthChange, signOutUser } from "/js/firebase.js";

async function loadHeader() {
  try {
    const response = await fetch("/components/header.html");
    if (!response.ok) throw new Error(
      `Failed to load header (status ${response.status})`
    );
    const html = await response.text();
    const placeholder = document.getElementById("shared-header");
    if (!placeholder) throw new Error("Placeholder #shared-header not found");
    placeholder.innerHTML = html;

    const accountButton = document.getElementById("btnAccount");
    const menuList = document.getElementById("accountMenu");
    const navList = document.querySelector('nav.nav-links-scroll');
    if (!accountButton || !menuList || !navList) throw new Error("Header elements not found");

    onAuthChange(user => {
      document.body.classList.toggle("signed-in", !!user);
      if (user) {
        // Signed-in
        accountButton.textContent = user.displayName || "Anonymous";
        menuList.innerHTML = `
          <li><a class="dropdown-item" href="/profile.html">Profile</a></li>
          <li><button id="signOutButton" class="dropdown-item">Sign Out</button></li>
        `;
        document.getElementById("signOutButton").addEventListener(
          "click",
          signOutUser
        );

        // Add Profile link in nav if not present
        if (!document.getElementById("navProfileTab")) {
          const profileTab = document.createElement("a");
          profileTab.id = "navProfileTab";
          profileTab.className = "nav-link px-3";
          profileTab.href = "/profile.html";
          profileTab.textContent = "Profile";
          navList.appendChild(profileTab);
        }
      } else {
        // Signed-out
        accountButton.textContent = "Account";
        menuList.innerHTML = `
          <li><a class="dropdown-item" href="/auth/accounts/signin.html">Sign In</a></li>
          <li><a class="dropdown-item" href="/auth/accounts/signup.html">Sign Up</a></li>
        `;
        // Remove Profile link from nav if present
        const existingTab = document.getElementById("navProfileTab");
        if (existingTab) existingTab.remove();
      }
    });
  } catch (error) {
    console.error("Header load failed:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadHeader);