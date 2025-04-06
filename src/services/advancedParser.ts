import DOMPurify from "dompurify";
import markdown from "markdown-it";
// @ts-ignore
import katex from "markdown-it-katex";


const allowedOrigin = [
  window.location.origin,
  "https://pl.turtlesim.com",
  "https://physicslab.turtlesim.com",
];
const allowedUrl = ["https://github.com/NetLogo-Mobile/Physics-Lab-Web"];

const md = new markdown({
  html: true,
  linkify: true,
});

// advancedParser.ts 修改以下部分

// 替换原有highlightjs引入
import hljs from 'highlight.js/lib/core';
// @ts-ignore
import markdownItHighlightjs from 'markdown-it-highlightjs/dist/core';


import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import swift from 'highlight.js/lib/languages/swift';
import go from 'highlight.js/lib/languages/go';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
import yaml from 'highlight.js/lib/languages/yaml';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import nginx from 'highlight.js/lib/languages/nginx';
import rust from 'highlight.js/lib/languages/rust';
import kotlin from 'highlight.js/lib/languages/kotlin';
import scala from 'highlight.js/lib/languages/scala';
import perl from 'highlight.js/lib/languages/perl';

[
  javascript, typescript, xml, css, python,
  java, cpp, csharp, php, ruby, swift, go,
  sql, json, bash, shell, yaml, markdown,
  dockerfile, nginx, rust, kotlin, scala, perl
].forEach(lang => {
  // @ts-ignore
  hljs.registerLanguage(lang.name, lang);
});


md.use(katex).use(markdownItHighlightjs, {
  hljs, 
  inline: true,
  auto: true
});

md.core.ruler.before("normalize", "parseUnityRichText", function (state) {
  const root = window.$getPath("/root");
  state.src = state.src
    .replace(/<user=(.*?)>(.*?)<\/user>/g, "<span class='RUser' data-user='$1'>$2</span>")
    .replace(
      /<discussion=(.*?)>(.*?)<\/discussion>/g,
      `<a href="${root}/ExperimentSummary/Discussion/$1" internal>$2</a>`
    )
    .replace(
      /<experiment=(.*?)>(.*?)<\/experiment>/g,
      `<a href="${root}/ExperimentSummary/Experiment/$1" internal>$2</a>`
    )
    .replace(/<b>(.*?)<\/b>/g, "<strong>$1</strong>") // 粗体
    .replace(/<i>(.*?)<\/i>/g, "<em>$1</em>") // 斜体
    .replace(/<color=(.*?)>(.*?)<\/color>/g, '<span style="color:$1;">$2</span>') // 颜色
    .replace(/<color=(.*?)>(.*?)<\/color>/g, '<span style="color:$1;">$2</span>') // 处理2层重复标签
    .replace(/<color=(.*?)>(.*?)<\/color>/g, '<span style="color:$1;">$2</span>') // 处理3层重复标签
    .replace(/<a>(.*?)<\/a>/g, '<span style="color:blue;">$1</span>') // a转换为蓝色
    .replace(/(<br\/>| *\n){2}(\-{3,}|\*{3,}|\_{3,})(<br\/>| *\n)/g, "\n<hr></hr>\n");

  state.src = parse_size(parse_size(parse_size(state.src)));
});

function parse_size(text: string) {
  //@ts-ignore
  return text.replace(/<size=(\d+)>(.*?)<\/size>/g, function (match: string, size, content) {
    return `<span style="font-size:${size / 2}px">${content}</span>`;
  });
}


function isAllowedDomain(url: string): boolean {
  const origin = window.location.origin;
  try {
    const parsedUrl = new URL(url, origin);
    if (allowedOrigin.includes(parsedUrl.origin) || allowedUrl.includes(parsedUrl.href)) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * 处理a标签，移除或替换跨域链接
 */
function processAnchorTags(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const anchorTags = doc.querySelectorAll("a");

  anchorTags.forEach((tag) => {
    const href = tag.getAttribute("href");
    if (href && !isAllowedDomain(href)) {
      tag.outerHTML = `<span style="color:lightblue;">${tag.textContent}</span>`;
    }
  });

  return doc.body.innerHTML;
}

/**
 * 处理img标签，移除或替换跨域链接
 */
function processImageTags(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const imgTags = doc.querySelectorAll("img");

  imgTags.forEach((tag) => {
    const src = tag.getAttribute("src");
    if (src && !isAllowedDomain(src)) {
      tag.remove();
    } else {
      tag.style.width = tag.getAttribute("width") || tag.style.width;
      tag.style.height = tag.getAttribute("height") || tag.style.height;
      tag.style.maxWidth = "100%";
    }
  });

  return doc.body.innerHTML;
}

/**
 * 丰富的解析引擎，含有Katex等
 * @param text 文本
 * @param isInline 为真会不输出换行和size标签
 * @author Arendelle
 * @returns
 */
function parse(text: string | string[], isInline: boolean = false) {
  // 请确保以下实验简介的渲染正常:
  // /Discussion/67a88a9cd76625ec934e2b47
  // /Discussion/5f3620716adfbe0001ca35e9
  // /Discussion/67a785e6d76625ec934e1525
  // /Experiment/67987779fa3a53d92a765111
  // /Discussion/67e96342527daabc44e1e8bf
  if (!text) return "";
  if (Array.isArray(text)) {
    // 按一定规则拼接为一个字符串
    let text_ = "",
      last_is_code: boolean = false;
    for (let i = 0; i < text.length; ++i) {
      let next_is_code = (text[i].match(/\`\`\`/g)?.length || 0) & 1;

      if (last_is_code || next_is_code || /^( |\t)*(\-|\*|\#|\d+\.)/.test(text[i])) {
        text_ += text[i] + "\n";
      } else if (/^ *<.*> *$/.test(text[i])) {
        let slice_start = 0;
        while (true) {
          if (text[i][slice_start] === "\t") {
            text_ += "&nbsp;&nbsp;&nbsp;&nbsp;";
          } else if (text[i][slice_start] === " ") {
            text_ += "&nbsp;";
          } else {
            break;
          }
          ++slice_start;
        }

        text_ += text[i].slice(slice_start) + "<br/>";
      } else {
        let slice_start = 0;
        while (true) {
          if (text[i][slice_start] === "\t") {
            text_ += "&nbsp;&nbsp;&nbsp;&nbsp;";
          } else if (text[i][slice_start] === " ") {
            text_ += "&nbsp;";
          } else {
            break;
          }
          ++slice_start;
        }
        // > xxx
        if (text[i][slice_start] === ">") {
          text_ += `<blockquote>${text[i].slice(text[i].search(">") + 1)}</blockquote>\n\n`;
          continue;
        }
        text_ += text[i].slice(slice_start) + "  \n";
      }
      if (next_is_code) {
        last_is_code = !last_is_code;
      }
    }
    text = text_;
  }

  let result = md.render(text);

  let clean = DOMPurify.sanitize(result, {
    ADD_TAGS: ["a", "br", "span", "img"], // 允许a标签和img标签
    ADD_ATTR: ["href", "internal", "src", "width", "height", "maxWidht"], // 允许href和data-to属性以及img的src、width和height属性
  });

  if (isInline) {
    clean = clean.replace(/<p>/g, "").replace(/<\/p>/g, "");
  }

  clean = processAnchorTags(clean);
  clean = processImageTags(clean);

  return clean;
}

export default parse;
