// js/firebase.js

// ─────────────────────────────────────────────────────────────────────────────
// 1. Firebase SDK imports (v12 modular)
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ─────────────────────────────────────────────────────────────────────────────
// 2. Your Firebase config (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDAaHSlRVCDVQtjDjPMk3Rpfzth76aoEbc",
  authDomain: "madlabzdevs.firebaseapp.com",
  projectId: "madlabzdevs",
  storageBucket: "madlabzdevs.firebasestorage.app",
  messagingSenderId: "1035683722173",
  appId: "1:1035683722173:web:bd3091cd587a53a7b0d8d4"
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Initialize Firebase App, Auth, Firestore
// ─────────────────────────────────────────────────────────────────────────────
const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// ─────────────────────────────────────────────────────────────────────────────
// Authentication Helpers (EXACTLY as you had them — NO CHANGES!)
// ─────────────────────────────────────────────────────────────────────────────
export async function signUp(email, password, username) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCred.user, { displayName: username });
  return userCred;
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOutUser() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─────────────────────────────────────────────────────────────────────────────
// Firestore Helpers for Forums & Threads
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load all forums (top-level categories).
 */
export async function loadForums() {
  const col = collection(db, "forums");
  const snap = await getDocs(col);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Create a new forum/category.
 * @param {{ title: string, description: string, createdBy: string }} data
 */
export async function createForum({ title, description, createdBy }) {
  const col = collection(db, "forums");
  const docRef = await addDoc(col, {
    title,
    description,
    createdBy,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
  return docRef;
}

/**
 * Load a page of topics (threads) for a given forum.
 */
export async function loadForumTopics(forumId, options = {}) {
  const { pageSize = 20, startAfterDoc } = options;

  let q = query(
    collection(db, "topics"),
    where("forumId", "==", forumId),
    orderBy("lastUpdated", "desc"),
    limit(pageSize)
  );

  if (startAfterDoc) {
    q = query(q, startAfter(startAfterDoc));
  }

  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Create a new thread/topic in a forum.
 * @param {{ forumId: string, title: string, body: string, createdBy: string }} data
 */
export async function createTopic({ forumId, title, body, createdBy }) {
  const col = collection(db, "topics");
  const docRef = await addDoc(col, {
    forumId,
    title,
    body,
    createdBy,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
  return docRef;
}

/**
 * Load comments for a given topic/thread.
 */
export async function loadComments(topicId) {
  const col = collection(db, "comments");
  const q = query(
    col,
    where("topicId", "==", topicId),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Add a comment to a topic.
 * @param {{ topicId: string, text: string, createdBy: string }} data
 */
export async function addComment({ topicId, text, createdBy }) {
  const col = collection(db, "comments");
  const docRef = await addDoc(col, {
    topicId,
    text,
    createdBy,
    createdAt: serverTimestamp()
  });
  return docRef;
}