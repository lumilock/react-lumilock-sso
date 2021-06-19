import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CookiesProvider, useCookies } from 'react-cookie';

import { checkCookies } from '../services/auth';

import { CheckAuthAction, NoAuthAction } from '../store/actions/authActions';
import { expireSelector, loginSelector } from '../store/selectors/authSelectors';

const LumilockCheckAuth = ({ children }) => {
  // Cookie
  const [cookies, setCookie, removeCookie] = useCookies();
  // Dispatch
  const dispatch = useDispatch();
  // Selector
  const { loading, logged } = useSelector(loginSelector);
  const expireIn = useSelector(expireSelector);
  // States
  const [intervalId, setIntervalId] = useState();

  const checkConnexion = useCallback(async () => {
    try {
      if (checkCookies(cookies, removeCookie)) {
        await dispatch(CheckAuthAction(cookies.LUMILOCK_TOKEN.token))
          .then(({ data }) => {
            const { tokenInfo, user } = data;
            // set the expiration date time from the token to the cookie
            const expireDate = new Date(new Date().getTime() + tokenInfo.expires_in * 1000);
            // set the cookies
            setCookie('LUMILOCK_AUTH', JSON.stringify(user), {
              path: '/',
              expires: expireDate,
              domain: process.env.REACT_APP_AUTH_DOMAIN,
            });
            setCookie('LUMILOCK_TOKEN', JSON.stringify(tokenInfo), {
              path: '/',
              expires: expireDate,
              domain: process.env.REACT_APP_AUTH_DOMAIN,
            });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('reject : ', error);
          });
      } else {
        dispatch(NoAuthAction());
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Cookies error : ', error);
    }
  }, [cookies, dispatch, removeCookie, setCookie]);

  /**
   * Call the function checkConnexion at the mounted state of the current component
   */
  useEffect(() => {
    const checkCo = async () => {
      try {
        await checkConnexion();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Check Connexion error : ', error);
      }
    };
    checkCo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only at the mounted not when checkConnexion update

  // we start a timer if logged value change in order to check if user socket is end
  useEffect(() => {
    if (logged) {
      // const time = expireIn && expireIn > 0 ? expireIn * 1000 : 1000 // we check that the interval time exist and is superior to 0
      const id = window.setInterval(async () => {
        try {
          await checkConnexion();
        } catch (error) {}
      }, expireIn * 1000);
      setIntervalId((old) => {
        window.clearInterval(old);
        return id;
      });
    }
  }, [loading, logged, expireIn, checkConnexion]);

  // we clean the timer if the component is closed
  useEffect(
    () => () => {
      window.clearInterval(intervalId);
    },
    [intervalId],
  );
  useEffect(() => {
    if (!logged) {
      window.clearInterval(intervalId);
    }
  }, [intervalId, logged]);

  return <>{children}</>;
};

const LumilockProvider = ({ children }) => (
  // ? todo add props for process.env.REACT_APP_AUTH_API_URL in a context
  <CookiesProvider>
    <LumilockCheckAuth>{children}</LumilockCheckAuth>
  </CookiesProvider>
);

export default LumilockProvider;
