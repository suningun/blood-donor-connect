import { icon } from "../utils/icons.js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Requests" },
  { href: "/blood-info", label: "Donation Info" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const renderHeader = (container) => {
  const role = localStorage.getItem("role");
  const current = location.pathname;

  const common = navLinks
    .map(({ href, label }) => {
      const active = current === href || (href === "/posts" && current.startsWith("/post/"));
      return `<a href="${href}" data-link class="relative py-2 text-sm transition hover:text-primary ${active ? "text-primary font-semibold after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary" : "text-neutral/70"}">${label}</a>`;
    })
    .join("");

  const authLinks = {
    guest: `
      <a href="/user-login" data-link class="text-neutral/70 transition hover:text-primary">Donor Login</a>
      <a href="/hospital-login" data-link class="text-neutral/70 transition hover:text-primary">Hospital Login</a>
      <a href="/user-register" data-link class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95">Sign Up</a>`,
    user: `
      <button id="logoutBtn" class="flex items-center gap-1 text-neutral/60 transition hover:text-primary">${icon("LogOut")} Logout</button>`,
    hospital: `
      <a href="/hospital-dashboard" data-link class="flex items-center gap-1 text-neutral/70 transition hover:text-primary">${icon("Home")} Dashboard</a>
      <button id="logoutBtn" class="flex items-center gap-1 text-neutral/60 transition hover:text-primary">${icon("LogOut")} Logout</button>`,
  };

  container.innerHTML = `
    <header class="sticky top-0 z-20 border-b border-neutral/10 bg-white/80 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="/" data-link class="flex items-center gap-2 font-headline text-lg font-bold text-primary sm:text-xl">${icon("Droplet", { width: 22, height: 22 })} Blood Donor Connect</a>
        <details class="relative lg:hidden">
          <summary class="flex cursor-pointer list-none items-center rounded-xl p-2 text-neutral transition hover:bg-neutral/5" aria-label="Open navigation menu">${icon("Menu")}</summary>
          <nav class="absolute right-0 top-12 w-64 rounded-2xl border border-neutral/10 bg-white p-4 shadow-xl">
            <div class="flex flex-col gap-1 text-sm">${common}</div>
            <div class="my-3 h-px bg-neutral/10"></div>
            <div class="flex flex-col gap-3 text-sm">${authLinks[role] ?? authLinks.guest}</div>
          </nav>
        </details>
        <nav class="hidden items-center gap-5 text-sm lg:flex">
          ${common}
          <span class="mx-1 h-5 w-px bg-neutral/15"></span>
          ${authLinks[role] ?? authLinks.guest}
        </nav>
      </div>
    </header>
  `;

  container.querySelector("#logoutBtn")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/";
  });
};