import { DB_BASE } from "../firebase.js";
import { fromFirestoreDoc } from "../utils/firestoreUtils.js";

export const getHospital = async (uid, idToken) => {
  const res = await fetch(`${DB_BASE}/hospitals/${uid}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error?.message ?? "Could not load hospital profile");
  return fromFirestoreDoc(await res.json());
};