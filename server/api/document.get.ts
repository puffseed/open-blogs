import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** 只允许路径包含相对安全字符，防止路径穿越 */
function sanitizePath(pathStr: string): string {
  const cleaned = pathStr
    .replace(/\.\./g, "")
    .replace(/^\.\//, "")
    .replace(/[<>:"|?*]/g, "");
  return cleaned || "";
}

/** 根据扩展名返回 Content-Type */
function getContentType(ext: string): string {
  const map: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain; charset=utf-8",
  };
  return map[ext?.toLowerCase()] ?? "application/octet-stream";
}

/**
 * 提供文档文件流（PDF、Word、Excel 等），供浏览器预览或下载。
 * 查询参数：path（相对 ResourceLibrary 的路径，如 documents/PDF/xxx.pdf）或 id（需 document 中有 id）
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const pathParam = String(query.path || "").trim();
  const idParam = String(query.id || "").trim();

  let safePath: string;

  if (idParam) {
    try {
      const config = await import("../../json/ResourceLibrary/document.json");
      const items = Array.isArray(config.default) ? config.default : [];
      const item = items.find((i: { id?: string }) => i.id === idParam);
      if (!item?.documentPath) {
        setResponseStatus(event, 404);
        return { error: "文档不存在" };
      }
      safePath = sanitizePath(item.documentPath);
    } catch {
      setResponseStatus(event, 404);
      return { error: "文档不存在" };
    }
  } else if (pathParam) {
    safePath = sanitizePath(pathParam);
  } else {
    setResponseStatus(event, 400);
    return { error: "缺少 path 或 id" };
  }

  if (!safePath) {
    setResponseStatus(event, 400);
    return { error: "无效路径" };
  }

  const root = process.cwd();
  const filePath = join(root, "json", "ResourceLibrary", safePath);

  if (!existsSync(filePath)) {
    setResponseStatus(event, 404);
    return { error: "文档不存在" };
  }

  const ext = safePath.split(".").pop()?.toLowerCase() ?? "";
  const contentType = getContentType(ext);

  setResponseHeader(event, "Content-Type", contentType);
  setResponseHeader(event, "Cache-Control", "public, max-age=3600");

  return readFile(filePath);
});
