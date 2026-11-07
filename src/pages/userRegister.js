import { registerUser } from "../auth/userAuth.js";
import { navigate } from "../router.js";
import { PROVINCES } from "../data/provinces.js";
import { passwordField, initPasswordToggles } from "../components/passwordField.js";
import { passwordsMatch } from "../utils/validation.js";
import { btnPrimary, cardClass, inputClass, selectClass } from "../utils/styles.js";
import { icon } from "../utils/icons.js";

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

    if (!passwordsMatch(data.password, confirmPassword)) {
      errorMsg.textContent = "Passwords do not match.";
      return;
    }

    try {
      await registerUser(data);
      navigate("/posts");
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });
}