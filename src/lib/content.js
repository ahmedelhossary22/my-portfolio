import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { defaultContent } from "./defaultContent";

// Only this Google account can open /admin and change anything.
// It must match the email in firestore.rules.
export const ADMIN_EMAIL = "ahmedelhossery22@gmail.com";

const CONTENT_REF = ["site", "content"];
export const MESSAGES_COLLECTION = "messages";

/* ---------------- site content ---------------- */

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

// Objects are merged key by key (so new default fields still appear);
// arrays and text saved from the dashboard always win.
export function mergeContent(base, saved) {
  if (!isObject(base) || !isObject(saved)) return saved === undefined ? base : saved;

  const out = { ...base };
  for (const key of Object.keys(saved)) {
    out[key] = isObject(base[key]) ? mergeContent(base[key], saved[key]) : saved[key];
  }
  return out;
}

export async function loadContent() {
  const snap = await getDoc(doc(db, ...CONTENT_REF));
  return snap.exists() ? mergeContent(defaultContent, snap.data()) : defaultContent;
}

export async function saveContent(content) {
  // Firestore does not accept `undefined` values.
  const clean = JSON.parse(JSON.stringify(content));
  await setDoc(doc(db, ...CONTENT_REF), { ...clean, updatedAt: serverTimestamp() });
}

/* ---------------- contact messages ---------------- */

/*
  messages/{id} = {
    name, email, message,
    status: "new" | "read" | "archived",
    createdAt: server timestamp
  }
*/

export function addMessage({ name, email, message }) {
  return addDoc(collection(db, MESSAGES_COLLECTION), {
    name,
    email,
    message,
    status: "new",
    createdAt: serverTimestamp(),
  });
}

export function listenToMessages(callback, onError) {
  const q = query(collection(db, MESSAGES_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export const setMessageStatus = (id, status) =>
  updateDoc(doc(db, MESSAGES_COLLECTION, id), { status });

export const deleteMessage = (id) => deleteDoc(doc(db, MESSAGES_COLLECTION, id));
