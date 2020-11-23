/**
 * This function add the Bearer token from localStorage to the header of request
 */
export default function authHeader() {
  // we get users info from the localStorage
  const user = JSON.parse(localStorage.getItem('user'))
  const token_info = JSON.parse(localStorage.getItem('token_info'))

  // we check that the token exist
  if (user && user.id && token_info && token_info.token) {
    // then we return the header autorization bearer
    return { Authorization: 'Bearer ' + token_info.token }
  } else {
    // else we return an empty object
    return {}
  }
}
