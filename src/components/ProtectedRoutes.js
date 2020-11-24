import React, { useEffect, useState } from 'react' // eslint-disable-line no-unused-vars
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { checkCookies } from '../services/auth'
import { CheckAuthAction, NoAuthAction } from '../store/actions/authActions'
import { authSelector } from '../store/selectors/authSelectors'

const ProtectedRoutes = ({ component: Component, ...rest }) => {
  const [cookies, setCookie, removeCookie] = useCookies()

  const dispatch = useDispatch()
  const { infos, auth } = useSelector(authSelector)

  const [loading, setLoading] = useState(true)
  const [logged, setLogged] = useState(false)

  useEffect(async () => {
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
  }, [])

  // function that looks if auth store change
  useEffect(() => {
    setLoading(auth.loading)
    setLogged(auth.logged)
  }, [auth.loading, auth.logged])

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return <h1>Loading</h1>
        } else {
          if (logged) {
            return <Component />
          } else {
            return (
              <Redirect
                to={{ pathname: '/login', state: { from: props.location } }}
              />
            )
          }
        }
      }}
    />
  )
}

export default ProtectedRoutes
