import { BLOOD_TYPES, COMPATIBILITY } from "../data/bloodCompatibility.js";
import { icon } from "../utils/icons.js";

const eligibility = [
  "Generally aged 18–65 (rules vary by blood service)",
  "Weigh at least 50 kg",
  "In good general health on the day of donation",
  "Not pregnant or recently ill",
  "Wait about 3 months between whole-blood donations",
];

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
    <div class="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <header>
        <h1 class="font-headline text-3xl font-bold flex items-center gap-2 text-neutral">${icon("Droplet", { color: "#D85A30", width: 28, height: 28 })} Donation Info</h1>
        <p class="text-neutral/70 mt-2">One donation can help save up to three lives. Here is what you need to know.</p>
      </header>

      <section>
        <h2 class="font-headline text-xl font-semibold mb-3">Who can donate?</h2>
        <ul class="bg-white border border-neutral/15 rounded-lg p-4 space-y-2 text-sm">
          ${eligibility.map((e) => `<li class="flex items-start gap-2"><span class="text-secondary mt-0.5">${icon("Check")}</span>${e}</li>`).join("")}
        </ul>
        <p class="text-xs text-neutral/50 mt-2">General guidelines only. Always follow your local blood service's rules.</p>
      </section>

      <section>
        <h2 class="font-headline text-xl font-semibold mb-3">Blood type compatibility</h2>
        <div class="overflow-x-auto bg-white border border-neutral/15 rounded-lg">
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
            <div class="bg-white border border-neutral/15 rounded-lg p-4">
              <h3 class="font-headline font-semibold text-tertiary">${stage}</h3>
              <ul class="mt-2 space-y-1 text-sm text-neutral/70 list-disc list-inside">${list.map((i) => `<li>${i}</li>`).join("")}</ul>
            </div>`).join("")}
        </div>
      </section>

      <section>
        <h2 class="font-headline text-xl font-semibold mb-3">FAQ</h2>
        <div id="faq" class="space-y-2">
          ${faqs.map(([q, a]) => `
            <div class="bg-white border border-neutral/15 rounded-lg">
              <button data-faq class="w-full flex justify-between items-center p-4 text-left font-medium">
                ${q}<span class="transition-transform">${icon("ChevronDown")}</span>
              </button>
              <p class="hidden px-4 pb-4 text-sm text-neutral/70">${a}</p>
            </div>`).join("")}
        </div>
      </section>
    </div>
  `;

  container.querySelectorAll("[data-faq]").forEach((btn) =>
    btn.addEventListener("click", () => {
      btn.nextElementSibling.classList.toggle("hidden");
      btn.lastElementChild.classList.toggle("rotate-180");
    })
  );
}