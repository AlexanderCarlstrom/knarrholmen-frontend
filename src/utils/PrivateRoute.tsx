import React from 'react';
import { RouteProps, Redirect, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        user !== null ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/auth/login', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
