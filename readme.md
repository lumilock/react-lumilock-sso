# Getting started
This package allows you to create protected routes using a centralized authentication, a "Single Sign-On - Auth0". For this we use a cookie system, using the [react-cookie]('https://www.npmjs.com/package/react-cookie') library, your applications must therefore be on the same domain.

Before install react-lumilock-sso you need to install some peerDependancies.  
This is the liste of peer dependances :
- react
- prop-types
- styled-components
- react-router-dom
- redux
- react-redux
- redux-thunk  

You can install them all with the following command :
```
npm install react prop-types styled-components react-router-dom redux react-redux redux-thunk
```

After that you can install react-lumilock-sso
```
npm install react-lumilock-sso
```
# ````<LumilockProvider />````
Provider that manages authentication on all routes.

# ````<ProtectedRoutes />````
Accessible Route only by authenticated users
```jsx
<ProtectedRoutes path="/home" external="http://localhost:3000/login" exact component={Home} />
```
```jsx
<ProtectedRoutes path="/home" redirect="/login" exact component={Home} />
```
## props
This component takes the same props as the `Route` component of `react-router-dom` except that he accepts two more props `redirect` and `external`.
### `redirect`
Use the `Redirect`component of `react-router-dom` to redirect an unauthenticated user to a location of your choice inside your app.
### `external`
Redirect an unauthenticated user to a location of your choice outside of your app if your login page is centralized for multiple apps.

# ````<GuestRoutes />````
Accessible Route only by unauthenticated users.
```jsx
<GuestRoutes path="/login"exact external="http://localhost:1234/home" component={Login} />
```
```jsx
<GuestRoutes path="/login"exact redirect="/home" component={Login} />
```
## props
This component takes the same props as the `Route` component of `react-router-dom` except that he accepts two more props `redirect` and `external`.
### `redirect`
Use the `Redirect`component of `react-router-dom` to redirect an authenticated user to a location of your choice inside your app.
### `external`
Redirect an authenticated user to a location of your choice outside of your app if your login page is centralized for multiple apps.
# ````<LoginForm />````
Component to create the login form which allows users to connect to your api.


# ````authReducer()````
The redux reducer to create the store, you need to add it in all apps.
```js
import { authReducer } from 'react-lumilock-sso'
...
const store = createStore(
  combineReducers({
    ...
    auth: authReducer
  }),
  ...
)
```

# Simple Example 
In this example we do not detail the creation of a react application, or the integration of the redux and react-router-dom packages.  
We present the integration of react-lumilock-sso in two applications which are on the same domain.