import React, { useCallback, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { loginAuthAction } from '../../store/actions/authActions'
import FormGroup from './FormGroup'

const IdentityGroup = () => {
  return <FormGroup id='identity' type='text' label='Email / Login' />
}

const PasswordGroup = () => {
  const [show, setShow] = useState(false)

  const toggleShow = useCallback(
    (e) => {
      e.preventDefault()
      setShow((c) => !c)
    },
    [show]
  )

  return (
    <FormGroup id='password' type={show ? 'text' : 'password'} label='Password'>
      <button onClick={toggleShow}>switch</button>
    </FormGroup>
  )
}

const SubmitGroup = ({ disabled = '' }) => {
  return (
    <FormGroup
      id='submit_connection'
      type='submit'
      label=''
      disabled={disabled}
    />
  )
}
/**
 *
 * @param {*} callbackSuccess
 */
const LoginForm = () => {
  const formRef = useRef()
  // Value used to check if the request is being processed
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  // cookies hook
  const [cookies, setCookie] = useCookies()
  const dispatch = useDispatch()
  const history = useHistory()

  // check errors in fields
  const validateForm = (identity, password) => {
    const _errors = {}
    if (!identity) {
      _errors.identity = ['This field is required !']
    }
    if (!password) {
      _errors.password = ['This field is required !']
    }
    return _errors
  }

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    // get values with form ref
    const identityValue = formRef.current.identity.value
    const passwordValue = formRef.current.password.value

    // Block the button during the process
    setLoading(true)
    // init errors
    await setErrors({})

    // validate form
    const _errors = await validateForm(identityValue, passwordValue)

    // return errors and stop
    if (Object.keys(_errors).length !== 0 || _errors.constructor !== Object) {
      await setErrors({ ...errors, ..._errors })
      setLoading(false)
      return
    }
    // if no error call login service in order to try to cannect the user
    await dispatch(loginAuthAction(identityValue, passwordValue))
      .then(({ data }) => {
        const { token_info, user } = data

        // set the expiration date time from the token to the cookie
        const expireDate = new Date(
          new Date().getTime() + token_info.expires_in * 1000
        )

        // set the cookies
        setCookie('LUMILOCK_AUTH', JSON.stringify(user), {
          path: '/',
          expires: expireDate,
          domain: process.env.REACT_APP_AUTH_DOMAIN
        })
        setCookie('LUMILOCK_TOKEN', JSON.stringify(token_info), {
          path: '/',
          expires: expireDate,
          domain: process.env.REACT_APP_AUTH_DOMAIN
        })

        if (
          cookies &&
          cookies.LUMILOCK_REDIRECT &&
          cookies.LUMILOCK_REDIRECT.origin &&
          cookies.LUMILOCK_REDIRECT.pathname &&
          Object.prototype.hasOwnProperty.call(
            cookies.LUMILOCK_REDIRECT,
            'external'
          )
        ) {
          if (cookies.LUMILOCK_REDIRECT.external) {
            window.location.replace(
              cookies.LUMILOCK_REDIRECT.origin +
                cookies.LUMILOCK_REDIRECT.pathname
            )
          } else {
            history.push(cookies.LUMILOCK_REDIRECT.pathname)
          }
        }
      })
      .catch((error) => {
        console.log('reject : ', error)
        setErrors({
          ...errors,
          message: 'Check your information something went wrong'
        })
        setLoading(false)
      })
  }, [])

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <IdentityGroup />
      <PasswordGroup />
      <SubmitGroup disabled={loading ? 'disabled' : ''} />
    </form>
  )
}

export default LoginForm
