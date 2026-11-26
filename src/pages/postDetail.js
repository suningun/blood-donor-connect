import { getPostById } from "../services/posts.js";
import { registerToPost, getRegistrantsByPost } from "../services/registrations.js";
import { registrantList } from "../components/registrantList.js";
import { icon } from "../utils/icons.js";
import { link } from "../utils/url.js";
import { btnPrimary, cardClass, chipClass, inputClass, selectClass } from "../utils/styles.js";
import { fadeIn, setButtonLoading, shake, spinner, staggerChildren } from "../utils/motion.js";

export default async function postDetail(container, postId) {
  const idToken = localStorage.getItem("idToken");
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");

  container.innerHTML = `<div class="mx-auto max-w-2xl space-y-4 p-6"><div class="h-48 animate-pulse rounded-2xl bg-neutral/10"></div><div class="h-64 animate-pulse rounded-2xl bg-neutral/10"></div></div>`;

  let post;
  try {
    post = await getPostById(postId); // public read, no token
  } catch (err) {
    container.innerHTML = `<p class="p-6 text-primary">${err.message}</p>`;
    return;
  }

  const isHospitalOwner = role === "hospital" && post.hospitalId === uid;

  container.innerHTML = `
    <div class="mx-auto max-w-2xl p-4 sm:p-6">
      <div class="${cardClass} p-6 sm:p-8">
        <div class="flex justify-between items-start">
          <h1 class="font-headline text-xl font-bold text-neutral">${post.hospitalName}</h1>
          <span class="${chipClass} ${post.status === "active" ? "bg-secondary/10 text-secondary" : "bg-neutral/10 text-neutral/60"}">
            ${post.status === "active" ? "Active" : "Fulfilled"}
          </span>
        </div>
        <p class="mt-5 font-headline text-5xl font-bold text-primary">${post.bloodType}</p>
        <p class="mt-2 text-sm text-neutral/70">${post.unitsNeeded} units needed · ${post.province}</p>
      </div>

      <div id="registerSection" class="mt-6"></div>
    </div>
  `;

  const section = container.querySelector("#registerSection");
  fadeIn(container.querySelector("div.mx-auto"), { y: 8 });

  // Hospital that owns this post: sees registrants
  if (isHospitalOwner) {
    section.innerHTML = `
      <h2 class="mb-3 flex items-center gap-1 font-headline font-semibold text-neutral">${icon("User")} Registrants</h2>
      <div id="registrants"><div class="h-20 animate-pulse rounded-2xl bg-neutral/10"></div></div>
    `;
    try {
      const regs = await getRegistrantsByPost(postId, uid, idToken);
      section.querySelector("#registrants").innerHTML = registrantList(regs);
      staggerChildren(section.querySelector("#registrants"));
    } catch (err) {
      section.querySelector("#registrants").innerHTML = `<p class="text-sm text-primary">${err.message}</p>`;
    }
    return;
  }

  // Any other hospital
  if (role === "hospital") {
    section.innerHTML = `<p class="text-sm text-neutral/50">Only donors can register to this request.</p>`;
    return;
  }

  if (post.status !== "active") {
    section.innerHTML = `<p class="text-sm text-neutral/50">This request has already been fulfilled.</p>`;
    return;
  }

  // Guest
  if (!idToken) {
    section.innerHTML = `
      <div class="${cardClass} p-5 text-sm text-neutral/70">
        Please <a href="${link("/user-login")}" data-link class="font-medium text-tertiary">log in</a>
        or <a href="${link("/user-register")}" data-link class="font-medium text-tertiary">sign up</a>
        as a donor to register for this request.
      </div>
    `;
    return;
  }

  // Donor: registration form
  section.innerHTML = `
    <h2 class="mb-3 font-headline font-semibold text-neutral">Register as a Donor</h2>
    <form id="regForm" class="${cardClass} space-y-3 p-5">
      <input type="text" name="name" placeholder="Full Name" required class="${inputClass}" />
      <input type="text" name="phone" placeholder="Phone Number" required class="${inputClass}" />
      <div class="flex gap-3">
        <input type="number" name="age" placeholder="Age" required class="${inputClass}" />
        <input type="number" name="weight" placeholder="Weight (kg)" required class="${inputClass}" />
      </div>
      <div class="relative">
        <select name="gender" required class="${selectClass}">
          <option value="" class="text-neutral/40">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <span class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral/50">${icon("ChevronDown", { width: 16, height: 16 })}</span>
      </div>
      <input type="text" name="healthCondition" placeholder="Health Condition (if any)" class="${inputClass}" />
      <button type="submit" class="${btnPrimary} w-full">Register</button>
      <p id="errorMsg" class="text-sm text-primary"></p>
      <p id="successMsg" class="text-sm text-secondary"></p>
    </form>
  `;

  const form = section.querySelector("#regForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorMsg = section.querySelector("#errorMsg");
    const successMsg = section.querySelector("#successMsg");
    errorMsg.textContent = "";
    successMsg.textContent = "";

    const data = Object.fromEntries(new FormData(form));
    const submitButton = form.querySelector("button[type='submit']");
    setButtonLoading(submitButton, true, spinner(icon("Droplet", { width: 16, height: 16 })));
    try {
      await registerToPost(
        {
          ...data,
          postId,
          userId: uid,
          hospitalId: post.hospitalId,
          age: Number(data.age),
          weight: Number(data.weight),
        },
        idToken
      );
      successMsg.textContent = "Successfully registered!";
      fadeIn(successMsg, { y: 4, duration: 180 });
      form.reset();
    } catch (err) {
      errorMsg.textContent = err.message;
      fadeIn(errorMsg, { y: 4, duration: 180 });
      shake(errorMsg);
    } finally {
      setButtonLoading(submitButton, false);
    }
  });
}