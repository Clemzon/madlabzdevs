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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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

// Auth helpers unchanged...
export async function signUp(email, password, username) { /* ... */ }
export function signIn(email, password) { /* ... */ }
export function signOutUser() { /* ... */ }
export function onAuthChange(callback) { /* ... */ }

// Forums
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

// Topics in a forum
export async function loadForumTopics(forumId, options = {}) {
  const { pageSize = 20, startAfterDoc } = options;
  let q = query(
    collection(db, "topics"),
    where("forumId", "==", forumId),
    orderBy("lastUpdated", "desc"),
    limit(pageSize)
  );
  if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function createTopic(data) {
  return addDoc(collection(db, "topics"), {
    ...data,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
}

// **New helper: load a single thread by ID**
export async function loadThread(topicId) {
  const d = await getDoc(doc(db, "topics", topicId));
  if (!d.exists()) throw new Error("Thread not found");
  return { id: d.id, ...d.data() };
}

// Comments
export async function loadComments(topicId) {
  const q = query(
    collection(db, "comments"),
    where("topicId", "==", topicId),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function addComment(data) {
  return addDoc(collection(db, "comments"), {
    ...data,
    createdAt: serverTimestamp()
  });
}