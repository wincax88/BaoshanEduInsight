/**
 * @name 代理的配置
 * @description 开发环境代理到本地后端服务
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  dev: {
    '/api/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
  test: {
    '/api/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
  pre: {
    '/api/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
};
