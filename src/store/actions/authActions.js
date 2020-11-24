import {
  ADD_AUTH_ACTION,
  DELETE_AUTH_ACTION,
  NO_AUTH_ACTION,
  LOGIN_AUTH_SUCCESS,
  LOGIN_AUTH_FAIL
} from '../reducers/authReducer'

import { login as AuthService, checkAuth } from '../../services/auth'

export const addAuthAction = (auth) => ({
  type: ADD_AUTH_ACTION,
  payload: auth
})

/**
 * Optimize with LoginAuthAction
 */
export const CheckAuthAction = (token) => (dispatch) => {
  return checkAuth(token).then(
    (response) => {
      // check the response of the service
      if (response.type === 'fail') {
        dispatch({
          type: LOGIN_AUTH_FAIL
        })
        // throw the error
        return Promise.reject()
      } else if (response.type === 'success') {
        // If connection work we update state and give to reducer users info from the request result
        dispatch({
          type: LOGIN_AUTH_SUCCESS,
          payload: response.data
        })
        // save some data to LocalStorage
        const { data } = response.data
        const { token_info, user } = data
        localStorage.setItem('token_info', JSON.stringify(token_info))
        localStorage.setItem('user', JSON.stringify(user))

        return Promise.resolve(response.data)
      }
      return Promise.reject()
    },
    (error) => {
      // If an error occurs during the registration
      console.log('loginAuthAction error : ', error)
      // we update the state
      dispatch({
        type: LOGIN_AUTH_FAIL
      })
      // remove data from localStorage
      localStorage.removeItem('token_info')
      localStorage.setItem('user')
      return Promise.reject()
    }
  )
}

/**
 * Return a promise after executed the /auth/login axios request
 *
 * @param {string} identity User email or login
 * @param {string} password User password
 */
export const loginAuthAction = (identity, password) => (dispatch) => {
  return AuthService(identity, password).then(
    (response) => {
      // check the response of the service
      if (response.type === 'fail') {
        dispatch({
          type: LOGIN_AUTH_FAIL
        })
        // throw the error
        return Promise.reject()
      } else if (response.type === 'success') {
        // If connection work we update state and give to reducer users info from the request result
        dispatch({
          type: LOGIN_AUTH_SUCCESS,
          payload: response.data
        })
        // save some data to LocalStorage
        const { data } = response.data
        const { token_info, user } = data
        localStorage.setItem('token_info', JSON.stringify(token_info))
        localStorage.setItem('user', JSON.stringify(user))

        return Promise.resolve(response.data)
      }
      return Promise.reject()
    },
    (error) => {
      // If an error occurs during the registration
      console.log('loginAuthAction error : ', error)
      // we update the state
      dispatch({
        type: LOGIN_AUTH_FAIL
      })
      // remove data from localStorage
      localStorage.removeItem('token_info')
      localStorage.setItem('user')
      return Promise.reject()
    }
  )
}

export const deleteAuthAction = () => ({
  type: DELETE_AUTH_ACTION
})

export const NoAuthAction = () => ({
  type: NO_AUTH_ACTION
})
