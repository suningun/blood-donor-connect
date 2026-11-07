import { createMessage } from "../services/messages.js";
import { required, isEmail, minLength } from "../utils/validation.js";
import { icon } from "../utils/icons.js";

const inputClass = "w-full border border-neutral/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40";

export default function contact(container) {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-10">
        <h1 class="font-headline text-3xl font-bold text-neutral">Contact Us</h1>
        <p class="text-neutral/70 mt-2">Questions or feedback? Send us a message.</p>

        <div class="grid md:grid-cols-2 gap-6 mt-6">
            <form id="contactForm" novalidate class="bg-white border border-neutral/15 rounded-lg p-5 space-y-3">
            <input name="name" placeholder="Your name" class="${inputClass}" />
            <input name="email" type="email" placeholder="Email" class="${inputClass}" />
            <textarea name="message" rows="5" placeholder="Message" class="${inputClass}"></textarea>
            <button type="submit" class="w-full bg-primary text-white font-medium py-2 rounded-md">Send Message</button>
            <p id="status" class="text-sm"></p>
            </form>

            <div class="bg-white border border-neutral/15 rounded-lg p-5 space-y-4 text-sm">
            <p class="flex items-center gap-2">${icon("Mail", { color: "#854F0B" })} hello@blooddonorconnect.example</p>
            <p class="flex items-center gap-2">${icon("Phone", { color: "#854F0B" })} 023 000 000 (placeholder)</p>
            <p class="flex items-center gap-2">${icon("MapPin", { color: "#854F0B" })} Phnom Penh, Cambodia</p>
            </div>
        </div>
        </div>
    `;

    const form = container.querySelector("#contactForm");
    const status = container.querySelector("#status");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const errors = [];
        if (!required(data.name)) errors.push("Name is required.");
        if (!isEmail(data.email)) errors.push("Enter a valid email.");
        if (!minLength(data.message.trim(), 10)) errors.push("Message must be at least 10 characters.");

        status.className = "text-sm text-primary";
        if (errors.length) {
        status.textContent = errors.join(" ");
        return;
        }

        try {
        await createMessage(data);
        form.reset();
        status.className = "text-sm text-secondary";
        status.textContent = "Thanks! Your message was sent.";
        } catch (err) {
        status.textContent = err.message;
        }
    });
}