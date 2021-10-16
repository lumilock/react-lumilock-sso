export const authFullSelector = ({ auth }) => auth;

export const authSelector = ({ auth }) => {
  const { infos, auth: newAuth } = auth; // we isolate info
  if (infos && newAuth) {
    const { tokenInfo } = infos; // we isolate tokenInfo
    if (tokenInfo) {
      const { expires_in: expiresIn, ...newTokenInfo } = tokenInfo; // we isolate expires_in (it is our goal, because we don't want this value)
      return {
        auth: { ...newAuth }, // we return all auth values
        infos: { ...infos, tokenInfo: { ...newTokenInfo } }, // we recreate values infos > tokenInfo > (all content except expires_in)
      };
    }
  }
  return {
    ...auth,
  };
};

/**
 * return data usefull for the profile info in the nav
 */
export const profileSelector = ({ auth }) => {
  const { infos } = auth; // we isolate info
  return {
    fullName: infos?.user?.first_name && infos?.user?.last_name ? `${infos?.user?.first_name} ${infos?.user?.last_name}` : '',
    firstName: infos?.user?.first_name ?? '',
    lastName: infos?.user?.last_name ?? '',
    picture: infos?.user?.picture ?? '',
  };
};

export const expireSelector = ({ auth }) => {
  const { infos, auth: newAuth } = auth; // we isolate info
  if (infos && newAuth) {
    const { tokenInfo } = infos; // we isolate tokenInfo
    if (tokenInfo) {
      const { expires_in: expiresIn } = tokenInfo; // we get expires_in
      return expiresIn;
    }
  }
  return 0;
};

export const loginSelector = ({ auth }) => ({
  loading: auth.auth.loading,
  logged: auth.auth.logged,
});

/**
 * Return only permissions
 */
export const getPermissions = ({ auth }) => auth.infos.permissions;
