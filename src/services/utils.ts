type PUser = {
  ID: string;
  Avatar: number;
  Verification: string;
};

type PProjects = {
  ID: string;
  Image?: number;
};

export function getUserUrl(user: PUser): string {
  const url =
    user.Avatar === 0 || user.Verification === "Banned"
      ? "/@base/assets/user/default-avatar.png"
      : `/@static/users/avatars/${user.ID.slice(0, 4)}/${user.ID.slice(4, 6)}/${user.ID.slice(
          6,
          8,
        )}/${user.ID.slice(8, 24)}/${user.Avatar}.jpg`;

  return window.$getPath(url);
}

export function getCoverUrl(data: PProjects): string {
  const url = `/@static/experiments/images/${data.ID.slice(0, 4)}/${data.ID.slice(
    4,
    6,
  )}/${data.ID.slice(6, 8)}/${data.ID.slice(8, 24)}/${data.Image || 0}.jpg!block`;
  return window.$getPath(url);
}

/**
 * 将物理实验 API 返回的 targetLink 转换为查询参数对象。
 *
 * 数据流顺序：
 * 1. 收到 API 返回的 targetLink，使用 EncodeAPITargetLink 创建 URL
 * 2. 结果展示界面使用 decodeHrefToQueryObj 解码 URL 中的参数，再发起新的请求
 *
 * Converts the targetLink from physicsLab's API response to a query object.
 * Data flow:
 * 1. Receive API response's targetLink, create URL using EncodeAPITargetLink
 * 2. Result display page uses decodeHrefToQueryObj to decode URL's parameters, then make new request
 *
 * @param {string} input 例如："discussion://Tags/Tag1/Tags/Tag2/ExcludeTags/Tag3"
 * @returns {string} 路由路径局部的 base64-like 字符串（the base64-like string in router path）
 * @example
 * // 跳转到列表页
 * router.push(`/list/${EncodeAPITargetLink(input)}`);
 */
export function EncodeAPITargetLink(input: string) {
  const result: any = {
    Category: null,
    Tags: null,
    ExcludeTags: null,
  };
  // 处理前缀以确定 Category
  result.Category = input.startsWith("d") ? "Discussion" : "Experiment";
  const segments = input.split("://").slice(1).join("://");
  const parts = segments.split("/");

  for (let i = 0; i < parts.length; i += 2) {
    const key = parts[i];
    const value = parts[i + 1];

    if (key === "ExcludeTags" || key === "Tags") {
      if (!result[key]) {
        result[key] = [];
      }
      if (value) {
        result[key].push(value);
      }
    } else {
      result[key] = value;
    }
  }
  // 确保 Tag 和 ExcludeTags 是数组或 null
  if (!Array.isArray(result.Tags) || result.Tags.length === 0) {
    result.Tags = null;
  }
  if (!Array.isArray(result.ExcludeTags) || result.ExcludeTags.length === 0) {
    result.ExcludeTags = null;
  }

  const jsonString = JSON.stringify(result);
  const utf8Bytes = new TextEncoder().encode(jsonString);
  const base64String = btoa(String.fromCharCode(...utf8Bytes));

  return base64String.replace(/\//g, "DEVIDER");
}

/**
 *  解码 router 中的 base64 字符串 decode base64 string in router
 * @param base64Input example router.params.config
 * @returns example {Category: "Discussion", Tags: ["Tag1", "Tag2"], ExcludeTags: ["Tag3"]}
 * @see EncodeAPITargetLink
 */
export function decodeHrefToQueryObj(base64Input: string) {
  if (!base64Input || typeof base64Input !== "string") {
    return {};
  }
  const latin1String = atob(base64Input.replace(/DEVIDER/g, "/"));
  const utf8Bytes = new Uint8Array(
    [...latin1String].map((char) => char.charCodeAt(0)),
  );
  const jsonString = new TextDecoder().decode(utf8Bytes);
  const result = JSON.parse(jsonString);
  return result;
}
