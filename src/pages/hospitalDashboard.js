import { createPost, getPostsByHospital, updatePost, deletePost } from "../services/posts.js";
import { getHospital } from "../services/hospitals.js";
import { getRegistrantsByPost } from "../services/registrations.js";
import { PROVINCES } from "../data/provinces.js";
import { icon } from "../utils/icons.js";

export default async function hospitalDashboard(container) {
  const idToken = localStorage.getItem("idToken");
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");

  if (!idToken || role !== "hospital") {
    container.innerHTML = `<p class="p-6 text-neutral/60">Please <a href="/hospital-login" data-link class="text-tertiary font-medium">login</a> as a hospital.</p>`;
    return;
  }
  let hospital;
  try {
    hospital = await getHospital(uid, idToken);
  } catch (err) {
    container.innerHTML = `<p class="p-6 text-primary">${err.message}</p>`;
    return;
  }
  container.innerHTML = `
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="font-headline text-2xl font-bold mb-4 text-neutral flex items-center gap-2">${icon("Home")} ${hospital.hospitalName}</h1>

      <form id="createForm" class="border border-neutral/20 bg-white p-4 rounded-lg mb-6 space-y-2">
        <h2 class="font-headline font-semibold text-neutral flex items-center gap-1">${icon("Plus", { color: "#854F0B" })} Create New Request</h2>
        <select name="province" required class="w-full border border-neutral/20 p-2 rounded-md">
          <option value="">Select Province</option>
          ${PROVINCES.map((p) => `<option value="${p}">${p}</option>`).join("")}
        </select>
        <select name="bloodType" required class="w-full border border-neutral/20 p-2 rounded-md">
          ${["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => `<option>${b}</option>`).join("")}
        </select>
        <input name="unitsNeeded" type="number" placeholder="Units Needed" required
          class="w-full border border-neutral/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
        <button class="bg-primary text-white font-medium px-4 py-2 rounded-md">Create</button>
      </form>

      <div id="postList" class="space-y-3"></div>
    </div>
  `;

  const postList = container.querySelector("#postList");

  async function loadPosts() {
    const posts = await getPostsByHospital(uid, idToken);
    postList.innerHTML = posts.map((p) => `
      <div class="border border-neutral/20 bg-white p-3 rounded-lg">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-headline font-bold text-neutral">${p.bloodType} — ${p.unitsNeeded} units — ${p.province}</p>
            <p class="text-sm text-neutral/50">${p.status}</p>
          </div>
          <div class="flex gap-3 text-sm">
            <button data-view="${p.id}" class="flex items-center gap-1 text-tertiary font-medium">${icon("User")} Registrants</button>
            <button data-close="${p.id}" class="flex items-center gap-1 text-secondary font-medium">${icon("Pencil")} Close</button>
            <button data-delete="${p.id}" class="flex items-center gap-1 text-primary font-medium">${icon("Trash2")} Delete</button>
          </div>
        </div>
        <div data-registrants="${p.id}" class="hidden mt-2 text-sm text-neutral/70"></div>
      </div>
    `).join("");

    postList.querySelectorAll("[data-view]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const postId = btn.dataset.view;
        const regs = await getRegistrantsByPost(postId, idToken);
        const box = postList.querySelector(`[data-registrants="${postId}"]`);
        box.classList.remove("hidden");
        box.innerHTML = regs.length
          ? regs.map((r) => `<p>${r.name} — ${r.phone} — ${r.gender}, ${r.age}y</p>`).join("")
          : `<p>No registrants yet.</p>`;
      })
    );

    postList.querySelectorAll("[data-close]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        await updatePost(btn.dataset.close, { status: "fulfilled" }, idToken);
        loadPosts();
      })
    );

    postList.querySelectorAll("[data-delete]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        await deletePost(btn.dataset.delete, idToken);
        loadPosts();
      })
    );
  }

  container.querySelector("#createForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await createPost({ ...data, unitsNeeded: Number(data.unitsNeeded), hospitalId: uid, hospitalName: "Hospital" }, idToken);
    e.target.reset();
    loadPosts();
  });

  loadPosts();
}