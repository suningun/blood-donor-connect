import { icon } from "../utils/icons.js";
import { btnOutline, btnPrimary, cardClass } from "../utils/styles.js";
import { link } from "../utils/url.js";

const steps = [
  {
    icon: "UserPlus",
    title: "Sign up",
    text: "Create a donor account with your blood type, age, weight and province, or register your hospital.",
  },
  {
    icon: "Search",
    title: "Find a request",
    text: "Browse urgent requests and filter them by province and blood type in seconds.",
  },
  {
    icon: "Droplet",
    title: "Register to donate",
    text: "Sign up for a request, then show up at the hospital ready to help save a life.",
  },
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
        <h2 class="font-headline text-xl font-semibold mb-3">Our story</h2>
        <div class="${cardClass} space-y-3 p-6">
          <p class="text-sm leading-6 text-neutral/70">Blood Donor Connect began as a class project. Our team noticed that when a hospital runs low on a rare blood type, the call for help is usually a photo of a notice shared into a few Facebook groups. It reaches whoever happens to scroll past, then disappears down the feed.</p>
          <p class="text-sm leading-6 text-neutral/70">We wanted to give those requests a permanent, searchable home. The result is a simple prototype where hospitals can publish what they need, and donors can find requests near them that match their blood type.</p>
        </div>
      </section>

      <section>
        <h2 class="font-headline text-xl font-semibold mb-3">How it works</h2>
        <div class="grid gap-4 md:grid-cols-3">
          ${steps.map((step) => `
            <div class="${cardClass} p-6">
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">${icon(step.icon, { width: 20, height: 20 })}</span>
              <h3 class="mt-3 font-headline font-semibold text-neutral">${step.title}</h3>
              <p class="mt-1 text-sm leading-6 text-neutral/70">${step.text}</p>
            </div>`).join("")}
        </div>
      </section>

      <section class="${cardClass} flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 class="font-headline text-xl font-semibold text-neutral">Ready to help?</h2>
          <p class="mt-1 text-sm text-neutral/70">Join as a donor, or register your hospital and start posting requests.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="${link("/user-register")}" data-link class="${btnPrimary}">Become a donor</a>
          <a href="${link("/hospital-register")}" data-link class="${btnOutline}">Register your hospital</a>
        </div>
      </section>

      <p class="text-xs text-neutral/50 border-t border-neutral/10 pt-4">
        This is a class prototype for INFO 251. All donors, hospitals and requests are synthetic data, not a real medical service.
      </p>
    </div>
  `;
}
