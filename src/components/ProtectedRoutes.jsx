import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Route, useHistory } from 'react-router-dom';
import useHasPermissions from '../hooks/useHasPermissions';

import { loginSelector } from '../store/selectors/authSelectors';

/**
 * Component that manage the redirection
 * @param {string} redirect The route in the current app where we want to be redirect if we are not authorize to access it (if not external)
 * @param {string} external The external route (on another domaine) where we want to be redirect if we are not authorize to access it
 * @returns JSX
 */
const CheckRedirection = ({ redirect = '/', external = '', location }) => {
  const history = useHistory();

  const checkRedirectSource = useCallback(async () => {
    if (external) {
      window.location.replace(`${external}?from=${window.location.href}`);
    } else {
      history.push({ pathname: redirect, state: { from: location } });
    }
  }, [history, redirect, external, location]);

  useEffect(() => {
    checkRedirectSource();
  }, [checkRedirectSource]);

  return <h1>Loading ...</h1>;
};

/**
 * Component that manage the Protected routes (only accessible for auth users)
 * @param {Component} component That component accessible by this route
 * @param {string} redirect The route in the current app where we want to be redirect if we are not authorize to access it (if not external)
 * @param {string} external The external route (on another domaine) where we want to be redirect if we are not authorize to access it
 * @returns JSX
 */
const ProtectedRoutes = ({
  component: Component, redirect = '/login', external = '', permission = [], ...rest
}) => {
  const { loading, logged } = useSelector(loginSelector);

  const hasPermission = useHasPermissions(permission?.[0] ?? '', permission?.[1] ?? '');

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return <h1>Loading</h1>;
        }
        // If logged and if a permission is declare we check that the user has this permission
        if (logged && (permission?.length === 2 ? hasPermission : true)) {
          return <Component {...props} />;
        }
        return <CheckRedirection redirect={redirect} external={external} location={props.location} />;
      }}
    />
  );
};

export default ProtectedRoutes;
