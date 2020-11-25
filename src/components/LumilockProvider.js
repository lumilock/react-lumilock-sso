import React, { useCallback, useEffect, useState } from 'react' // eslint-disable-line no-unused-vars
import { useDispatch, useSelector } from 'react-redux'
import { CookiesProvider, useCookies } from 'react-cookie'
import { checkCookies } from '../services/auth'
import { CheckAuthAction, NoAuthAction } from '../store/actions/authActions'
import {
  authFullSelector,
  authSelector,
  loginSelector
} from '../store/selectors/authSelectors'

const LumilockCheckAuth = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies()
  const dispatch = useDispatch()
  const { loading, logged } = useSelector(loginSelector)
  const { infos, auth } = useSelector(authFullSelector)
  let timer = null

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
      clearInterval(timer)
      const time =
        infos.token_info.expires_in && infos.token_info.expires_in > 0
          ? infos.token_info.expires_in * 1000
          : 1000 // we check that the interval time exist and is superior to 0
      timer = window.setInterval(async () => {
        try {
          await checkConnexion()
          console.log(infos.token_info.expires_in)
        } catch (error) {
          console.log('Check Connexion error : ', error)
        }
      }, time)
    } else {
      clearInterval(timer)
    }
  }, [loading, logged])

  // we clean the timer if the component is closed
  useEffect(() => {
    return () => {
      clearInterval(timer)
    }
  }, [])

  return <>{children}</>
}

const LumilockProvider = ({ children }) => {
  // useEffect(() => {
  //   console.log('here')
  // }, [])

  return (
    <CookiesProvider>
      <LumilockCheckAuth>{children}</LumilockCheckAuth>
    </CookiesProvider>
  )
}

export default LumilockProvider
