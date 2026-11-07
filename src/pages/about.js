import { icon } from "../utils/icons.js";
import { cardClass } from "../utils/styles.js";

const team = [
  { name: "Member One", role: "Frontend & UI" },
  { name: "Member Two", role: "API Integration" },
  { name: "Member Three", role: "Authentication" },
  { name: "Member Four", role: "Testing & Docs" },
];

export default function about(container) {
  container.innerHTML = `
    <div class="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 sm:py-16">
      <header>
        <h1 class="font-headline text-3xl font-bold text-neutral">About Us</h1>
        <p class="text-neutral/70 mt-2">Blood Donor Connect links voluntary donors with hospitals that urgently need blood.</p>
      </header>

      <section class="grid md:grid-cols-2 gap-4">
        <div class="${cardClass} p-6">
          <h2 class="font-headline font-semibold text-primary">The problem</h2>
          <p class="text-sm text-neutral/70 mt-2">In Cambodia, urgent blood requests mostly spread through Facebook posts and word of mouth. They are easy to miss and hard to filter.</p>
        </div>
        <div class="${cardClass} p-6">
          <h2 class="font-headline font-semibold text-secondary">Our mission</h2>
          <p class="text-sm text-neutral/70 mt-2">Give hospitals one place to post requests and give donors one place to find them, filtered by province and blood type.</p>
        </div>
      </section>

      <section>
        <h2 class="font-headline text-xl font-semibold mb-3">The team</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${team.map((m) => `
            <div class="${cardClass} p-5 text-center">
              <div class="w-12 h-12 mx-auto rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">${icon("User", { width: 22, height: 22 })}</div>
              <p class="font-medium mt-2 text-sm">${m.name}</p>
              <p class="text-xs text-neutral/60">${m.role}</p>
            </div>`).join("")}
        </div>
      </section>

      <p class="text-xs text-neutral/50 border-t border-neutral/10 pt-4">
        This is a class prototype for INFO 251. All donors, hospitals and requests are synthetic data, not a real medical service.
      </p>
    </div>
  `;
}