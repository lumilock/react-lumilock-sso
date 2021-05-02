const initialState = {
  infos: {},
  auth: {
    loading: true,
    logged: false,
  },
};

export const ADD_AUTH_ACTION = 'ADD_AUTH_ACTION';
export const LOGIN_AUTH_SUCCESS = 'LOGIN_AUTH_SUCCESS';
export const LOGIN_AUTH_FAIL = 'LOGIN_AUTH_FAIL';
export const DELETE_AUTH_ACTION = 'DELETE_AUTH_ACTION';
export const NO_AUTH_ACTION = 'NO_AUTH_ACTION';
export const LOGOUT_AUTH_FAIL = 'LOGOUT_AUTH_FAIL';
export const LOGOUT_AUTH_SUCCESS = 'LOGOUT_AUTH_SUCCESS';

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_AUTH_ACTION:
      return [...state, ...action.payload];
    case LOGIN_AUTH_SUCCESS:
      return {
        ...state,
        auth: {
          loading: false,
          logged: true,
        },
        infos: action.payload,
      };
    case LOGIN_AUTH_FAIL:
      return {
        infos: {},
        auth: {
          loading: false,
          logged: false,
        },
      };
    case LOGOUT_AUTH_FAIL:
      return state;
    case LOGOUT_AUTH_SUCCESS:
      return {
        ...initialState,
        auth: {
          loading: false,
          logged: false,
        },
      };
    case DELETE_AUTH_ACTION:
      return {
        ...initialState,
        auth: {
          loading: false,
          logged: false,
        },
      };
    case NO_AUTH_ACTION:
      return { ...initialState, auth: { loading: false, logged: false } };
    default:
      return state;
  }
}
