import { getPosts } from "../services/posts.js";
import { postCard } from "../components/postCard.js";
import { icon } from "../utils/icons.js";

const steps = [
  { icon: "UserPlus", title: "Sign up", text: "Create a free donor account in under a minute." },
  { icon: "Search", title: "Find a request", text: "Filter urgent requests by province and blood type." },
  { icon: "Droplet", title: "Donate", text: "Register for a request and help save a life." },
];

export default async function home(container) {
  container.innerHTML = `
    <section class="bg-primary/5">
      <div class="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 class="font-headline text-4xl md:text-5xl font-bold text-neutral">Give Blood, Save Lives</h1>
        <p class="mt-4 text-neutral/70 max-w-xl mx-auto">
          Hospitals across Cambodia post urgent blood requests. Donors find them in one place instead of scattered social media posts.
        </p>
        <div class="flex justify-center gap-3 mt-8">
          <a href="/posts" data-link class="bg-primary text-white font-medium px-5 py-2.5 rounded-md">Browse Requests</a>
          <a href="/user-register" data-link class="border border-neutral/30 font-medium px-5 py-2.5 rounded-md">Become a Donor</a>
        </div>
        <p id="stat" class="mt-8 text-sm text-neutral/60"></p>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-4 py-12">
      <h2 class="font-headline text-2xl font-bold mb-6 text-center">How it works</h2>
      <div class="grid md:grid-cols-3 gap-4">
        ${steps.map((s, i) => `
          <div class="bg-white border border-neutral/15 rounded-lg p-5">
            <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">${icon(s.icon, { width: 20, height: 20 })}</div>
            <h3 class="font-headline font-semibold mt-3">${i + 1}. ${s.title}</h3>
            <p class="text-sm text-neutral/70 mt-1">${s.text}</p>
          </div>`).join("")}
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-4 pb-12">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-headline text-2xl font-bold">Latest urgent requests</h2>
        <a href="/posts" data-link class="text-tertiary text-sm font-medium">View all →</a>
      </div>
      <div id="latest" class="grid grid-cols-1 md:grid-cols-3 gap-4"><p class="text-neutral/50">Loading...</p></div>
    </section>

    <section class="max-w-5xl mx-auto px-4 pb-4">
      <div class="bg-secondary text-white rounded-lg p-8 text-center">
        <h2 class="font-headline text-xl font-bold">Are you a hospital?</h2>
        <p class="text-white/80 text-sm mt-1">Create an account and post a blood request in minutes.</p>
        <a href="/hospital-register" data-link class="inline-block mt-4 bg-white text-secondary font-medium px-5 py-2 rounded-md">Post a Request</a>
      </div>
    </section>
  `;

  try {
    const active = (await getPosts()).filter((p) => p.status === "active");
    container.querySelector("#stat").textContent = `${active.length} active request${active.length === 1 ? "" : "s"} right now`;
    container.querySelector("#latest").innerHTML = active.length
      ? active.slice(0, 3).map(postCard).join("")
      : `<p class="text-neutral/50">No active requests yet.</p>`;
  } catch (err) {
    container.querySelector("#latest").innerHTML = `<p class="text-primary">${err.message}</p>`;
  }
}