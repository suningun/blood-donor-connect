import { createPost, getPostsByHospital, updatePost, deletePost } from "../services/posts.js";
import { getHospital } from "../services/hospitals.js";
import { getRegistrantsByPost } from "../services/registrations.js";
import { PROVINCES } from "../data/provinces.js";
import { icon } from "../utils/icons.js";
import { link } from "../utils/url.js";
import { btnOutline, btnPrimary, cardClass, chipClass, inputClass, selectClass } from "../utils/styles.js";
import { fadeIn, fadeOut, setButtonLoading, spinner, staggerChildren } from "../utils/motion.js";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default async function hospitalDashboard(container) {
  const idToken = localStorage.getItem("idToken");
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");

  if (!idToken || role !== "hospital") {
    container.innerHTML = `<p class="p-6 text-neutral/60">Please <a href="${link("/hospital-login")}" data-link class="text-tertiary font-medium">login</a> as a hospital.</p>`;
    return;
  }
  let hospital;
  try {
    hospital = await getHospital(uid, idToken);
  } catch (err) {
    container.innerHTML = `<p class="p-6 text-primary">${err.message}</p>`;
    return;
  }
  if (!hospital) {
    container.innerHTML = `<p class="p-6 text-primary">Hospital profile not found. Please sign in again.</p>`;
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
            ${BLOOD_TYPES.map((b) => `<option>${b}</option>`).join("")}
          </select>
          <span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/50">${icon("ChevronDown", { width: 16, height: 16 })}</span>
        </div>
        <input name="unitsNeeded" type="number" min="1" step="1" placeholder="Units Needed" required
          class="${inputClass}" />
        <button type="submit" class="${btnPrimary} w-full sm:w-auto">Create Request</button>
        <p id="createError" class="hidden text-sm text-primary"></p>
      </form>

      <div id="postList" class="space-y-3"></div>
    </div>
  `;

  const postList = container.querySelector("#postList");
  const createForm = container.querySelector("#createForm");
  const createError = container.querySelector("#createError");

  const showError = (card, err) => {
    const box = card?.querySelector("[data-error]");
    if (!box) return;
    box.textContent = err.message;
    box.classList.remove("hidden");
    fadeIn(box, { y: 4, duration: 180 });
  };

  const clearError = (card) => {
    const box = card?.querySelector("[data-error]");
    if (box) {
      box.textContent = "";
      box.classList.add("hidden");
    }
  };

  async function loadPosts() {
    let posts;
    try {
      posts = await getPostsByHospital(uid, idToken);
    } catch (err) {
      postList.innerHTML = `<p class="text-sm text-primary">${err.message}</p>`;
      return;
    }

    postList.innerHTML = posts.map((p) => {
      const active = p.status === "active";
      return `
      <div class="${cardClass} p-4 transition duration-150 hover:shadow-md" data-post="${p.id}">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-headline font-bold text-neutral">${p.bloodType} — ${p.unitsNeeded} units — ${p.province}</p>
            <span class="${chipClass} mt-2 ${active ? "bg-secondary/10 text-secondary" : "bg-neutral/10 text-neutral/60"}">${active ? "Active" : "Fulfilled"}</span>
          </div>
          <div class="flex flex-wrap gap-2 text-sm">
            <button data-view="${p.id}" class="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-tertiary transition hover:bg-tertiary/10">${icon("User")} Registrants</button>
            <button data-edit="${p.id}" class="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-tertiary transition hover:bg-tertiary/10">${icon("Pencil")} Edit</button>
            <button data-status="${p.id}" data-current="${p.status}" class="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-secondary transition hover:bg-secondary/10">
              ${icon("Check")} ${active ? "Close" : "Reopen"}
            </button>
            <button data-delete="${p.id}" class="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 font-medium text-primary transition hover:bg-primary/20">${icon("Trash2")} Delete</button>
          </div>
        </div>

        <form data-edit-form="${p.id}" class="mt-3 hidden grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
          <div class="relative">
            <select name="province" required class="${selectClass}">
              ${PROVINCES.map((prov) => `<option value="${prov}" ${prov === p.province ? "selected" : ""}>${prov}</option>`).join("")}
            </select>
            <span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/50">${icon("ChevronDown", { width: 16, height: 16 })}</span>
          </div>
          <div class="relative">
            <select name="bloodType" required class="${selectClass}">
              ${BLOOD_TYPES.map((b) => `<option ${b === p.bloodType ? "selected" : ""}>${b}</option>`).join("")}
            </select>
            <span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/50">${icon("ChevronDown", { width: 16, height: 16 })}</span>
          </div>
          <input name="unitsNeeded" type="number" min="1" step="1" value="${p.unitsNeeded}" required aria-label="Units needed" class="${inputClass}" />
          <div class="flex gap-2">
            <button type="submit" class="${btnPrimary}">Save</button>
            <button type="button" data-cancel class="${btnOutline}">Cancel</button>
          </div>
        </form>

        <div data-registrants="${p.id}" class="hidden mt-2 text-sm text-neutral/70"></div>
        <p data-error class="mt-2 hidden text-sm text-primary"></p>
      </div>`;
    }).join("");
    staggerChildren(postList);

    postList.querySelectorAll("[data-post]").forEach((card) => {
      const postId = card.dataset.post;

      card.querySelector("[data-view]").addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        const originalLabel = btn.innerHTML;
        clearError(card);
        setButtonLoading(btn, true, spinner(icon("User", { width: 16, height: 16 })));
        try {
          const regs = await getRegistrantsByPost(postId, uid, idToken);
          const box = card.querySelector(`[data-registrants="${postId}"]`);
          box.classList.remove("hidden");
          box.innerHTML = regs.length
            ? regs.map((r) => `<p>${r.name} — ${r.phone} — ${r.gender}, ${r.age}y</p>`).join("")
            : `<p>No registrants yet.</p>`;
          fadeIn(box, { y: 4, duration: 180 });
        } catch (err) {
          showError(card, err);
        } finally {
          btn.innerHTML = originalLabel;
          setButtonLoading(btn, false);
        }
      });

      const editForm = card.querySelector(`[data-edit-form="${postId}"]`);

      card.querySelector("[data-edit]").addEventListener("click", () => {
        clearError(card);
        editForm.classList.toggle("hidden");
        if (!editForm.classList.contains("hidden")) fadeIn(editForm, { y: 4, duration: 160 });
      });

      editForm.querySelector("[data-cancel]").addEventListener("click", () => {
        editForm.classList.add("hidden");
      });

      editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearError(card);
        const saveButton = editForm.querySelector("button[type='submit']");
        const data = Object.fromEntries(new FormData(editForm));
        const units = Number(data.unitsNeeded);
        if (!Number.isInteger(units) || units < 1) {
          showError(card, new Error("Units needed must be a whole number of at least 1."));
          return;
        }

        setButtonLoading(saveButton, true, spinner(icon("Check", { width: 16, height: 16 })));
        try {
          await updatePost(
            postId,
            { province: data.province, bloodType: data.bloodType, unitsNeeded: units },
            idToken
          );
          await loadPosts();
        } catch (err) {
          showError(card, err);
          setButtonLoading(saveButton, false);
        }
      });

      card.querySelector("[data-status]").addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        const nextStatus = btn.dataset.current === "active" ? "fulfilled" : "active";
        clearError(card);
        setButtonLoading(btn, true, spinner(icon("Check", { width: 16, height: 16 })));
        try {
          await updatePost(postId, { status: nextStatus }, idToken);
          await loadPosts();
        } catch (err) {
          showError(card, err);
          setButtonLoading(btn, false);
        }
      });

      card.querySelector("[data-delete]").addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        if (!window.confirm("Delete this request? This cannot be undone.")) return;
        clearError(card);
        setButtonLoading(btn, true, spinner(icon("Trash2", { width: 16, height: 16 })));
        try {
          await deletePost(postId, idToken);
          await fadeOut(card, { duration: 180 });
          await loadPosts();
        } catch (err) {
          showError(card, err);
          setButtonLoading(btn, false);
        }
      });
    });
  }

  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    createError.classList.add("hidden");
    createError.textContent = "";

    const data = Object.fromEntries(new FormData(createForm));
    const units = Number(data.unitsNeeded);
    if (!Number.isInteger(units) || units < 1) {
      createError.textContent = "Units needed must be a whole number of at least 1.";
      createError.classList.remove("hidden");
      return;
    }

    const submitButton = createForm.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, spinner(icon("Plus", { width: 16, height: 16 })));
    try {
      await createPost(
        { ...data, unitsNeeded: units, hospitalId: uid, hospitalName: hospital.hospitalName },
        idToken
      );
      createForm.reset();
      await loadPosts();
    } catch (err) {
      createError.textContent = err.message;
      createError.classList.remove("hidden");
      fadeIn(createError, { y: 4, duration: 180 });
    } finally {
      setButtonLoading(submitButton, false);
    }
  });

  await loadPosts();
}
