import { DB_BASE } from "../firebase.js";
import { toFirestoreFields, fromFirestoreDoc } from "../utils/firestoreUtils.js";

const headers = (idToken) => ({
  "Content-Type": "application/json",
  ...(idToken && { Authorization: `Bearer ${idToken}` }),
});

const parseError = async (res) =>
  (await res.json().catch(() => ({})))?.error?.message ?? "Request failed";

export const getPosts = async (idToken) => {
  const res = await fetch(`${DB_BASE}/posts?pageSize=300`, { headers: headers(idToken) });
  if (!res.ok) throw new Error(await parseError(res));
  const { documents = [] } = await res.json();
  return documents
    .map(fromFirestoreDoc)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
};

export const getPostById = async (id, idToken) => {
  const res = await fetch(`${DB_BASE}/posts/${id}`, { headers: headers(idToken) });
  if (!res.ok) throw new Error(await parseError(res));
  return fromFirestoreDoc(await res.json());
};

export const getPostsByHospital = async (hospitalId, idToken) =>
  (await getPosts(idToken)).filter((p) => p.hospitalId === hospitalId);

export const createPost = async (data, idToken) => {
  const res = await fetch(`${DB_BASE}/posts`, {
    method: "POST",
    headers: headers(idToken),
    body: JSON.stringify(toFirestoreFields({ ...data, status: "active", createdAt: new Date() })),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return fromFirestoreDoc(await res.json());
};

export const updatePost = async (id, data, idToken) => {
  const mask = Object.keys(data).map((f) => `updateMask.fieldPaths=${f}`).join("&");
  const res = await fetch(`${DB_BASE}/posts/${id}?${mask}`, {
    method: "PATCH",
    headers: headers(idToken),
    body: JSON.stringify(toFirestoreFields(data)),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return fromFirestoreDoc(await res.json());
};

export const deletePost = async (id, idToken) => {
  const res = await fetch(`${DB_BASE}/posts/${id}`, { method: "DELETE", headers: headers(idToken) });
  if (!res.ok) throw new Error(await parseError(res));
};