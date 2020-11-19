import {
  ADD_AUTH_ACTION,
  DELETE_AUTH_ACTION,
  NO_AUTH_ACTION
} from '../reducers/authReducer'

export const addAuthAction = (auth) => ({
  type: ADD_AUTH_ACTION,
  payload: auth
})

export const deleteAuthAction = () => ({
  type: DELETE_AUTH_ACTION
})

export const NoAuthAction = () => ({
  type: NO_AUTH_ACTION
})
