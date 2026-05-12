import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** 只允许路径包含相对安全字符，防止路径穿越 */
function sanitizePath(pathStr: string): string {
  const cleaned = pathStr
    .replace(/\.\./g, "")
    .replace(/^\.\//, "")
    .replace(/[<>:"|?*]/g, "");
  return cleaned || "markdowns/1.md";
}

/** 只允许 id 包含安全字符 */
function sanitizeId(idStr: string): string {
  return idStr.replace(/[^\w\-]/g, "") || "";
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const idParam = String(query.id || "").trim();
  const pathParam = String(query.path || "").trim();

  let safePath: string;

  let itemTitle: string | undefined;
  if (idParam) {
    // 通过 id 密文反查真实路径和标题，不暴露 markdowns/1.md、需求文档 等
    const id = sanitizeId(idParam);
    if (!id) {
      setResponseStatus(event, 400);
      return { error: "无效的文档标识" };
    }
    try {
      const config = await import("../../json/ResourceLibrary/document.json");
      const items = Array.isArray(config.default) ? config.default : [];
      const item = items.find((i: { id?: string }) => i.id === id);
      if (!item?.documentPath) {
        setResponseStatus(event, 404);
        return { error: "文档不存在" };
      }
      safePath = sanitizePath(item.documentPath);
      itemTitle = item.title;
    } catch {
      setResponseStatus(event, 404);
      return { error: "文档不存在" };
    }
  } else {
    // 兼容旧的 path 参数
    safePath = sanitizePath(pathParam || "markdowns/1.md");
  }

  const root = process.cwd();
  const filePath = join(root, "json", "ResourceLibrary", safePath);

  if (!existsSync(filePath)) {
    setResponseStatus(event, 404);
    return { error: "文档不存在" };
  }

  try {
    const content = await readFile(filePath, "utf-8");
    return itemTitle !== undefined ? { content, title: itemTitle } : { content };
  } catch {
    setResponseStatus(event, 500);
    return { error: "读取文档失败" };
  }
});
