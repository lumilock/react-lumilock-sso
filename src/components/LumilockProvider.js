import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CookiesProvider, useCookies } from 'react-cookie'
import { checkCookies } from '../services/auth'
import { CheckAuthAction, NoAuthAction } from '../store/actions/authActions'
import { expireSelector, loginSelector } from '../store/selectors/authSelectors'

const LumilockCheckAuth = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies()
  const dispatch = useDispatch()
  const { loading, logged } = useSelector(loginSelector)
  const expire_in = useSelector(expireSelector)
  const [intervalId, setIntervalId] = useState()

  // useEffect(() => {
  //   if (cookies && cookies.LUMILOCK_REDIRECT) {
  //     console.log('provider said = ', cookies.LUMILOCK_REDIRECT)
  //   }
  // }, [cookies])

  const checkConnexion = useCallback(async () => {
    try {
      if (checkCookies(cookies, removeCookie)) {
        await dispatch(CheckAuthAction(cookies.LUMILOCK_TOKEN.token))
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
              domain: 'localhost'
            })
            setCookie('LUMILOCK_TOKEN', JSON.stringify(token_info), {
              path: '/',
              expires: expireDate,
              domain: 'localhost'
            })
          })
          .catch((error) => {
            console.log('reject : ', error)
          })
      } else {
        dispatch(NoAuthAction())
      }
    } catch (error) {
      console.log('Cookies error : ', error)
    }
  }, [cookies])

  useEffect(async () => {
    try {
      await checkConnexion()
    } catch (error) {
      console.log('Check Connexion error : ', error)
    }
  }, [])

  // we start a timer if logged value change in order to check if user socket is end
  useEffect(() => {
    if (logged) {
      window.clearInterval(intervalId)
      // const time = expire_in && expire_in > 0 ? expire_in * 1000 : 1000 // we check that the interval time exist and is superior to 0
      const id = window.setInterval(async () => {
        try {
          await checkConnexion()
        } catch (error) {}
      }, expire_in * 1000)
      setIntervalId(id)
    } else {
      window.clearInterval(intervalId)
    }
    return () => window.clearInterval(intervalId)
  }, [loading, logged, expire_in])

  // we clean the timer if the component is closed
  useEffect(() => {
    return () => {
      window.clearInterval(intervalId)
    }
  }, [intervalId])

  return <>{children}</>
}

const LumilockProvider = ({ children }) => {
  // todo add props for process.env.REACT_APP_AUTH_API_URL in a context
  return (
    <CookiesProvider>
      <LumilockCheckAuth>{children}</LumilockCheckAuth>
    </CookiesProvider>
  )
}

export default LumilockProvider
