import { registerUser } from "../auth/userAuth.js";
import { navigate } from "../router.js";
import { PROVINCES } from "../data/provinces.js";
import { passwordField, initPasswordToggles } from "../components/passwordField.js";
import { passwordsMatch } from "../utils/validation.js";

const inputClass = "w-full border border-neutral/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40";

export default function userRegister(container) {
  container.innerHTML = `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg border">
      <h1 class="font-headline text-2xl font-bold mb-4 text-neutral">Donor Sign Up</h1>
      <form id="registerForm" class="space-y-3">
        <input type="email" name="email" placeholder="Email" required class="${inputClass}" />
        <input type="text" name="username" placeholder="Username" required class="${inputClass}" />
        <input type="text" name="phone" placeholder="Phone Number" required class="${inputClass}" />
        <select name="province" required class="w-full border border-neutral/20 p-2 rounded-md">
          <option value="">Select Province</option>
          ${PROVINCES.map((p) => `<option value="${p}">${p}</option>`).join("")}
        </select>
        ${passwordField({ name: "password", placeholder: "Password (min 6 characters)" })}
        ${passwordField({ name: "confirmPassword", placeholder: "Confirm Password" })}
        <button type="submit" class="w-full bg-primary text-white font-medium py-2 rounded-md">Sign Up</button>
        <p id="errorMsg" class="text-primary text-sm"></p>
      </form>
      <p class="mt-3 text-sm text-neutral/70">Already have an account? <a href="/user-login" data-link class="text-tertiary font-medium">Login</a></p>
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