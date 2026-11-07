import { loginUser } from "../auth/userAuth.js";
import { navigate } from "../router.js";
import { passwordField, initPasswordToggles } from "../components/passwordField.js";

export default function userLogin(container) {
  container.innerHTML = `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg border">
      <h1 class="font-headline text-2xl font-bold mb-4 text-neutral">Donor Login</h1>
      <form id="loginForm" class="space-y-3">
        <input type="email" name="email" placeholder="Email" required
          class="w-full border border-neutral/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
          ${passwordField({ name: "password", placeholder: "Password", autocomplete: "current-password" })}
        <button type="submit" class="w-full bg-primary text-white font-medium py-2 rounded-md">Login</button>
        <p id="errorMsg" class="text-primary text-sm"></p>
      </form>
      <p class="mt-3 text-sm text-neutral/70">Don't have an account? <a href="/user-register" data-link class="text-tertiary font-medium">Sign Up</a></p>
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