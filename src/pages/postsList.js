import { getPosts } from "../services/posts.js";
import { postCard } from "../components/postCard.js";
import { icon } from "../utils/icons.js";
import { PROVINCES } from "../data/provinces.js";
import { cardClass, inputClass, selectClass, skeletonClass } from "../utils/styles.js";
import { fadeIn, fadeSwap, staggerChildren } from "../utils/motion.js";

export default async function postsList(container) {
  container.innerHTML = `<div class="mx-auto max-w-6xl space-y-4 p-6"><div class="${skeletonClass} h-10 w-64"></div><div class="${skeletonClass} h-12"></div><div class="grid gap-4 md:grid-cols-3"><div class="${skeletonClass} h-44"></div><div class="${skeletonClass} h-44"></div><div class="${skeletonClass} h-44"></div></div></div>`;

  let posts = [];
  try {
    posts = (await getPosts()).filter((p) => p.status === "active");
  } catch (err) {
    container.innerHTML = `<p class="p-6 text-primary">${err.message}</p>`;
    return;
  }


  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const renderList = (list) => {
    const listElement = container.querySelector("#list");
    fadeSwap(listElement, () => {
      listElement.innerHTML = list.length ? list.map(postCard).join("") : `<p class="text-neutral/50">No requests found.</p>`;
      staggerChildren(listElement);
    });
  };

  container.innerHTML = `
    <div class="mx-auto max-w-6xl p-4 sm:p-6">
      <div class="mb-8">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-tertiary">Find an opportunity to help</p>
        <h1 class="mt-2 flex items-center gap-2 font-headline text-3xl font-bold text-neutral">${icon("Droplet", { color: "#D85A30" })} Urgent Blood Requests</h1>
      </div>
      <div class="${cardClass} mb-6 flex flex-col gap-3 p-4 sm:flex-row">
        <div class="relative md:w-48">
          <select id="provinceFilter" class="${selectClass}">
            <option value="" class="text-neutral/40">All Provinces</option>
            ${PROVINCES.map((p) => `<option value="${p}">${p}</option>`).join("")}
          </select>
          <span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/50">${icon("ChevronDown", { width: 16, height: 16 })}</span>
        </div>
        <div class="relative md:w-48">
          <select id="bloodFilter" class="${selectClass}">
            <option value="" class="text-neutral/40">All Blood Types</option>
            ${bloodTypes.map((b) => `<option value="${b}">${b}</option>`).join("")}
          </select>
          <span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/50">${icon("ChevronDown", { width: 16, height: 16 })}</span>
        </div>
      </div>
      <div id="list" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"></div>
    </div>
  `;

  renderList(posts);
  fadeIn(container.querySelector(".mx-auto"), { y: 8 });

  container.querySelector("#provinceFilter").addEventListener("change", applyFilters);
  container.querySelector("#bloodFilter").addEventListener("change", applyFilters);

  function applyFilters() {
    const province = container.querySelector("#provinceFilter").value;
    const bloodType = container.querySelector("#bloodFilter").value;
    const filtered = posts.filter(
      (p) => (!province || p.province === province) && (!bloodType || p.bloodType === bloodType)
    );
    renderList(filtered);
  }
}