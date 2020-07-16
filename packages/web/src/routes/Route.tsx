import React from 'react';
import {
  Redirect,
  Route,
  RouteProps,
  RouteComponentProps,
} from 'react-router-dom';

import AuthLayout from '../pages/_layouts/auth';
import DefaultLayout from '../pages/_layouts/default';

interface Props extends RouteProps {
  isPrivate?: boolean;
}

const RouteWrapper: React.FC<Props> = ({
  component: Component,
  isPrivate = false,
  ...rest
}) => {
  const authenticated = !!localStorage.getItem('@Umbriel:token');

  if (!authenticated && isPrivate) {
    return <Redirect to="/" />;
  }

  if (authenticated && !isPrivate) {
    return <Redirect to="/contacts" />;
  }

  const Layout = authenticated ? DefaultLayout : AuthLayout;

  if (!Component) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps<{}>) => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
};

export default RouteWrapper;
