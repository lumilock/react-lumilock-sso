import React from 'react' // eslint-disable-line no-unused-vars
import { CookiesProvider } from 'react-cookie'
import TestRoute from './TestRoute'

const Provider = ({ children }) => {
  return (
    <CookiesProvider>
      <TestRoute />
      {children}
    </CookiesProvider>
  )
}

export default Provider
