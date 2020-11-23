import authHeader from './auth-header'

// Base url
const API_URL = 'http://localhost:8000/api/auth/'

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

export const checkCookies = (cookies, setCookie, removeCookie) => {
  if (!cookies.LUMILOCK_AUTH || !cookies.LUMILOCK_TOKEN) {
    removeCookie('LUMILOCK_AUTH')
    removeCookie('LUMILOCK_TOKEN')
    return false
  } else {
    return true /** TODO */
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
