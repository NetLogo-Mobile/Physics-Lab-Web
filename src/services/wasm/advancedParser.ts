import DOMPurify from "dompurify";
import markdown from "markdown-it";
// @ts-expect-error 暂无类型信息 There is no type information
import katex from "markdown-it-katex";
import hljs from "highlight.js/lib/core";
// @ts-expect-error: 暂无类型信息 There is no type information
import markdownItHighlightjs from "markdown-it-highlightjs/dist/core";
import { getWasmInstance } from "./wasmLoader";


const md = new markdown({
  html: true,
  linkify: true,
});
md.use(katex).use(markdownItHighlightjs, {
  hljs,
  inline: true,
  auto: true,
});

// WASM 单例缓存
let advanceParser: ((text: string, isInline: boolean) => string) | null = null;

async function getAdvanceParser() {
  if (!advanceParser) {
    const wasmInstance = await getWasmInstance();
    advanceParser = wasmInstance.cwrap("advanced_parser", "string", ["string", "boolean"]);
  }
  return advanceParser!;
}

/**
 * 丰富的解析引擎，含有Katex等，WASM 只做结构解析，前端继续高亮和katex渲染
 * @param text 文本
 * @param isInline 为真会不输出换行和size标签
 * @returns Promise<string>
 */

  // 请确保以下实验简介的渲染正常:
  // please ensure the following experiment descriptions render correctly:
  // /Discussion/67a88a9cd76625ec934e2b47
  // /Discussion/5f3620716adfbe0001ca35e9
  // /Discussion/67a785e6d76625ec934e1525
  // /Experiment/67987779fa3a53d92a765111
  // /Discussion/67e96342527daabc44e1e8bf
async function parse(text: string | string[], isInline: boolean = false) {
  if (!text) return "";
  if (Array.isArray(text)) {
    text = text.join("\n");
  }
  const parser = await getAdvanceParser();
  // 1. 先用 WASM 解析为 markdown/html
  let wasmResult = parser(text, isInline);
  // 2. 再用 markdown-it 渲染（支持katex和高亮）
  let result = md.render(wasmResult);
  // 3. DOMPurify 过滤
  let clean = DOMPurify.sanitize(result, {
    ADD_TAGS: ["a", "br", "span", "img"],
    ADD_ATTR: ["href", "internal", "src", "width", "height", "maxWidht"],
  });
  return clean;
}

export default parse;
