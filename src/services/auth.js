import authHeader from './auth-header'

// Base url
const API_URL = process.env.REACT_APP_AUTH_API_URL

const checkIsLogged = () => {
  // Simple POST request with a JSON body using fetch
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }
  fetch(API_URL + 'check', requestOptions)
    .then((response) => response.json())
    .then((data) => console.log(data))
}

/**
 * This function look if Lumilock Auth cookies exist
 * All parameters comme from the hook useCookies
 * @param {Object} cookies
 * @param {Function} removeCookie
 */
export const checkCookies = (cookies, removeCookie) => {
  if (
    !cookies.LUMILOCK_AUTH ||
    !cookies.LUMILOCK_TOKEN ||
    !cookies.LUMILOCK_TOKEN.token
  ) {
    removeCookie('LUMILOCK_AUTH')
    removeCookie('LUMILOCK_TOKEN')
    return false
  } else {
    return true
  }
}
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
        Authorization: 'Bearer ' + token // we add token manually
      }
    }
    return await fetch(API_URL + 'check', init)
      .then(function (response) {
        // we chack the response status
        if (response.status !== 200 && response.status !== 201) {
          throw {
            // if the status is different of an success we throw an error
            status: response.status,
            url: response.url,
            message: response.statusText
          }
        }
        return response.json() // we convert response to json
      })
      .then((data) => {
        return { type: 'success', data }
      })
      .catch((error) => {
        return { type: 'fail', ...error }
      })
  } catch (error) {
    console.log('Error :', error)
    return { type: 'fail', ...error }
  }
}

export const login = async (identity, password) => {
  try {
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ identity, password })
    }

    return await fetch(API_URL + 'login', init)
      .then(function (response) {
        if (response.status !== 200 && response.status !== 201) {
          throw {
            status: response.status,
            url: response.url,
            message: response.statusText
          }
        }
        return response.json()
      })
      .then((data) => {
        return { type: 'success', data }
      })
      .catch((error) => {
        return { type: 'fail', ...error }
      })
  } catch (error) {
    console.log('Error :', error)
    return { type: 'fail', ...error }
  }
}
