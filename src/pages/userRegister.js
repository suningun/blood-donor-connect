import { registerUser } from "../auth/userAuth.js";
import { navigate } from "../router.js";
import { PROVINCES } from "../data/provinces.js";
import { assessEligibility, DONOR_AGE_MAX, DONOR_AGE_MIN, DONOR_MIN_WEIGHT_KG } from "../data/eligibility.js";
import { passwordField, initPasswordToggles } from "../components/passwordField.js";
import { passwordsMatch } from "../utils/validation.js";
import { btnPrimary, cardClass, inputClass, selectClass } from "../utils/styles.js";
import { icon } from "../utils/icons.js";
import { fadeIn, setButtonLoading, shake, spinner } from "../utils/motion.js";

export default function userRegister(container) {
  container.innerHTML = `
    <div class="mx-auto grid max-w-5xl items-stretch gap-6 px-4 py-10 md:grid-cols-2 md:py-16">
      <div class="hidden rounded-2xl bg-primary/10 p-8 md:flex md:flex-col md:justify-center">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-tertiary">Join the network</p>
        <h1 class="mt-4 font-headline text-4xl font-bold text-neutral">Be there when someone needs you.</h1>
        <p class="mt-4 leading-7 text-neutral/70">Create your donor profile and make it easier for hospitals to find support.</p>
      </div>
      <div class="${cardClass} p-6 sm:p-8">
      <h1 class="mb-6 font-headline text-2xl font-bold text-neutral">Donor Sign Up</h1>
      <form id="registerForm" class="space-y-3">
        <input type="email" name="email" placeholder="Email" required class="${inputClass}" />
        <input type="text" name="username" placeholder="Username" required class="${inputClass}" />
        <input type="text" name="phone" placeholder="Phone Number" required class="${inputClass}" />
        <div class="relative">
          <select name="province" required class="${selectClass}">
            <option value="" class="text-neutral/40">Select Province</option>
            ${PROVINCES.map((p) => `<option value="${p}">${p}</option>`).join("")}
          </select>
          <span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/50">${icon("ChevronDown", { width: 16, height: 16 })}</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <input type="number" name="age" placeholder="Age" min="${DONOR_AGE_MIN}" max="${DONOR_AGE_MAX}" step="1" inputmode="numeric" aria-label="Age" required class="${inputClass}" />
          <input type="number" name="weight" placeholder="Weight (kg)" min="${DONOR_MIN_WEIGHT_KG}" step="0.1" inputmode="decimal" aria-label="Weight in kilograms" required class="${inputClass}" />
        </div>
        <p class="text-xs text-neutral/50">
          Donors must be ${DONOR_AGE_MIN}–${DONOR_AGE_MAX} years old and weigh at least ${DONOR_MIN_WEIGHT_KG} kg.
          <a href="/blood-info" data-link class="text-tertiary font-medium">See eligibility</a>
        </p>
        <label class="flex items-start gap-2 text-sm text-neutral/70">
          <input type="checkbox" name="healthOk" required class="mt-0.5 accent-primary" />
          <span>I am in good general health today, not pregnant or recently ill, and it has been at least 3 months since my last whole-blood donation.</span>
        </label>
        ${passwordField({ name: "password", placeholder: "Password (min 6 characters)" })}
        ${passwordField({ name: "confirmPassword", placeholder: "Confirm Password" })}
        <button type="submit" class="${btnPrimary} w-full">Sign Up</button>
        <p id="errorMsg" class="text-primary text-sm"></p>
      </form>
      <p class="mt-3 text-sm text-neutral/70">Already have an account? <a href="/user-login" data-link class="text-tertiary font-medium">Login</a></p>
      </div>
    </div>
  `;

  initPasswordToggles(container);

  const form = container.querySelector("#registerForm");
  const errorMsg = container.querySelector("#errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    const { confirmPassword, ...data } = Object.fromEntries(new FormData(form));

    const eligibilityErrors = assessEligibility(data);
    if (!data.healthOk) {
      eligibilityErrors.push("Please confirm the health declaration before signing up.");
    }
    if (eligibilityErrors.length) {
      errorMsg.textContent = eligibilityErrors.join(" ");
      fadeIn(errorMsg, { y: 4, duration: 180 });
      shake(errorMsg);
      return;
    }

    if (!passwordsMatch(data.password, confirmPassword)) {
      errorMsg.textContent = "Passwords do not match.";
      return;
    }

    try {
      const submitButton = form.querySelector("button[type='submit']");
      setButtonLoading(submitButton, true, spinner(icon("UserPlus", { width: 16, height: 16 })));
      await registerUser(data);
      navigate("/posts");
    } catch (err) {
      errorMsg.textContent = err.message;
      fadeIn(errorMsg, { y: 4, duration: 180 });
      shake(errorMsg);
    } finally {
      setButtonLoading(form.querySelector("button[type='submit']"), false);
    }
  });
}