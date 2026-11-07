import { loginUser } from "../auth/userAuth.js";
import { navigate } from "../router.js";
import { passwordField, initPasswordToggles } from "../components/passwordField.js";
import { btnPrimary, cardClass, inputClass } from "../utils/styles.js";

export default function userLogin(container) {
  container.innerHTML = `
    <div class="mx-auto grid max-w-5xl items-stretch gap-6 px-4 py-10 md:grid-cols-2 md:py-16">
      <div class="hidden rounded-2xl bg-primary p-8 text-white md:flex md:flex-col md:justify-center">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Welcome back</p>
        <h1 class="mt-4 font-headline text-4xl font-bold">Your next donation starts here.</h1>
        <p class="mt-4 leading-7 text-white/80">Sign in to discover active requests and connect with hospitals in your community.</p>
      </div>
      <div class="${cardClass} p-6 sm:p-8">
      <h1 class="mb-6 font-headline text-2xl font-bold text-neutral">Donor Login</h1>
      <form id="loginForm" class="space-y-3">
        <input type="email" name="email" placeholder="Email" required
          class="${inputClass}" />
          ${passwordField({ name: "password", placeholder: "Password", autocomplete: "current-password" })}
        <button type="submit" class="${btnPrimary} w-full">Login</button>
        <p id="errorMsg" class="text-primary text-sm"></p>
      </form>
      <p class="mt-3 text-sm text-neutral/70">Don't have an account? <a href="/user-register" data-link class="text-tertiary font-medium">Sign Up</a></p>
      </div>
    </div>
  `;
  initPasswordToggles(container);
  
  const form = container.querySelector("#loginForm");
  const errorMsg = container.querySelector("#errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    const data = Object.fromEntries(new FormData(form));
    try {
      await loginUser(data);
      navigate("/posts");
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });
}