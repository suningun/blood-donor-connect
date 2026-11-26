export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

export const link = (path = "/") => `${BASE_PATH}${path}`;

export const stripBase = (pathname = "/") => {
  if (BASE_PATH && (pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/`))) {
    return pathname.slice(BASE_PATH.length) || "/";
  }
  return pathname || "/";
};

export const currentPath = () => stripBase(location.pathname);
