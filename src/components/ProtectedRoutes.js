import React, { useEffect, useState } from 'react' // eslint-disable-line no-unused-vars
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { loginSelector } from '../store/selectors/authSelectors'

const ProtectedRoutes = ({
  component: Component,
  redirect = '/login',
  external = '',
  ...rest
}) => {
  const { loading, logged } = useSelector(loginSelector)

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
