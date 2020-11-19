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
  if (!cookies.LUMILOCK_AUTH || !cookies.LUMILOCK_EXPIRES) {
    removeCookie('LUMILOCK_AUTH')
    removeCookie('LUMILOCK_EXPIRES')
    return false
  } else {
    return true /** TODO */
  }
}
