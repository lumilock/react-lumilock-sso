import React, { useEffect, useState } from 'react' // eslint-disable-line no-unused-vars
import { useCookies } from 'react-cookie'
import { useSelector } from 'react-redux'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { loginSelector } from '../store/selectors/authSelectors'

const ProtectedRoutes = ({
  component: Component,
  redirect = '/login',
  external = '',
  ...rest
}) => {
  const { loading, logged } = useSelector(loginSelector)
  const location = useLocation()
  const [cookies, setCookie] = useCookies()

  useEffect(() => {
    // set the cookies
    if (!logged) {
      console.log(new Date(new Date().getTime() + 1 * 60000)) // one minutes * 60000 = millisecondes
      setCookie(
        'LUMILOCK_REDIRECT',
        JSON.stringify({
          origin: window.location.origin,
          pathname: location.pathname,
          external: external !== ''
        }),
        {
          path: '/',
          expires: new Date(new Date().getTime() + 1 * 60000), // one minutes * 60000 = millisecondes
          domain: process.env.REACT_APP_AUTH_DOMAIN
        }
      )
    }
  }, [logged])

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
            if (external) {
              window.location.replace(external)
              return null
            } else {
              return (
                <Redirect
                  to={{ pathname: redirect, state: { from: props.location } }}
                />
              )
            }
          }
        }
      }}
    />
  )
}

export default ProtectedRoutes
