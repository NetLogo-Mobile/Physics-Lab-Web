const apiUrl = import.meta.env.VITE_API_URL;
const staticUrl = import.meta.env.VITE_STATIC_URL;
const rootUrl = import.meta.env.VITE_ROOT_URL;

export default function (path: string): string {
  return path
    .replace(/\/api/g, apiUrl)
    .replace(/\/static/g, staticUrl)
    .replace(/\/root/g, rootUrl);
}
