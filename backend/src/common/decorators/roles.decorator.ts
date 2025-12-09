import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * 角色装饰器 - 用于标记需要特定角色才能访问的端点
 * @param roles - 允许访问的角色代码数组
 * @example @Roles('admin', 'supervisor')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
