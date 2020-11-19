import React from 'react' // eslint-disable-line no-unused-vars
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import store from '../store'

const LumilockProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <CookiesProvider>{children}</CookiesProvider>
    </Provider>
  )
}

export default LumilockProvider
