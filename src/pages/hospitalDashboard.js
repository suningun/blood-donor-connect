import { createPost, getPostsByHospital, updatePost, deletePost } from "../services/posts.js";
import { getHospital } from "../services/hospitals.js";
import { getRegistrantsByPost } from "../services/registrations.js";
import { PROVINCES } from "../data/provinces.js";
import { icon } from "../utils/icons.js";
import { btnPrimary, cardClass, inputClass, selectClass } from "../utils/styles.js";
import { fadeIn, fadeOut, setButtonLoading, spinner, staggerChildren } from "../utils/motion.js";


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
    <div class="mx-auto max-w-5xl p-4 sm:p-6">
      <div class="mb-8 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-tertiary">Hospital dashboard</p>
          <h1 class="mt-2 flex items-center gap-2 font-headline text-3xl font-bold text-neutral">${icon("Home")} ${hospital.hospitalName}</h1>
        </div>
      </div>

      <form id="createForm" class="${cardClass} mb-8 space-y-3 p-5">
        <h2 class="font-headline font-semibold text-neutral flex items-center gap-1">${icon("Plus", { color: "#854F0B" })} Create New Request</h2>
        <div class="relative">
          <select name="province" required class="${selectClass}">
            <option value="" class="text-neutral/40">Select Province</option>
            ${PROVINCES.map((p) => `<option value="${p}">${p}</option>`).join("")}
          </select>
          <span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/50">${icon("ChevronDown", { width: 16, height: 16 })}</span>
        </div>
        <div class="relative">
          <select name="bloodType" required class="${selectClass}">
            ${["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => `<option>${b}</option>`).join("")}
          </select>
          <span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/50">${icon("ChevronDown", { width: 16, height: 16 })}</span>
        </div>
        <input name="unitsNeeded" type="number" placeholder="Units Needed" required
          class="${inputClass}" />
        <button class="${btnPrimary} w-full sm:w-auto">Create Request</button>
      </form>

      <div id="postList" class="space-y-3"></div>
    </div>
  `;

  const postList = container.querySelector("#postList");

  async function loadPosts() {
    const posts = await getPostsByHospital(uid, idToken);
    postList.innerHTML = posts.map((p) => `
      <div class="${cardClass} p-4 transition duration-150 hover:shadow-md">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-headline font-bold text-neutral">${p.bloodType} — ${p.unitsNeeded} units — ${p.province}</p>
            <p class="text-sm text-neutral/50">${p.status}</p>
          </div>
          <div class="flex flex-wrap gap-2 text-sm">
            <button data-view="${p.id}" class="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-tertiary transition hover:bg-tertiary/10">${icon("User")} Registrants</button>
            <button data-close="${p.id}" class="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-secondary transition hover:bg-secondary/10">${icon("Pencil")} Close</button>
            <button data-delete="${p.id}" class="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 font-medium text-primary transition hover:bg-primary/20">${icon("Trash2")} Delete</button>
          </div>
        </div>
        <div data-registrants="${p.id}" class="hidden mt-2 text-sm text-neutral/70"></div>
      </div>
    `).join("");
    staggerChildren(postList);

    postList.querySelectorAll("[data-view]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const postId = btn.dataset.view;
        const originalLabel = btn.innerHTML;
        setButtonLoading(btn, true, spinner(icon("User", { width: 16, height: 16 })));
        const regs = await getRegistrantsByPost(postId, uid, idToken);
        const box = postList.querySelector(`[data-registrants="${postId}"]`);
        
        box.classList.remove("hidden");
        box.innerHTML = regs.length
          ? regs.map((r) => `<p>${r.name} — ${r.phone} — ${r.gender}, ${r.age}y</p>`).join("")
          : `<p>No registrants yet.</p>`;
        btn.innerHTML = originalLabel;
        setButtonLoading(btn, false);
        fadeIn(box, { y: 4, duration: 180 });
      })
    );

    postList.querySelectorAll("[data-close]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        setButtonLoading(btn, true, spinner(icon("Pencil", { width: 16, height: 16 })));
        await updatePost(btn.dataset.close, { status: "fulfilled" }, idToken);
        loadPosts();
      })
    );

    postList.querySelectorAll("[data-delete]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const card = btn.parentElement?.parentElement;
        setButtonLoading(btn, true, spinner(icon("Trash2", { width: 16, height: 16 })));
        await deletePost(btn.dataset.delete, idToken);
        await fadeOut(card, { duration: 180 });
        loadPosts();
      })
    );
  }

  container.querySelector("#createForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const submitButton = e.target.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, spinner(icon("Plus", { width: 16, height: 16 })));
    try {
      await createPost({ ...data, unitsNeeded: Number(data.unitsNeeded), hospitalId: uid, hospitalName: "Hospital" }, idToken);
      e.target.reset();
      loadPosts();
    } finally {
      setButtonLoading(submitButton, false);
    }
  });

  loadPosts();
}