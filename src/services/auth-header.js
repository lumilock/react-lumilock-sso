/**
 * This function add the Bearer token from localStorage to the header of request
 */
export default function authHeader() {
  // we get users info from the localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const tokenInfo = JSON.parse(localStorage.getItem('tokenInfo'));

  // we check that the token exist
  if (user && user.id && tokenInfo && tokenInfo.token) {
    // then we return the header autorization bearer
    return { Authorization: `Bearer ${tokenInfo.token}` };
  }
  // else we return an empty object
  return {};
}
