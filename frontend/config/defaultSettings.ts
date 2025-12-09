import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name 默认设置
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: '宝山区小学成熟度测评',
  pwa: false,
  logo: '/logo.svg',
  iconfontUrl: '',
  token: {},
};

export default Settings;
