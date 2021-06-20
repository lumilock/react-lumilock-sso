import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import { loginAuthAction } from '../../store/actions/authActions';

/**
 * Component that manage the login form
 * @param {func} renderForm function that get 4 params
 *  - message : {string} a succes or error message to give a feedback to the user
 *  - identity : {array} an array of messages that concerne the field identity
 *  - password : {array} an array of messages that concerne the field password
 *  - loading : {bool} a boolean to indicate if we are connecting
 * @returns JSX
 */
const LoginForm = ({ renderForm }) => {
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

  /**
   * Function that login the user
   * store in redux and cookies the auth infos after login in
   */
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
        .catch(() => {
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
      {renderForm(errors.message, errors.identity, errors.password, loading)}
    </form>
  );
};

export default LoginForm;
