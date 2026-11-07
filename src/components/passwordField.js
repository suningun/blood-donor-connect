import { icon } from "../utils/icons.js";

export const passwordField = ({
  name = "password",
  placeholder = "Password",
  autocomplete = "new-password",
} = {}) => `
  <div class="relative">
    <input type="password" name="${name}" placeholder="${placeholder}" required minlength="6"
      autocomplete="${autocomplete}"
      class="w-full border border-neutral/20 p-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
    <button type="button" data-toggle-password aria-label="Show password"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral/50 hover:text-neutral">
      <span data-eye>${icon("Eye")}</span>
      <span data-eye-off class="hidden">${icon("EyeOff")}</span>
    </button>
  </div>
`;

export const initPasswordToggles = (root) =>
  root.querySelectorAll("[data-toggle-password]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.querySelector("[data-eye]").classList.toggle("hidden", show);
      btn.querySelector("[data-eye-off]").classList.toggle("hidden", !show);
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    })
  );