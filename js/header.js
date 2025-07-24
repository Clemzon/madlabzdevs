// /js/header.js
import { onAuthChange, signOutUser } from "/js/firebase.js";

async function loadHeader() {
  try {
    // Fetch and inject header HTML
    const response = await fetch("/components/header.html");
    if (!response.ok) {
      throw new Error(`Failed to load header (status ${response.status})`);
    }
    const html = await response.text();
    const placeholder = document.getElementById("shared-header");
    if (!placeholder) {
      throw new Error("Placeholder #shared-header not found");
    }
    placeholder.innerHTML = html;

    // Grab dropdown elements
    const accountButton = document.getElementById("btnAccount");
    const menuList = document.getElementById("accountMenu");
    if (!accountButton || !menuList) {
      throw new Error("Header elements not found");
    }

    const navList = document.querySelector('nav .navbar-nav');
    if (!navList) {
      throw new Error("Nav list element not found");
    }

    // Rebuild menu on auth changes
    onAuthChange(user => {
      document.body.classList.toggle("signed-in", !!user);
      menuList.innerHTML = "";

      if (user) {
        // Display username
        accountButton.textContent = user.displayName || "Anonymous";

        // Profile link
        const profileItem = document.createElement("li");
        const profileLink = document.createElement("a");
        profileLink.className = "dropdown-item";
        profileLink.href = "/profile.html";
        profileLink.textContent = "Profile";
        profileItem.appendChild(profileLink);
        menuList.appendChild(profileItem);

        // Sign Out button
        const signOutItem = document.createElement("li");
        const signOutBtn = document.createElement("button");
        signOutBtn.id = "signOutButton";
        signOutBtn.type = "button";
        signOutBtn.className = "dropdown-item";
        signOutBtn.textContent = "Sign Out";
        signOutBtn.addEventListener("click", signOutUser);
        signOutItem.appendChild(signOutBtn);
        menuList.appendChild(signOutItem);

        // Add Profile tab to horizontal nav if not already present
        if (!document.getElementById('navProfileTab')) {
          const profileTab = document.createElement('li');
          profileTab.id = 'navProfileTab';
          profileTab.className = 'nav-item';
          profileTab.innerHTML = '<a class="nav-link px-3" href="/profile.html">Profile</a>';
          navList.appendChild(profileTab);
        }

      } else {
        // Guest menu
        accountButton.textContent = "Account";

        const signInItem = document.createElement("li");
        const signInLink = document.createElement("a");
        signInLink.className = "dropdown-item";
        signInLink.href = "/auth/accounts/signin.html";
        signInLink.textContent = "Sign In";
        signInItem.appendChild(signInLink);
        menuList.appendChild(signInItem);

        const signUpItem = document.createElement("li");
        const signUpLink = document.createElement("a");
        signUpLink.className = "dropdown-item";
        signUpLink.href = "/auth/accounts/signup.html";
        signUpLink.textContent = "Sign Up";
        signUpItem.appendChild(signUpLink);
        menuList.appendChild(signUpItem);

        // Remove Profile tab from horizontal nav if present
        const existingTab = document.getElementById('navProfileTab');
        if (existingTab) {
          existingTab.remove();
        }
      }
    });

  } catch (error) {
    console.error("Header load failed:", error);
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
});