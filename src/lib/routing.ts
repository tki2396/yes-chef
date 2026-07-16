const rawBasePath = process.env.PUBLIC_BASE_PATH ?? "";

export const basePath = normalizeBasePath(rawBasePath);

function normalizeBasePath(path: string) {
  if (!path || path === "/") return "";

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
}

export function appPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

export function getAppPath(pathname: string) {
  if (!basePath) return pathname;
  if (pathname === basePath) return "/";
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length);

  return pathname;
}
