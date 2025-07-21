// scripts/firebase.js

// 1. Firebase SDK imports (v12 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// 2. Your updated Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDAaHSlRVCDVQtjDjPMk3Rpfzth76aoEbc",
  authDomain: "madlabzdevs.firebaseapp.com",
  projectId: "madlabzdevs",
  storageBucket: "madlabzdevs.firebasestorage.app",
  messagingSenderId: "1035683722173",
  appId: "1:1035683722173:web:bd3091cd587a53a7b0d8d4"
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
 */
export async function signUp(email, password, username) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCred.user, { displayName: username });
  return userCred;
}

/**
 * Sign in an existing user.
 */
export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out the current user.
 */
export function signOutUser() {
  return signOut(auth);
}

/**
 * Listen for auth state changes.
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─────────────────────────────────────────────────────────────────────────────
// Firestore Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load all subforums.
 */
export async function loadSubforums() {
  const col = collection(db, "subforums");
  const snap = await getDocs(col);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Load a page of topics for a given subforum.
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