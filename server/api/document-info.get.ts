/**
 * 根据 id 返回文档信息（标题、路径等），用于详情页根据 id 判断类型并展示标题
 */
export default defineEventHandler(async (event) => {
  const id = String(getQuery(event).id || "").trim();
  if (!id) {
    setResponseStatus(event, 400);
    return { error: "缺少 id" };
  }
  try {
    const config = await import("../../json/ResourceLibrary/document.json");
    const items = Array.isArray(config.default) ? config.default : [];
    const item = items.find((i: { id?: string }) => i.id === id);
    if (!item) {
      setResponseStatus(event, 404);
      return { error: "文档不存在" };
    }
    return {
      title: item.title,
      documentPath: item.documentPath?.replace(/^\.\//, "") ?? "",
      fileType: item.fileType,
    };
  } catch {
    setResponseStatus(event, 404);
    return { error: "文档不存在" };
  }
});
