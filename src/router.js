import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";

let renderId = 0;

const routes = {
  "/": () => import("./pages/home.js"),
  "/posts": () => import("./pages/postsList.js"),
  "/blood-info": () => import("./pages/bloodInfo.js"),
  "/about": () => import("./pages/about.js"),
  "/contact": () => import("./pages/contact.js"),
  "/user-login": () => import("./pages/userLogin.js"),
  "/user-register": () => import("./pages/userRegister.js"),
  "/hospital-login": () => import("./pages/hospitalLogin.js"),
  "/hospital-register": () => import("./pages/hospitalRegister.js"),
  "/hospital-dashboard": () => import("./pages/hospitalDashboard.js"),
};

export const navigate = async (path) => {
  history.pushState({}, "", path);
  await render(path);
};

window.addEventListener("popstate", () => render(location.pathname));

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (!link) return;
  e.preventDefault();
  navigate(link.getAttribute("href"));
});

export const render = async (path) => {
  const currentRenderId = ++renderId;
  renderHeader(document.getElementById("header"));
  renderFooter(document.getElementById("footer"));

  const app = document.getElementById("app");
  const detached = document.createElement("div");

  try {
    if (path.startsWith("/post/")) {
      const { default: postDetail } = await import("./pages/postDetail.js");
      if (currentRenderId !== renderId) return;
      await postDetail(detached, path.split("/post/")[1]);
    } else {
      const { default: page } = await (routes[path] ?? routes["/"])();
      if (currentRenderId !== renderId) return;
      await page(detached);
    }
  } catch (err) {
    if (currentRenderId !== renderId) return;
    detached.innerHTML = `<p class="p-6 text-primary">${err.message}</p>`;
  }

  if (currentRenderId !== renderId) return;
  app.replaceChildren(...detached.childNodes);
  window.scrollTo(0, 0);

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    app.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 300, easing: "ease-out" }
    );
  }
};