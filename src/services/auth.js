// eslint-disable-next-line no-unused-vars
import authHeader from './auth-header';

// Base url
const API_URL = process.env.REACT_APP_AUTH_API_URL;

// eslint-disable-next-line no-unused-vars
const checkIsLogged = () => {
  // Simple POST request with a JSON body using fetch
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  fetch(`${API_URL}check`, requestOptions)
    .then((response) => response.json())
    // eslint-disable-next-line no-console
    .then((data) => console.log(data));
};

/**
 * This function look if Lumilock Auth cookies exist
 * All parameters comme from the hook useCookies
 * @param {Object} cookies
 * @param {Function} removeCookie
 */
export const checkCookies = (cookies, removeCookie) => {
  if (!cookies.LUMILOCK_AUTH || !cookies.LUMILOCK_TOKEN || !cookies.LUMILOCK_TOKEN.token) {
    removeCookie('LUMILOCK_AUTH');
    removeCookie('LUMILOCK_TOKEN');
    return false;
  }
  return true;
};

/**
 *
 * @param {String} token
 */
export const checkAuth = async (token) => {
  // TODO create generique fetch
  try {
    const init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`, // we add token manually
      },
    };
    return await fetch(`${API_URL}check`, init)
      .then((response) => {
        // we chack the response status
        if (response.status !== 200 && response.status !== 201) {
          throw new Error({
            // if the status is different of an success we throw an error
            status: response.status,
            url: response.url,
            message: response.statusText,
          });
        }
        return response.json(); // we convert response to json
      })
      .then((data) => ({ type: 'success', data }))
      .catch((error) => ({ type: 'fail', ...error }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error :', error);
    return { type: 'fail', ...error };
  }
};

export const login = async (identity, password) => {
  try {
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ identity, password }),
    };

    return await fetch(`${API_URL}login`, init)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error({
            status: response.status,
            url: response.url,
            message: response.statusText,
          });
        }
        return response.json();
      })
      .then((data) => ({ type: 'success', data }))
      .catch((error) => ({ type: 'fail', ...error }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error :', error);
    return { type: 'fail', ...error };
  }
};

export const logout = async () => {
  try {
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...authHeader(),
      },
    };

    return await fetch(`${API_URL}logout`, init)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error({
            status: response.status,
            url: response.url,
            message: response.statusText,
          });
        }
        return response.json();
      })
      .then((data) => ({ type: 'success', data }))
      .catch((error) => ({ type: 'fail', ...error }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error :', error);
    return { type: 'fail', ...error };
  }
};
