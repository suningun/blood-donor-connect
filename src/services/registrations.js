import { DB_BASE } from "../firebase.js";
import { toFirestoreFields, fromFirestoreDoc } from "../utils/firestoreUtils.js";

const authHeaders = (idToken) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${idToken}`,
});

export const registerToPost = async (data, idToken) => {
  const res = await fetch(`${DB_BASE}/registrations`, {
    method: "POST",
    headers: authHeaders(idToken),
    body: JSON.stringify(toFirestoreFields({ ...data, registeredAt: new Date() })),
  });
  if (!res.ok) throw new Error((await res.json()).error?.message);
  return fromFirestoreDoc(await res.json());
};

export const getAllRegistrations = async (idToken) => {
  const res = await fetch(`${DB_BASE}/registrations`, { headers: authHeaders(idToken) });
  const { documents = [] } = await res.json();
  return documents.map(fromFirestoreDoc);
};

export const getRegistrantsByPost = async (postId, idToken) => {
  const all = await getAllRegistrations(idToken);
  return all.filter((r) => r.postId === postId);
};