import { getPosts } from "../services/posts.js";
import { postCard } from "../components/postCard.js";
import { icon } from "../utils/icons.js";
import { btnOutline, btnPrimary, cardClass, skeletonClass } from "../utils/styles.js";

const steps = [
  { icon: "UserPlus", title: "Sign up", text: "Create a free donor account in under a minute." },
  { icon: "Search", title: "Find a request", text: "Filter urgent requests by province and blood type." },
  { icon: "Droplet", title: "Donate", text: "Register for a request and help save a life." },
];

export default async function home(container) {
  container.innerHTML = `
    <section class="relative isolate overflow-hidden bg-primary/5">
      <div class="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-primary/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"></div>
      <div class="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 md:py-28">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-tertiary">Community powered care</p>
        <h1 class="font-headline text-4xl font-bold tracking-tight text-neutral md:text-6xl">Give Blood, Save Lives</h1>
        <p class="mx-auto mt-5 max-w-xl text-base leading-7 text-neutral/70">
          Hospitals across Cambodia post urgent blood requests. Donors find them in one place instead of scattered social media posts.
        </p>
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/posts" data-link class="${btnPrimary}">Browse Requests ${icon("Search", { width: 17, height: 17 })}</a>
          <a href="/user-register" data-link class="${btnOutline}">Become a Donor</a>
        </div>
        <p id="stat" class="mt-8 text-sm text-neutral/60"></p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 class="mb-8 text-center font-headline text-2xl font-bold">How it works</h2>
      <div class="grid gap-4 md:grid-cols-3">
        ${steps.map((s, i) => `
          <div class="${cardClass} p-6 transition duration-150 hover:-translate-y-1 hover:shadow-md">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">${icon(s.icon, { width: 20, height: 20 })}</div>
            <h3 class="mt-4 font-headline font-semibold">${i + 1}. ${s.title}</h3>
            <p class="mt-2 text-sm leading-6 text-neutral/70">${s.text}</p>
          </div>`).join("")}
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
      <div class="mb-5 flex items-center justify-between gap-4">
        <h2 class="font-headline text-2xl font-bold">Latest urgent requests</h2>
        <a href="/posts" data-link class="text-tertiary text-sm font-medium">View all →</a>
      </div>
      <div id="latest" class="grid grid-cols-1 gap-4 md:grid-cols-3"><div class="${skeletonClass} h-40"></div><div class="${skeletonClass} h-40"></div><div class="${skeletonClass} h-40"></div></div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
      <div class="rounded-2xl bg-secondary p-8 text-center text-white shadow-sm md:p-10">
        <h2 class="font-headline text-xl font-bold">Are you a hospital?</h2>
        <p class="text-white/80 text-sm mt-1">Create an account and post a blood request in minutes.</p>
        <a href="/hospital-register" data-link class="mt-5 inline-flex rounded-xl bg-white px-5 py-2.5 font-semibold text-secondary transition hover:bg-white/90">Post a Request</a>
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