// import Text from './components/text/Text';
import LumilockProvider from './components/LumilockProvider';
import ProtectedRoutes from './components/ProtectedRoutes';
import GuestRoutes from './components/GuestRoutes';
import LoginForm from './components/form/LoginForm';
import authReducer from './store/reducers/authReducer';
import {
  authFullSelector, authSelector, expireSelector, loginSelector,
} from './store/selectors/authSelectors';

import { logoutAuthAction } from './store/actions/authActions';

export {
  LumilockProvider, ProtectedRoutes, GuestRoutes, LoginForm, authReducer, authFullSelector, authSelector, expireSelector, loginSelector, logoutAuthAction,
};
