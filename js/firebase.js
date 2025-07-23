// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
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
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ————————————————————————————————————————————————
// Firebase config & initialization
// ————————————————————————————————————————————————
const firebaseConfig = {
  apiKey: "AIzaSyDAaHSlRVCDVQtjDjPMk3Rpfzth76aoEbc",
  authDomain: "madlabzdevs.firebaseapp.com",
  projectId: "madlabzdevs",
  storageBucket: "madlabzdevs.firebasestorage.app",
  messagingSenderId: "1035683722173",
  appId: "1:1035683722173:web:bd3091cd587a53a7b0d8d4"
};
const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// Persist in localStorage so reloads don’t log you out
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.warn("Could not set auth persistence:", err);
});

// ————————————————————————————————————————————————
// AUTH HELPERS
// ————————————————————————————————————————————————

/**
 * Create a new user, then set their displayName.
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function signUp(email, password, username) {
  // this will actually return a UserCredential
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  // attach the chosen username
  await updateProfile(cred.user, { displayName: username });
  return cred;
}

/**
 * Sign in an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/** Sign out the current user. */
export function signOutUser() {
  return signOut(auth);
}

/**
 * Listen for auth state changes.
 * @param {(user: import("firebase/auth").User|null) => void} callback
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ————————————————————————————————————————————————
// FIRESTORE APIs (unchanged from your original)
// ————————————————————————————————————————————————

export async function loadForums() {
  const snap = await getDocs(collection(db, "forums"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createForum(data) {
  return addDoc(collection(db, "forums"), {
    ...data,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
}

export async function loadForumTopics(forumId, { pageSize = 20, startAfterDoc } = {}) {
  let q = query(
    collection(db, "topics"),
    where("forumId", "==", forumId),
    orderBy("lastUpdated", "desc"),
    limit(pageSize)
  );
  if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const lastVisible = snap.docs[snap.docs.length - 1] || null;
  return { docs, lastVisible };
}

export async function createTopic(data) {
  return addDoc(collection(db, "topics"), {
    ...data,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
}

export async function loadThread(topicId) {
  const d = await getDoc(doc(db, "topics", topicId));
  if (!d.exists()) throw new Error("Thread not found");
  return { id: d.id, ...d.data() };
}

export async function loadComments(topicId, { pageSize = 20, startAfterDoc } = {}) {
  let q = query(
    collection(db, "comments"),
    where("topicId", "==", topicId),
    orderBy("createdAt", "asc"),
    limit(pageSize)
  );
  if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const lastVisible = snap.docs[snap.docs.length - 1] || null;
  return { docs, lastVisible };
}

export async function addComment(data) {
  return addDoc(collection(db, "comments"), {
    ...data,
    createdAt: serverTimestamp()
  });
}