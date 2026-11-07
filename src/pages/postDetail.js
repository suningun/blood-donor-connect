import { getPostById } from "../services/posts.js";
import { registerToPost, getRegistrantsByPost } from "../services/registrations.js";
import { registrantList } from "../components/registrantList.js";
import { icon } from "../utils/icons.js";

export default async function postDetail(container, postId) {
  const idToken = localStorage.getItem("idToken");
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");


  container.innerHTML = `<p class="p-6 text-neutral/60">Loading...</p>`;
  
  let post;
  try {
    post = await getPostById(postId, idToken);
  } catch (err) {
    container.innerHTML = `<p class="p-6 text-primary">${err.message}</p>`;
    return;
  }

  const isHospitalOwner = role === "hospital" && post.hospitalId === uid;

  container.innerHTML = `
    <div class="max-w-2xl mx-auto p-6">
      <div class="bg-white border border-neutral/20 rounded-lg p-6">
        <div class="flex justify-between items-start">
          <h1 class="font-headline text-xl font-bold text-neutral">${post.hospitalName}</h1>
          <span class="px-2 py-1 text-xs rounded ${post.status === "active" ? "bg-secondary/10 text-secondary" : "bg-neutral/10 text-neutral/60"}">
            ${post.status === "active" ? "Active" : "Fulfilled"}
          </span>
        </div>
        <p class="text-3xl font-headline font-bold text-primary mt-2">${post.bloodType}</p>
        <p class="text-sm text-neutral/70 mt-1">${post.unitsNeeded} units needed</p>
        <p class="text-sm text-neutral/70">${post.province}</p>
      </div>

      <div id="registerSection" class="mt-6"></div>
    </div>
  `;
  

  const section = container.querySelector("#registerSection");

  if (isHospitalOwner) {
    section.innerHTML = `
      <h2 class="font-headline font-semibold text-neutral mb-3 flex items-center gap-1">${icon("User")} Registrants</h2>
      <div id="registrants"></div>
    `;
    const regs = await getRegistrantsByPost(postId, idToken);
    section.querySelector("#registrants").innerHTML = registrantList(regs);
    return;
  }

  if (role === "hospital") {
    section.innerHTML = `<p class="text-neutral/50 text-sm">Only donors can register to this request.</p>`;
    return;
  }

  if (post.status !== "active") {
    section.innerHTML = `<p class="text-neutral/50 text-sm">This request has already been fulfilled.</p>`;
    return;
  }

  if (!idToken) {
  section.innerHTML = `
    <div class="bg-white border border-neutral/20 rounded-lg p-4 text-sm text-neutral/70">
      Please <a href="/user-login" data-link class="text-tertiary font-medium">log in</a>
      or <a href="/user-register" data-link class="text-tertiary font-medium">sign up</a>
      as a donor to register for this request.
    </div>
  `;
  return;
}

  section.innerHTML = `
    <h2 class="font-headline font-semibold text-neutral mb-3">Register as a Donor</h2>
    <form id="regForm" class="space-y-3 bg-white border border-neutral/20 rounded-lg p-4">
      <input type="text" name="name" placeholder="Full Name" required
        class="w-full border border-neutral/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
      <input type="text" name="phone" placeholder="Phone Number" required
        class="w-full border border-neutral/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
      <div class="flex gap-3">
        <input type="number" name="age" placeholder="Age" required
          class="w-full border border-neutral/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
        <input type="number" name="weight" placeholder="Weight (kg)" required
          class="w-full border border-neutral/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <select name="gender" required class="w-full border border-neutral/20 p-2 rounded-md">
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input type="text" name="healthCondition" placeholder="Health Condition (if any)"
        class="w-full border border-neutral/20 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
      <button type="submit" class="w-full bg-primary text-white font-medium py-2 rounded-md">Register</button>
      <p id="errorMsg" class="text-primary text-sm"></p>
      <p id="successMsg" class="text-secondary text-sm"></p>
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
    try {
      await registerToPost(
        { ...data, postId, userId: uid, age: Number(data.age), weight: Number(data.weight) },
        idToken
      );
      successMsg.textContent = "Successfully registered!";
      form.reset();
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });
}