import { API_KEY, AUTH_BASE, DB_BASE } from "../firebase.js";
import { toFirestoreFields } from "../utils/firestoreUtils.js";
import { verifyAccountRole } from "./accountRole.js";

const errorMessage = async (res, fallback) =>
  (await res.json().catch(() => ({})))?.error?.message ?? fallback;

export const registerHospital = async ({ email, password, hospitalName, phone, province }) => {
  const res = await fetch(`${AUTH_BASE}/accounts:signUp?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Registration failed");

  const { localId, idToken } = data;

  const profileRes = await fetch(`${DB_BASE}/hospitals/${localId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(toFirestoreFields({ hospitalName, phone, province, email })),
  });
  if (!profileRes.ok) {
    throw new Error(
      `Your account was created, but the hospital profile could not be saved: ${await errorMessage(profileRes, "Profile save failed")}`
    );
  }

  localStorage.setItem("role", "hospital");
  localStorage.setItem("idToken", idToken);
  localStorage.setItem("uid", localId);
  return data;
};

export const loginHospital = async ({ email, password }) => {
  const res = await fetch(`${AUTH_BASE}/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Login failed");

  await verifyAccountRole(data.localId, data.idToken, "hospital");

  localStorage.setItem("role", "hospital");
  localStorage.setItem("idToken", data.idToken);
  localStorage.setItem("uid", data.localId);
  return data;
};