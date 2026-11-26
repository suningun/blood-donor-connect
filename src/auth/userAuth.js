import { API_KEY, AUTH_BASE, DB_BASE } from "../firebase.js";
import { assessEligibility } from "../data/eligibility.js";
import { toFirestoreFields } from "../utils/firestoreUtils.js";
import { verifyAccountRole } from "./accountRole.js";

const errorMessage = async (res, fallback) =>
  (await res.json().catch(() => ({})))?.error?.message ?? fallback;

export const registerUser = async ({ email, password, username, phone, province, age, weight }) => {
  const eligibilityErrors = assessEligibility({ age, weight });
  if (eligibilityErrors.length) throw new Error(eligibilityErrors.join(" "));

  const res = await fetch(`${AUTH_BASE}/accounts:signUp?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Registration failed");

  const { localId, idToken } = data;

  const profileRes = await fetch(`${DB_BASE}/users/${localId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(
      toFirestoreFields({
        username,
        phone,
        province,
        email,
        age: Number(age),
        weight: Number(weight),
      })
    ),
  });
  if (!profileRes.ok) {
    throw new Error(
      `Your account was created, but the donor profile could not be saved: ${await errorMessage(profileRes, "Profile save failed")}`
    );
  }

  localStorage.setItem("role", "user");
  localStorage.setItem("idToken", idToken);
  localStorage.setItem("uid", localId);
  return data;
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${AUTH_BASE}/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Login failed");

  await verifyAccountRole(data.localId, data.idToken, "user");

  localStorage.setItem("role", "user");
  localStorage.setItem("idToken", data.idToken);
  localStorage.setItem("uid", data.localId);
  return data;
};