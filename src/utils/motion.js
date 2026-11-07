const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animate = (element, keyframes, options) => {
  if (!element || reducedMotion()) return Promise.resolve();
  return element.animate(keyframes, { easing: "ease-out", fill: "both", ...options }).finished;
};

export const fadeIn = (element, { delay = 0, duration = 250, y = 8 } = {}) =>
  animate(
    element,
    [{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: "translateY(0)" }],
    { delay, duration }
  );

export const fadeOut = (element, { duration = 120 } = {}) =>
  animate(element, [{ opacity: 1 }, { opacity: 0 }], { duration });

export const shake = (element) =>
  animate(
    element,
    [{ transform: "translateX(0)" }, { transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(0)" }],
    { duration: 180 }
  );

export const staggerChildren = (root, selector = ":scope > *") => {
  if (!root) return Promise.resolve();
  return Promise.all([...root.querySelectorAll(selector)].map((child, index) => fadeIn(child, { delay: index * 40 })));
};

export const fadeSwap = async (element, render) => {
  if (!element) return;
  await fadeOut(element);
  render();
  await fadeIn(element, { y: 4, duration: 180 });
};

export const collapse = async (element) => {
  if (!element || reducedMotion()) {
    element?.classList.add("hidden");
    return;
  }
  const height = element.scrollHeight;
  await animate(element, [{ height: `${height}px`, opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 200 });
  element.classList.add("hidden");
  element.style.removeProperty("height");
};

export const expand = async (element) => {
  if (!element) return;
  element.classList.remove("hidden");
  if (reducedMotion()) return;
  const height = element.scrollHeight;
  element.style.height = "0px";
  await animate(element, [{ height: "0px", opacity: 0 }, { height: `${height}px`, opacity: 1 }], { duration: 200 });
  element.style.removeProperty("height");
};

export const setButtonLoading = (button, loading, spinner = "") => {
  if (!button) return;
  button.disabled = loading;
  button.classList.toggle("cursor-wait", loading);
  button.classList.toggle("opacity-75", loading);
  if (loading) {
    button.dataset.motionLabel = button.innerHTML;
    button.innerHTML = `${spinner}<span>Working...</span>`;
  } else if (button.dataset.motionLabel) {
    button.innerHTML = button.dataset.motionLabel;
    delete button.dataset.motionLabel;
  }
};

export const spinner = (iconMarkup) =>
  reducedMotion() ? iconMarkup : iconMarkup.replace("<svg", '<svg class="animate-spin"');
