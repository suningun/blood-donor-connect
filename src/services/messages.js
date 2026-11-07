import { DB_BASE } from "../firebase.js";
import { toFirestoreFields } from "../utils/firestoreUtils.js";

export const createMessage = async (data) => {
  const res = await fetch(`${DB_BASE}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toFirestoreFields({ ...data, createdAt: new Date() })),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error?.message ?? "Could not send message");
};