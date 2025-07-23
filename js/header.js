// js/header.js
import { onAuthChange, signOutUser } from "./firebase.js";

async function loadHeader() {
  const res = await fetch("/components/header.html");
  if (!res.ok) throw new Error("Could not load header component");
  const html = await res.text();

  // inject header at top of body
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  document.body.prepend(wrapper);

  const btnAccount  = document.getElementById("btnAccount");
  const accountMenu = document.getElementById("accountMenu");

  onAuthChange(user => {
    // toggle signed-in class
    document.body.classList.toggle("signed-in", !!user);

    // clear any old listeners
    accountMenu.innerHTML = "";

    if (user) {
      // use displayName, fall back to email prefix
      const name = user.displayName || user.email.split("@")[0];
      btnAccount.textContent = name;

      accountMenu.insertAdjacentHTML("beforeend", `
        <li><a class="dropdown-item" href="/profile.html">Profile</a></li>
        <li><button id="signOutButton" class="dropdown-item">Sign Out</button></li>
      `);
      document
        .getElementById("signOutButton")
        .addEventListener("click", () => signOutUser());
    } else {
      btnAccount.textContent = "Account";
      accountMenu.insertAdjacentHTML("beforeend", `
        <li><a class="dropdown-item" href="/auth/accounts/signin.html">Sign In</a></li>
        <li><a class="dropdown-item" href="/auth/accounts/signup.html">Sign Up</a></li>
      `);
    }
  });
}

loadHeader().catch(err => console.error("Header load failed:", err));