import { join } from "node:path";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

/** 将 /fonts/宋体/南北词宫谱宋体.ttf 映射到项目 assets/fonts/宋体/南北词宫谱宋体.ttf */
export default defineEventHandler(async (event) => {
  const pathParam = getRouterParam(event, "path");
  if (!pathParam || pathParam.includes("..")) {
    setResponseStatus(event, 404);
    return null;
  }
  const decoded = pathParam.split("/").map((p) => decodeURIComponent(p)).join("/");
  const root = process.cwd();
  const filePath = join(root, "assets", "fonts", decoded);

  if (!existsSync(filePath)) {
    setResponseStatus(event, 404);
    return null;
  }

  const ext = decoded.split(".").pop()?.toLowerCase();
  const contentType =
    ext === "ttf" || ext === "otc"
      ? "font/ttf"
      : ext === "otf"
        ? "font/otf"
        : ext === "ttc"
          ? "font/collection"
          : "application/octet-stream";

  setResponseHeader(event, "Content-Type", contentType);
  setResponseHeader(event, "Cache-Control", "public, max-age=31536000");
  return readFile(filePath);
});
