/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, react/jsx-filename-extension */
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';

import qs from 'qs';

import { loginSelector } from '../store/selectors/authSelectors';

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
          return <Component />;
        }
        return <CheckRedirection redirect={redirect} external={external} location={props.location} />;
      }}
    />
  );
};

export default GuestRoutes;
