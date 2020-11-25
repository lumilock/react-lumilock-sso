import React, { useEffect, useState } from 'react' // eslint-disable-line no-unused-vars
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { loginSelector } from '../store/selectors/authSelectors'

const ProtectedRoutes = ({ component: Component, ...rest }) => {
  const { loading, logged } = useSelector(loginSelector)

  // useEffect(() => {
  //   console.log('loading : ' + loading, 'logged : ' + logged)
  // }, [loading, logged])

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
