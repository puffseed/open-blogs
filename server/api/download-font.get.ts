import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** 只允许分类、文件名包含中文、字母、数字、下划线、横线，防止路径穿越 */
function sanitize(str: string): string {
  return str.replace(/[^\u4e00-\u9fa5a-zA-Z0-9_\-]/g, "") || "unknown";
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const type = sanitize(String(query.type || ""));
  const name = sanitize(String(query.name || ""));
  let format = String(query.format || ".ttf").trim();
  if (!format.startsWith(".")) format = "." + format;

  if (!type || !name) {
    setResponseStatus(event, 400);
    return { error: "缺少参数 type 或 name" };
  }

  const root = process.cwd();
  const filePath = join(root, "fonts", type, `${name}${format}`);

  if (!existsSync(filePath)) {
    setResponseStatus(event, 404);
    return { error: "字体文件不存在" };
  }

  const filename = `${name}${format}`;
  setResponseHeader(event, "Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
  setResponseHeader(event, "Content-Type", "application/octet-stream");

  return readFile(filePath);
});
