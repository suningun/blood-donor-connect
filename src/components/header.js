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
      return `<a href="${href}" data-link class="hover:text-primary ${active ? "text-primary font-semibold" : ""}">${label}</a>`;
    })
    .join("");

  const authLinks = {
    guest: `
      <a href="/user-login" data-link class="hover:text-primary">Donor Login</a>
      <a href="/hospital-login" data-link class="hover:text-primary">Hospital Login</a>
      <a href="/user-register" data-link class="bg-primary text-white px-3 py-1.5 rounded-md">Sign Up</a>`,
    user: `
      <button id="logoutBtn" class="flex items-center gap-1 text-neutral/60 hover:text-primary">${icon("LogOut")} Logout</button>`,
    hospital: `
      <a href="/hospital-dashboard" data-link class="flex items-center gap-1 hover:text-primary">${icon("Home")} Dashboard</a>
      <button id="logoutBtn" class="flex items-center gap-1 text-neutral/60 hover:text-primary">${icon("LogOut")} Logout</button>`,
  };

  container.innerHTML = `
    <header class="border-b border-neutral/10 bg-white sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4 py-3 flex flex-wrap gap-3 justify-between items-center">
        <a href="/" data-link class="flex items-center gap-1 font-headline font-bold text-xl text-primary">${icon("Droplet", { width: 22, height: 22 })} Blood Donor Connect</a>
        <nav class="flex flex-wrap gap-4 text-sm items-center">
          ${common}
          <span class="hidden md:block w-px h-5 bg-neutral/15"></span>
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