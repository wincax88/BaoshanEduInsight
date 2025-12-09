import { Button, Result } from 'antd';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * 错误边界组件 - 捕获子组件树中的 JavaScript 错误
 * 防止整个应用崩溃，提供友好的错误提示
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // 可以在这里上报错误到监控服务
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <Result
          status="error"
          title="页面出现错误"
          subTitle={
            process.env.NODE_ENV === 'development'
              ? error?.message || '未知错误'
              : '抱歉，页面加载出现问题，请刷新重试'
          }
          extra={[
            <Button key="retry" onClick={this.handleReset}>
              重试
            </Button>,
            <Button key="reload" type="primary" onClick={this.handleReload}>
              刷新页面
            </Button>,
          ]}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
