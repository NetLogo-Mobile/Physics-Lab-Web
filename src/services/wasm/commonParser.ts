import DOMPurify from "dompurify";
import { getWasmInstance } from "./wasmLoader";

let commonParser: ((text: string) => string) | null = null;
const commonParserReady = (async () => {
  const wasmInstance = await getWasmInstance();
  commonParser = wasmInstance.cwrap("common_parser", "string", ["string"]);
})();

/**
 * 将unity富文本和Markdown解析为Html，样式写在index.html，含有Ruser
 * @function
 * @name parse
 * @kind function
 * @param {string|undefined} text
 * @returns {Promise<string>}
 * @exports
 */
async function parse(text: string | undefined) {
  if (!text) return "";
  await commonParserReady;
  const parser = commonParser!;
  let result = parser(text);

  // 辅助函数：检查是否为同域链接
  function isSameDomain(url: string): boolean {
    const origin = window.location.origin;
    try {
      const parsedUrl = new URL(url, origin);
      return parsedUrl.origin === origin;
    } catch {
      return false;
    }
  }

  // 处理a标签，移除或替换跨域链接
  function processAnchorTags(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const anchorTags = doc.querySelectorAll("a");
    anchorTags.forEach((tag) => {
      const href = tag.getAttribute("href");
      if (href && !isSameDomain(href)) {
        tag.outerHTML = `<span style=\"color:blue;\">${tag.textContent}</span>`;
      }
    });
    return doc.body.innerHTML;
  }

  const clean = DOMPurify.sanitize(result, {
    ADD_TAGS: ["a", "br"],
    ADD_ATTR: ["href", "internal"],
  });

  return processAnchorTags(clean);
}

export default parse;
