const initialState = {
  infos: {},
  auth: {
    loading: true,
    logged: false
  }
}

export const ADD_AUTH_ACTION = 'ADD_AUTH_ACTION'
export const LOGIN_AUTH_SUCCESS = 'LOGIN_AUTH_SUCCESS'
export const LOGIN_AUTH_FAIL = 'LOGIN_AUTH_FAIL'
export const DELETE_AUTH_ACTION = 'DELETE_AUTH_ACTION'
export const NO_AUTH_ACTION = 'NO_AUTH_ACTION'

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_AUTH_ACTION:
      return [...state, ...action.payload]
    case LOGIN_AUTH_SUCCESS:
      return {
        ...state,
        auth: {
          loading: false,
          logged: true
        },
        infos: action.payload
      }
      return [...state, ...action.payload]
    case LOGIN_AUTH_SUCCESS:
      return {
        infos: {},
        auth: {
          loading: false,
          logged: false
        }
      }
    case DELETE_AUTH_ACTION:
      return initialState
    case NO_AUTH_ACTION:
      return { ...initialState, auth: { loading: false, logged: false } }
    default:
      return state
  }
}
