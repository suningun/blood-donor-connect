import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";

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
  window.scrollTo(0, 0);
};

window.addEventListener("popstate", () => render(location.pathname));

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (!link) return;
  e.preventDefault();
  navigate(link.getAttribute("href"));
});

export const render = async (path) => {
  renderHeader(document.getElementById("header"));
  renderFooter(document.getElementById("footer"));

  const app = document.getElementById("app");
  app.innerHTML = "";

  if (path.startsWith("/post/")) {
    const { default: postDetail } = await import("./pages/postDetail.js");
    return postDetail(app, path.split("/post/")[1]);
  }

  const { default: page } = await (routes[path] ?? routes["/"])();
  page(app);
};