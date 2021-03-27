/* eslint-disable react/jsx-filename-extension */
// eslint-disable-next-line import/no-unresolved
import React, { useCallback, useRef, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import { loginAuthAction } from '../../store/actions/authActions';

/**
 *
 * @param {*} callbackSuccess
 */
const LoginForm = ({
  Message, Identity, Password, Submit,
}) => {
  const formRef = useRef();
  // Value used to check if the request is being processed
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // cookies hook
  const [, setCookie] = useCookies();
  const dispatch = useDispatch();

  /**
   * Function that check identity and password field
   */
  const validateForm = useCallback((identity, password) => {
    const localErrors = {};
    if (!identity) {
      localErrors.identity = ['This field is required !'];
    }
    if (!password) {
      localErrors.password = ['This field is required !'];
    }
    return localErrors;
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      // get values with form ref
      const identityValue = formRef.current.identity.value;
      const passwordValue = formRef.current.password.value;

      // Block the button during the process
      setLoading(true);
      // init errors
      setErrors({});

      // validate form
      const localErrors = validateForm(identityValue, passwordValue);

      // return errors and stop
      if (Object.keys(localErrors).length !== 0 || localErrors.constructor !== Object) {
        setErrors((old) => ({ ...old, ...localErrors }));
        setLoading(false);
        return;
      }

      // if no error call login service in order to try to connect the user
      await dispatch(loginAuthAction(identityValue, passwordValue))
        .then(({ data }) => {
          const { tokenInfo, user } = data;

          // set the expiration date time from the token to the cookie
          const expireDate = new Date(new Date().getTime() + tokenInfo.expires_in * 1000);

          // set the cookies
          setCookie('LUMILOCK_AUTH', JSON.stringify(user), {
            path: '/',
            expires: expireDate,
            domain: process.env.REACT_APP_AUTH_DOMAIN,
          });
          setCookie('LUMILOCK_TOKEN', JSON.stringify(tokenInfo), {
            path: '/',
            expires: expireDate,
            domain: process.env.REACT_APP_AUTH_DOMAIN,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('reject 22: ', error);
          setErrors((old) => ({
            ...old,
            message: 'Check your information something went wrong',
          }));
          setLoading(false);
        });
    },
    [dispatch, setCookie, validateForm],
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Message error={errors.message ?? ''} />
      <Identity error={errors.identity?.length > 0 ? errors.identity[0] : ''} />
      <Password error={errors.password?.length > 0 ? errors.password[0] : ''} />
      <Submit disabled={!!loading} />
      {/* <IdentityGroup />
      <PasswordGroup />
      <SubmitGroup disabled={loading ? 'disabled' : ''} /> */}
    </form>
  );
};

export default LoginForm;
