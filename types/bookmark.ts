/** 书签项，与 pages/Bookmark/CardBookmark 及书签集页面共用 */
export interface BookmarkItem {
  name: string;
  url: string;
  description: string;
  type?: string;
}
