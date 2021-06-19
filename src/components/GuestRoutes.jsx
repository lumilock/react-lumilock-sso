import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';

import qs from 'qs';

import { loginSelector } from '../store/selectors/authSelectors';

/**
 * Component that manage the redirection
 * @param {string} redirect The route in the current app where we want to be redirect if we are not authorize to access it (if not external)
 * @param {string} external The external route (on another domaine) where we want to be redirect if we are not authorize to access it
 * @returns JSX
 */
const CheckRedirection = ({ redirect = '/', external = '', location }) => {
  const history = useHistory();

  // Function that check if there is a source where we need to redirect
  const checkRedirectSource = useCallback(async () => {
    const fromSearch = qs.parse(history?.location?.search, {
      ignoreQueryPrefix: true,
    }).from;
    // we check if in the location state there is a state 'from' to now where we need to localy redirect
    const fromState = history?.location?.state?.from;
    if (fromSearch) {
      window.location.replace(fromSearch);
      return;
    }
    if (fromState) {
      history.push({ pathname: fromSearch, state: { from: undefined } });
      return;
    }

    if (external) {
      window.location.replace(external);
    } else {
      history.push({ pathname: redirect, state: { from: location } });
    }
  }, [history, redirect, external, location]);

  useEffect(() => {
    checkRedirectSource();
  }, [checkRedirectSource]);

  return <h1>Loading...</h1>;
};

/**
 * Component that manage the Guest routes (only accessible for guest users)
 * @param {Component} component That component accessible by this route
 * @param {string} redirect The route in the current app where we want to be redirect if we are not authorize to access it (if not external)
 * @param {string} external The external route (on another domaine) where we want to be redirect if we are not authorize to access it
 * @returns JSX
 */
const GuestRoutes = ({
  component: Component, redirect = '/', external = '', ...rest
}) => {
  const { loading, logged } = useSelector(loginSelector);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return <h1>Loading</h1>;
        }
        if (!logged) {
          return <Component {...props} />;
        }
        return <CheckRedirection redirect={redirect} external={external} location={props.location} />;
      }}
    />
  );
};

export default GuestRoutes;
