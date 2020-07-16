import React from 'react';
import GlobalStyle from '../../styles/global';

import Sidebar from '../../components/Sidebar';

const DefaultLayout: React.FC = ({ children }) => {
  return (
    <>
      <Sidebar />
      {children}
      <GlobalStyle />
    </>
  );
};

export default DefaultLayout;
