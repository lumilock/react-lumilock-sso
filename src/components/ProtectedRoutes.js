import React, { useEffect, useState } from 'react' // eslint-disable-line no-unused-vars
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
// import { useCookies } from 'react-cookie'
import { Redirect, Route } from 'react-router-dom'
import { checkCookies } from '../services/auth'
import { NoAuthAction } from '../store/actions/authActions'
import { authSelector } from '../store/selectors/authSelectors'

const ProtectedRoutes = ({ component: Component, ...rest }) => {
  const [cookies, setCookie, removeCookie] = useCookies()

  const dispatch = useDispatch()
  const { infos, auth } = useSelector(authSelector)

  const [loading, setLoading] = useState(true)
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    if (checkCookies(cookies, setCookie, removeCookie)) {
    } else {
      dispatch(NoAuthAction())
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
