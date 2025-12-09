import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="宝山区小学成熟度测评系统"
      links={[]}
    />
  );
};

export default Footer;
