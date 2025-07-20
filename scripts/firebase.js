

// scripts/firebase.js

// 1. Firebase SDK imports (v9 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// 2. Your Firebase config (replace with YOUR values)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 3. Initialize Firebase App, Auth, Firestore
const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// ─────────────────────────────────────────────────────────────────────────────
// Authentication Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sign up a new user with email & password, and set their displayName to `username`.
 * @param {string} email 
 * @param {string} password 
 * @param {string} username 
 * @returns {Promise<import("https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js").UserCredential>}
 */
export async function signUp(email, password, username) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  // set displayName
  await updateProfile(userCred.user, { displayName: username });
  return userCred;
}

/**
 * Sign in an existing user.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<import("https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js").UserCredential>}
 */
export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export function signOutUser() {
  return signOut(auth);
}

/**
 * Listen for auth state changes.
 * @param {(user: import("https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js").User|null) => void} callback
 * @returns {import("https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js").Unsubscribe}
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─────────────────────────────────────────────────────────────────────────────
// Firestore Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load all subforums.
 * @returns {Promise<Array<{id: string, name: string, description: string, iconClass?: string}>>}
 */
export async function loadSubforums() {
  const col = collection(db, "subforums");
  const snap = await getDocs(col);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Load a page of topics for a given subforum.
 * @param {string} subforumId 
 * @param {object} [options]
 * @param {number} [options.pageSize=20]
 * @param {import("https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js").QueryDocumentSnapshot} [options.startAfterDoc]
 * @returns {Promise<import("https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js").QueryDocumentSnapshot[]>}
 */
export async function loadTopics(subforumId, options = {}) {
  const { pageSize = 20, startAfterDoc } = options;

  let q = query(
    collection(db, "topics"),
    where("subforumId", "==", subforumId),
    orderBy("lastUpdated", "desc"),
    limit(pageSize)
  );

  if (startAfterDoc) {
    q = query(q, startAfter(startAfterDoc));
  }

  const snap = await getDocs(q);
  return snap.docs;
}