import "./style.css";
import { render } from "./router.js";
import { currentPath, link, stripBase } from "./utils/url.js";

const redirect = sessionStorage.getItem("spa-redirect");
sessionStorage.removeItem("spa-redirect");

if (redirect) {
  const path = stripBase(redirect);
  history.replaceState({}, "", link(path));
  render(path);
} else {
  render(currentPath());
}
