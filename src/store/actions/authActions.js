import {
  ADD_AUTH_ACTION, DELETE_AUTH_ACTION, NO_AUTH_ACTION, LOGIN_AUTH_SUCCESS, LOGIN_AUTH_FAIL, LOGOUT_AUTH_SUCCESS, LOGOUT_AUTH_FAIL,
} from '../reducers/authReducer';

import { login as AuthService, checkAuth, logout as AuthLogoutService } from '../../services/auth';

export const addAuthAction = (auth) => ({
  type: ADD_AUTH_ACTION,
  payload: auth,
});

/**
 * Optimize with LoginAuthAction
 */
export const CheckAuthAction = (token) => (dispatch) => checkAuth(token).then(
  (response) => {
    // check the response of the service
    if (response.type === 'fail') {
      dispatch({
        type: LOGIN_AUTH_FAIL,
      });
      // throw the error
      return Promise.reject();
    }
    if (response.type === 'success') {
      // If connection work we update state and give to reducer users info from the request result
      const { data } = response.data;
      const { token_info: tokenInfo, user } = data;
      dispatch({
        type: LOGIN_AUTH_SUCCESS,
        payload: { tokenInfo, user },
      });
      // save some data to LocalStorage
      localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo));
      localStorage.setItem('user', JSON.stringify(user));

      return Promise.resolve({ ...response.data, data: { tokenInfo, user } });
    }
    // we update the state
    dispatch({
      type: LOGIN_AUTH_FAIL,
    });
    // remove data from localStorage
    localStorage.removeItem('tokenInfo');
    localStorage.removeItem('user');
    return Promise.reject();
  },
  (error) => {
    // If an error occurs during the registration
    // eslint-disable-next-line no-console
    console.error('loginAuthAction error : ', error);
    // we update the state
    dispatch({
      type: LOGIN_AUTH_FAIL,
    });
    // remove data from localStorage
    localStorage.removeItem('tokenInfo');
    localStorage.removeItem('user');
    return Promise.reject();
  },
);

/**
 * Return a promise after executed the /auth/login axios request
 *
 * @param {string} identity User email or login
 * @param {string} password User password
 */
export const loginAuthAction = (identity, password) => (dispatch) => AuthService(identity, password).then(
  (response) => {
    // check the response of the service
    if (response.type === 'fail') {
      dispatch({
        type: LOGIN_AUTH_FAIL,
      });
      // throw the error
      return Promise.reject();
    }
    if (response.type === 'success') {
      // If connection work we update state and give to reducer users info from the request result
      const { data } = response.data;
      const { token_info: tokenInfo, user } = data;
      dispatch({
        type: LOGIN_AUTH_SUCCESS,
        payload: { tokenInfo, user },
      });
      // save some data to LocalStorage
      localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo));
      localStorage.setItem('user', JSON.stringify(user));
      return Promise.resolve({ ...response.data, data: { tokenInfo, user } });
    }
    // we update the state
    dispatch({
      type: LOGIN_AUTH_FAIL,
    });
    // remove data from localStorage
    localStorage.removeItem('tokenInfo');
    localStorage.removeItem('user');
    return Promise.reject();
  },
  (error) => {
    // If an error occurs during the registration
    // eslint-disable-next-line no-console
    console.error('loginAuthAction error : ', error);
    // we update the state
    dispatch({
      type: LOGIN_AUTH_FAIL,
    });
    // remove data from localStorage
    localStorage.removeItem('tokenInfo');
    localStorage.removeItem('user');
    return Promise.reject();
  },
);

export const logoutAuthAction = () => (dispatch) => AuthLogoutService().then(
  (response) => {
    // check the response of the service
    if (response.type === 'fail') {
      dispatch({
        type: LOGOUT_AUTH_FAIL,
      });
      // throw the error
      return Promise.reject();
    }
    if (response.type === 'success') {
      dispatch({
        type: LOGOUT_AUTH_SUCCESS,
      });
      // remove data from localStorage
      localStorage.removeItem('tokenInfo');
      localStorage.removeItem('user');
      document.cookie = 'LUMILOCK_AUTH=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'LUMILOCK_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      return Promise.resolve({ ...response.data });
    }
    // we update the state
    dispatch({
      type: LOGOUT_AUTH_FAIL,
    });
    return Promise.reject();
  },
  (error) => {
    // If an error occurs during the registration
    // eslint-disable-next-line no-console
    console.error('logoutAuthAction error : ', error);
    // we update the state
    dispatch({
      type: LOGOUT_AUTH_FAIL,
    });
    return Promise.reject();
  },
);

export const deleteAuthAction = () => (dispatch) => {
  try {
    dispatch({
      type: DELETE_AUTH_ACTION,
    });
    // remove data from localStorage
    localStorage.removeItem('tokenInfo');
    localStorage.removeItem('user');
    document.cookie = 'LUMILOCK_AUTH=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'LUMILOCK_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    return Promise.resolve('SUCCESS');
  } catch (e) {
    return Promise.reject();
  }
};

export const NoAuthAction = () => (dispatch) => {
  dispatch({
    type: NO_AUTH_ACTION,
  });
  // remove data from localStorage
  localStorage.removeItem('tokenInfo');
  localStorage.removeItem('user');
};
