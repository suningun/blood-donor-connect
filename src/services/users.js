import { DB_BASE } from "../firebase.js";
import { fromFirestoreDoc } from "../utils/firestoreUtils.js";

export const getUser = async (uid, idToken) => {
  const res = await fetch(`${DB_BASE}/users/${uid}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error((await res.json().catch(() => ({})))?.error?.message ?? "Could not load donor profile");
  }

  return fromFirestoreDoc(await res.json());
};