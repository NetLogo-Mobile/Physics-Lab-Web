import DOMPurify from "dompurify";

/**
 * 将unity富文本解析为Html，样式写在index.html，含有Ruser
 *
 * @function
 * @name parse
 * @kind function
 * @param {type} params
 * @param {boolean} ignoreSize 是否忽略size标签
 * @returns {void}
 * @exports
 */
function parse(text: string | undefined, ignoreSize: boolean = false) {
  if (!text) return "";

  let result = text
    .replace(/\n/g, "<br/>") // 先处理换行符

    .replace(/<user=(.*?)>(.*?)<\/user>/g, "<span class='RUser' data-user='$1'>$2</span>")
    .replace(
      /<discussion=(.*?)>(.*?)<\/discussion>/g,
      `<a href="${window.$getPath("/@root")}/ExperimentSummary/Discussion/$1" internal>$2</a>`
    )
    .replace(
      /<experiment=(.*?)>(.*?)<\/experiment>/g,
      `<a href="${window.$getPath("/@root")}/ExperimentSummary/Experiment/$1" internal>$2</a>`
    )
    // 新增Markdown语法解析
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // 粗体
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // 斜体
    .replace(/`(.*?)`/g, "<code>$1</code>") // 代码
    .replace(/> (.*?)\n/g, "<blockquote>$1</blockquote>") // 引用

    // 新增Unity富文本解析
    .replace(/<b>(.*?)<\/b>/g, "<strong>$1</strong>") // 粗体
    .replace(/<i>(.*?)<\/i>/g, "<em>$1</em>") // 斜体
    .replace(/<color=(.*?)>(.*?)<\/color>/g, '<span style="color:$1;">$2</span>') // 颜色
    .replace(/<a>(.*?)<\/a>/g, '<span style="color:blue;">$1</span>') // a转换为蓝色

    // 字体大小
    .replace(/<size=(.*?)>(.*?)<\/size>/g, ignoreSize ? '<span style="font-size:$1px;">$2</span>' : '$2');

  // 辅助函数：检查是否为同域链接
  function isSameDomain(url: string): boolean {
    const origin = window.location.origin;
    try {
      const parsedUrl = new URL(url, origin);
      return parsedUrl.origin === origin;
    } catch (e) {
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
        tag.outerHTML = `<span style="color:blue;">${tag.textContent}</span>`;
      }
    });

    return doc.body.innerHTML;
  }

  const clean = DOMPurify.sanitize(result, {
    ADD_TAGS: ["a", "br"], // 允许a标签
    ADD_ATTR: ["href", "internal"], // 允许href和data-to属性
  });

  return processAnchorTags(clean);
}

export default parse;