/**
 * This function add the Bearer token from localStorage to the header of request
 */
export default function authHeader() {
  // we get users info from the localStorage
  const user = JSON.parse(localStorage.getItem('user'))

  // we check that the token exist
  if (user && user.token && user.token.token) {
    // then we return the header autorization bearer
    return { Authorization: 'Bearer ' + user.token.token }
  } else {
    // else we return an empty object
    return {}
  }
}
