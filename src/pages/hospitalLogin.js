import { loginHospital } from "../auth/hospitalAuth.js";
import { navigate } from "../router.js";
import { btnPrimary, cardClass, inputClass } from "../utils/styles.js";
import { fadeIn, setButtonLoading, shake, spinner } from "../utils/motion.js";
import { icon } from "../utils/icons.js";
import { link } from "../utils/url.js";

export default function hospitalLogin(container) {
  container.innerHTML = `
    <div class="mx-auto grid max-w-5xl items-stretch gap-6 px-4 py-10 md:grid-cols-2 md:py-16">
      <div class="hidden rounded-2xl bg-secondary p-8 text-white md:flex md:flex-col md:justify-center">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">For hospitals</p>
        <h1 class="mt-4 font-headline text-4xl font-bold">Turn urgent needs into action.</h1>
        <p class="mt-4 leading-7 text-white/80">Manage blood requests and meet donors who are ready to help.</p>
      </div>
      <div class="${cardClass} p-6 sm:p-8">
      <h1 class="mb-6 font-headline text-2xl font-bold text-neutral">Hospital Login</h1>
      <form id="hospitalLoginForm" class="space-y-3">
        <input type="email" name="email" placeholder="Email" required
          class="${inputClass}" />
        <input type="password" name="password" placeholder="Password" required
          class="${inputClass}" />
        <button type="submit" class="${btnPrimary} w-full">Login</button>
        <p id="errorMsg" class="text-primary text-sm"></p>
      </form>
      <p class="mt-3 text-sm text-neutral/70">Don't have an account? <a href="${link("/hospital-register")}" data-link class="text-tertiary font-medium">Sign Up</a></p>
      </div>
    </div>
  `;

  const form = container.querySelector("#hospitalLoginForm");
  const errorMsg = container.querySelector("#errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    const data = Object.fromEntries(new FormData(form));
    const submitButton = form.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, spinner(icon("LogIn", { width: 16, height: 16 })));
    try {
      await loginHospital(data);
      navigate("/hospital-dashboard");
    } catch (err) {
      errorMsg.textContent = err.message;
      fadeIn(errorMsg, { y: 4, duration: 180 });
      shake(errorMsg);
    } finally {
      setButtonLoading(submitButton, false);
    }
  });
}