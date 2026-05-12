/**
 * URL 参数密文工具：对 path、title 等含中文的参数进行编解码，
 * 避免文档名称以明文形式暴露于地址栏，保护文档安全
 */

/** Base64 编码（支持 Unicode/中文） */
export function encodeCipher(str: string): string {
    if (!str) return "";
    try {
      const bytes = new TextEncoder().encode(str);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    } catch {
      return str;
    }
  }
  
  /** Base64 解码（支持 Unicode/中文） */
  export function decodeCipher(str: string): string {
    if (!str) return "";
    try {
      const binary = atob(str);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch {
      return str;
    }
  }
  
  /** 判断字符串是否为密文（Base64 特征：无中文字符且可解码） */
  export function isCipher(str: string): boolean {
    if (!str || typeof str !== "string") return false;
    if (/[\u4e00-\u9fff]/.test(str)) return false; // 含中文则视为明文
    try {
      atob(str);
      return true;
    } catch {
      return false;
    }
  }
  