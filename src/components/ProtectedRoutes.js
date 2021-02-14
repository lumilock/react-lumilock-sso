import React, { useCallback, useEffect } from 'react'
// import { useCookies } from 'react-cookie'
import { useSelector } from 'react-redux'
import { Redirect, Route, useHistory } from 'react-router-dom'
import { loginSelector } from '../store/selectors/authSelectors'

const CheckRedirection = ({ redirect = '/', external = '', location }) => {
  const history = useHistory()

  const checkRedirectSource = useCallback(async () => {
    if (external) {
      await window.location.replace(external + '?from=' + window.location.href)
    } else {
      await history.push({ pathname: redirect, state: { from: location } })
    }
  }, [history, redirect, external, location])

  useEffect(() => {
    checkRedirectSource()
  }, [checkRedirectSource])

  return <h1>Loading ...</h1>
}

const ProtectedRoutes = ({
  component: Component,
  redirect = '/login',
  external = '',
  ...rest
}) => {
  const { loading, logged } = useSelector(loginSelector)

  // Function to redirect user to an external website that contain our login page
  const externalRedirect = useCallback(() => {
    window.location.replace(external + '?from=' + window.location.href)
  }, [external])

  // Function to redirect user to an internal login page
  const internalRedirect = useCallback(
    (location) => {
      return <Redirect to={{ pathname: redirect, state: { from: location } }} />
    },
    [redirect]
  )

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
              <CheckRedirection
                redirect={redirect}
                external={external}
                location={props.location}
              />
            )
          }
        }
      }}
    />
  )
}

export default ProtectedRoutes
