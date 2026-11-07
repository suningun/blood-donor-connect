import { getPosts } from "../services/posts.js";
import { postCard } from "./postCard.js";
import { icon } from "../utils/icons.js";
import { selectClass } from "../utils/styles.js";

export default async function postsList(container) {
  const idToken = localStorage.getItem("idToken");
  container.innerHTML = `<p class="p-6">កំពុងផ្ទុក...</p>`;

  if (!idToken) {
    container.innerHTML = `<p class="p-6">សូម <a href="/user-login" data-link class="text-blue-600">ចូល</a> ដើម្បីមើលសំណើ។</p>`;
    return;
  }

  let posts = [];
  try {
    posts = (await getPosts(idToken)).filter((p) => p.status === "active");
  } catch (err) {
    container.innerHTML = `<p class="p-6 text-red-600">${err.message}</p>`;
    return;
  }

  const provinces = [...new Set(posts.map((p) => p.province))];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const renderList = (list) => {
    container.querySelector("#list").innerHTML =
      list.length ? list.map(postCard).join("") : `<p class="text-gray-500">គ្មានសំណើទេ</p>`;
  };

  container.innerHTML = `
    <div class="max-w-5xl mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4">សំណើសុំឈាមបន្ទាន់</h1>
      <div class="flex gap-3 mb-4">
        <div class="relative">
          <select id="provinceFilter" class="${selectClass}">
            <option value="" class="text-neutral/40">ខេត្តទាំងអស់</option>
            ${provinces.map((p) => `<option value="${p}">${p}</option>`).join("")}
          </select>
          <span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/50">${icon("ChevronDown", { width: 16, height: 16 })}</span>
        </div>
        <div class="relative">
          <select id="bloodFilter" class="${selectClass}">
            <option value="" class="text-neutral/40">ប្រភេទឈាមទាំងអស់</option>
            ${bloodTypes.map((b) => `<option value="${b}">${b}</option>`).join("")}
          </select>
          <span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/50">${icon("ChevronDown", { width: 16, height: 16 })}</span>
        </div>
      </div>
      <div id="list" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
    </div>
  `;

  renderList(posts);

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