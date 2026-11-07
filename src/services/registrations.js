import { DB_BASE } from "../firebase.js";
import { toFirestoreFields, fromFirestoreDoc } from "../utils/firestoreUtils.js";

const authHeaders = (idToken) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${idToken}`,
});

const parseError = async (res) => {
  const body = await res.json().catch(() => ({}));
  return (Array.isArray(body) ? body[0] : body)?.error?.message ?? "Request failed";
};

// one registration per donor per post (document id = postId_userId)
export const registerToPost = async (data, idToken) => {
  const res = await fetch(`${DB_BASE}/registrations?documentId=${data.postId}_${data.userId}`, {
    method: "POST",
    headers: authHeaders(idToken),
    body: JSON.stringify(toFirestoreFields({ ...data, registeredAt: new Date() })),
  });
  if (res.status === 409) throw new Error("You have already registered for this request.");
  if (!res.ok) throw new Error(await parseError(res));
  return fromFirestoreDoc(await res.json());
};

// hospital only: registrants of one of its own posts
export const getRegistrantsByPost = async (postId, hospitalId, idToken) => {
  const res = await fetch(`${DB_BASE}:runQuery`, {
    method: "POST",
    headers: authHeaders(idToken),
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: "registrations" }],
        where: {
          compositeFilter: {
            op: "AND",
            filters: [
              { fieldFilter: { field: { fieldPath: "postId" }, op: "EQUAL", value: { stringValue: postId } } },
              { fieldFilter: { field: { fieldPath: "hospitalId" }, op: "EQUAL", value: { stringValue: hospitalId } } },
            ],
          },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()).filter((r) => r.document).map((r) => fromFirestoreDoc(r.document));
};