import React from 'react';
import GlobalStyle from '../../styles/global';

const AuthLayout: React.FC = ({ children }) => {
  return (
    <>
      {children}
      <GlobalStyle />
    </>
  );
};

export default AuthLayout;
