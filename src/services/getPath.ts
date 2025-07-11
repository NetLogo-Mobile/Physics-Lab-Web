const apiUrl = import.meta.env.VITE_API_URL;
const staticUrl = import.meta.env.VITE_STATIC_URL;
const rootUrl = import.meta.env.VITE_ROOT_URL;
const baseUrl = import.meta.env.VITE_BASE_URL;

/**
 * 替换路径中的预设标记为配置的URL地址
 * REplace the preset mark in the path with the configured URL address
 *
 * @param path - The path to be replaced, such as /api, /static, /root, /base
 * @returns The complete URL string after replacement, all preset marks have been replaced with the configured URL
 * @param path - 可替换的标记如/api、/static、/root、/base
 * @returns 替换后的完整URL字符串，所有预设标记已被替换为配置的URL
 *
 */
export default function (path: string): string {
  return path
    .replace(/\/@api/g, apiUrl)
    .replace(/\/@static/g, staticUrl)
    .replace(/\/@base/g, baseUrl)
    .replace(/\/@root/g, rootUrl);
}
