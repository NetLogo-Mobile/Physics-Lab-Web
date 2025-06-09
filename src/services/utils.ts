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

export function strToQueryObj(input: string) {
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
