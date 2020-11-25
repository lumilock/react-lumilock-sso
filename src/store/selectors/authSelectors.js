export const authFullSelector = ({ auth }) => auth

export const authSelector = ({ auth }) => {
  const { infos, auth: newAuth } = auth // we isolate info
  if (infos && newAuth) {
    const { token_info, ...newInfos } = infos // we isolate token_info
    if (token_info) {
      const { expires_in, ...newTokenInfo } = token_info // we isolate expires_in (it is our goal, because we don't want this value)

      return {
        auth: { ...newAuth }, // we return all auth values
        infos: { token_info: { ...newTokenInfo } } // we recreate values infos > token_infon > (all content except expires_in)
      }
    }
  }
  return {
    ...auth
  }
}

export const expireSelector = ({ auth }) => {
  const { infos, auth: newAuth } = auth // we isolate info
  if (infos && newAuth) {
    const { token_info, ...newInfos } = infos // we isolate token_info
    if (token_info) {
      const { expires_in, ...newTokenInfo } = token_info // we isolate expires_in (it is our goal, because we don't want this value)
      return expires_in
    }
  }
  return 0
}

export const loginSelector = ({ auth }) => ({
  loading: auth.auth.loading,
  logged: auth.auth.logged
})
