/**
 * Token 服务 - 统一管理 access_token 的存取
 * 所有涉及 token 操作的地方都应该使用这个服务
 */

const TOKEN_KEY = 'access_token';

export const tokenService = {
  /**
   * 获取 token
   */
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * 设置 token
   */
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * 移除 token
   */
  remove(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * 检查是否有 token
   */
  exists(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * 获取 Authorization header 值
   */
  getAuthHeader(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? `Bearer ${token}` : null;
  },
};

export default tokenService;
