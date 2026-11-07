import { getPosts } from "../services/posts.js";
import { postCard } from "../components/postCard.js";
import { icon } from "../utils/icons.js";
import { PROVINCES } from "../data/provinces.js";

export default async function postsList(container) {
  container.innerHTML = `<p class="p-6 text-neutral/60">Loading...</p>`;

  let posts = [];
  try {
    posts = (await getPosts()).filter((p) => p.status === "active");
  } catch (err) {
    container.innerHTML = `<p class="p-6 text-primary">${err.message}</p>`;
    return;
  }


  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const renderList = (list) => {
    container.querySelector("#list").innerHTML =
      list.length ? list.map(postCard).join("") : `<p class="text-neutral/50">No requests found.</p>`;
  };

  container.innerHTML = `
    <div class="max-w-5xl mx-auto p-6">
      <h1 class="font-headline text-2xl font-bold mb-4 text-neutral flex items-center gap-2">${icon("Droplet", { color: "#D85A30" })} Urgent Blood Requests</h1>
      <div class="flex gap-3 mb-4">
        <select id="provinceFilter" class="border border-neutral/20 p-2 rounded-md">
          <option value="">All Provinces</option>
          ${PROVINCES.map((p) => `<option value="${p}">${p}</option>`).join("")}
        </select>
        <select id="bloodFilter" class="border border-neutral/20 p-2 rounded-md">
          <option value="">All Blood Types</option>
          ${bloodTypes.map((b) => `<option value="${b}">${b}</option>`).join("")}
        </select>
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