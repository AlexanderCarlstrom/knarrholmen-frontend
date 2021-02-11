import enGB from 'antd/lib/locale-provider/en_GB';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'moment/locale/en-gb';
import React from 'react';

import { BreakpointProvider } from './context/BreakpointContext';
import { ContainterProps } from './types/ContainterProps';
import { AuthProvider } from './context/AuthContext';

const AppProvider = ({ children }: ContainterProps) => {
  return (
    <ConfigProvider locale={enGB}>
      <BrowserRouter>
        <BreakpointProvider>
          <AuthProvider>{children}</AuthProvider>
        </BreakpointProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default AppProvider;
