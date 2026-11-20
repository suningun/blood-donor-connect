import { BLOOD_TYPES, COMPATIBILITY } from "../data/bloodCompatibility.js";
import { ELIGIBILITY } from "../data/eligibility.js";
import { icon } from "../utils/icons.js";
import { cardClass } from "../utils/styles.js";
import { expand, collapse, staggerChildren } from "../utils/motion.js";

const tips = {
  Before: ["Eat a healthy meal", "Drink plenty of water", "Get a good night's sleep"],
  During: ["The process takes about 10–15 minutes", "Relax and breathe normally", "Tell staff if you feel unwell"],
  After: ["Rest for 10–15 minutes", "Drink extra fluids", "Avoid heavy lifting for the day"],
};

const faqs = [
  ["Does donating blood hurt?", "You may feel a brief pinch when the needle goes in. The rest is usually painless."],
  ["How long does it take?", "The donation itself is about 10–15 minutes. The whole visit usually takes under an hour."],
  ["Is it safe?", "Yes. Sterile single-use equipment is used for every donor."],
  ["How often can I donate?", "Typically every 3 months for whole blood, but check with your local blood service."],
  ["Who is the universal donor?", "O- can give to every blood type. AB+ can receive from every type."],
];

export default function bloodInfo(container) {
  container.innerHTML = `
    <div class="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 sm:py-16">
      <header>
        <h1 class="font-headline text-3xl font-bold flex items-center gap-2 text-neutral">${icon("Droplet", { color: "#D85A30", width: 28, height: 28 })} Donation Info</h1>
        <p class="text-neutral/70 mt-2">One donation can help save up to three lives. Here is what you need to know.</p>
      </header>

      <section>
        <h2 class="font-headline text-xl font-semibold mb-3">Who can donate?</h2>
        <ul class="${cardClass} space-y-2 p-4 text-sm">
          ${ELIGIBILITY.map((e) => `<li class="flex items-start gap-2"><span class="text-secondary mt-0.5">${icon("Check")}</span>${e}</li>`).join("")}
        </ul>
        <p class="text-xs text-neutral/50 mt-2">General guidelines only. Always follow your local blood service's rules.</p>
      </section>

      <section>
        <h2 class="font-headline text-xl font-semibold mb-3">Blood type compatibility</h2>
        <div class="${cardClass} overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-neutral/5">
              <tr><th class="p-3">Type</th><th class="p-3">Can give to</th><th class="p-3">Can receive from</th></tr>
            </thead>
            <tbody>
              ${BLOOD_TYPES.map((t) => `
                <tr class="border-t border-neutral/10">
                  <td class="p-3 font-headline font-bold text-primary">${t}</td>
                  <td class="p-3">${COMPATIBILITY[t].give.join(", ")}</td>
                  <td class="p-3">${COMPATIBILITY[t].receive.join(", ")}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 class="font-headline text-xl font-semibold mb-3">Before, during and after</h2>
        <div class="grid md:grid-cols-3 gap-4">
          ${Object.entries(tips).map(([stage, list]) => `
            <div class="${cardClass} p-4">
              <h3 class="font-headline font-semibold text-tertiary">${stage}</h3>
              <ul class="mt-2 space-y-1 text-sm text-neutral/70 list-disc list-inside">${list.map((i) => `<li>${i}</li>`).join("")}</ul>
            </div>`).join("")}
        </div>
      </section>

      <section>
        <h2 class="font-headline text-xl font-semibold mb-3">FAQ</h2>
        <div id="faq" class="space-y-2">
          ${faqs.map(([q, a]) => `
            <div class="${cardClass}">
              <button data-faq class="w-full flex justify-between items-center p-4 text-left font-medium">
                ${q}<span class="transition-transform">${icon("ChevronDown")}</span>
              </button>
              <p class="hidden px-4 pb-4 text-sm text-neutral/70">${a}</p>
            </div>`).join("")}
        </div>
      </section>
    </div>
  `;
  staggerChildren(container.querySelector(".mx-auto"), "section");

  container.querySelectorAll("[data-faq]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      const isOpen = !answer.classList.contains("hidden");
      if (isOpen) collapse(answer);
      else expand(answer);
      btn.lastElementChild.classList.toggle("rotate-180", !isOpen);
    })
  );
}