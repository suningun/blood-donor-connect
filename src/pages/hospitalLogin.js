import { loginHospital } from "../auth/hospitalAuth.js";
import { navigate } from "../router.js";

export default function hospitalLogin(container) {
  container.innerHTML = `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg border">
      <h1 class="font-headline text-2xl font-bold mb-4 text-neutral">Hospital Login</h1>
      <form id="hospitalLoginForm" class="space-y-3">
        <input type="email" name="email" placeholder="Email" required
          class="w-full border border-neutral/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
        <input type="password" name="password" placeholder="Password" required
          class="w-full border border-neutral/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
        <button type="submit" class="w-full bg-primary text-white font-medium py-2 rounded-md">Login</button>
        <p id="errorMsg" class="text-primary text-sm"></p>
      </form>
      <p class="mt-3 text-sm text-neutral/70">Don't have an account? <a href="/hospital-register" data-link class="text-tertiary font-medium">Sign Up</a></p>
    </div>
  `;

  const form = container.querySelector("#hospitalLoginForm");
  const errorMsg = container.querySelector("#errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    const data = Object.fromEntries(new FormData(form));
    try {
      await loginHospital(data);
      navigate("/hospital-dashboard");
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });
}