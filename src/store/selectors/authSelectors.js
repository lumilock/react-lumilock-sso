export const authFullSelector = ({ auth }) => auth;

export const authSelector = ({ auth }) => {
  const { infos, auth: newAuth } = auth; // we isolate info
  if (infos && newAuth) {
    const { tokenInfo } = infos; // we isolate tokenInfo
    if (tokenInfo) {
      const { expires_in: expiresIn, ...newTokenInfo } = tokenInfo; // we isolate expires_in (it is our goal, because we don't want this value)
      return {
        auth: { ...newAuth }, // we return all auth values
        infos: { tokenInfo: { ...newTokenInfo } }, // we recreate values infos > tokenInfo > (all content except expires_in)
      };
    }
  }
  return {
    ...auth,
  };
};

export const expireSelector = ({ auth }) => {
  const { infos, auth: newAuth } = auth; // we isolate info
  if (infos && newAuth) {
    const { tokenInfo } = infos; // we isolate tokenInfo
    if (tokenInfo) {
      const { expires_in: expiresIn } = tokenInfo; // we isolate expires_in (it is our goal, because we don't want this value)
      return expiresIn;
    }
  }
  return 0;
};

export const loginSelector = ({ auth }) => ({
  loading: auth.auth.loading,
  logged: auth.auth.logged,
});
