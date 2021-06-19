# react-lumilock-sso
## 📚 Getting started
This package allows you to create protected routes using a centralized authentication, a "Single Sign-On - Auth0". For this we use a cookie system, ([react-cookie]('https://www.npmjs.com/package/react-cookie') library), your applications must therefore be on the same domain.

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
## 📦 Components
This library allow you tu use multiple components to manage the "Single Sign-On - Auth0" on your app :

## ````<LumilockProvider />````
Provider that manages authentication on all routes.

## ````<ProtectedRoutes />````
Accessible Route only by authenticated users
```jsx
<ProtectedRoutes path="/home" external="http://localhost:3000/login" exact component={Home} />
```
```jsx
<ProtectedRoutes path="/home" redirect="/login" exact component={Home} />
```
### props
This component takes the same props as the `Route` component of `react-router-dom` except that he accepts two more props `redirect` and `external`.
#### `redirect`
Use the `Redirect`component of `react-router-dom` to redirect an unauthenticated user to a location of your choice inside your app.
#### `external`
Redirect an unauthenticated user to a location of your choice outside of your app if your login page is centralized for multiple apps.

## ````<GuestRoutes />````
Accessible Route only by unauthenticated users.
```jsx
<GuestRoutes path="/login"exact external="http://localhost:1234/home" component={Login} />
```
```jsx
<GuestRoutes path="/login"exact redirect="/home" component={Login} />
```
### props
This component takes the same props as the `Route` component of `react-router-dom` except that he accepts two more props `redirect` and `external`.
#### `redirect`
Use the `Redirect`component of `react-router-dom` to redirect an authenticated user to a location of your choice inside your app.
#### `external`
Redirect an authenticated user to a location of your choice outside of your app if your login page is centralized for multiple apps.

## ````<LoginForm />````
Component to create the login form which allows users to connect to your api.
### props
This component takes only one props to allow you to render form fields
#### `renderForm`
Render one jsx element that contain all your fields, 2 fields are required `identity` and `password`, plus a `submit` button.
This render function have 4 params :
- `message` : {string} a succes or error message to give a feedback to the user
- `identity` : {array} an array of messages that concerne the field identity
- `password` : {array} an array of messages that concerne the field password
- `loading` : {bool} a boolean to indicate if we are connecting
 

## 🧰 Functions 
## ````authReducer()````
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

## ````authFullSelector()````
The redux selector to retrieve raw auth infos.

## ````authSelector()````
The redux selector to retrieve all auth infos, but formated like following : 
```json
{
  "auth": { /** auth infos */ },
  "infos": { /** tokens infos */ }
}
```

## ```expireSelector()```
The redux selector to retrieve only the token expiration time in seconds :

## ```loginSelector()```
The redux selector to return the state of the login :
```json
{
  "loading": true || false, // Is the user connecting ?
  "logged": true || false // Is the user connected ?
}
```

## ```profileSelector()```
The redux selector to return the auth profile infos :
```json
{
  "fullName": "firstName lastName",
  "picture": "url/of/picture/profile"
}
```

## ```logoutAuthAction()```
The redux action to disconnect the user and clear storage and cookies.

## ```deleteAuthAction()```
The redux action to only clear storage and cookies.


## Environment variable
```.env
REACT_APP_AUTH_API_URL = 'http://your/login/api/'
REACT_APP_AUTH_DOMAIN = 'localhost' // (string): domain for the cookie (sub.domain.com or .allsubdomains.com)
```

## 🚀 Simple Example 
In this example we do not detail the creation of a react application, or the integration of dotenv, redux and react-router-dom packages.  
We present the integration of react-lumilock-sso in two applications which are on the same domain.
So we have a `create-react-app` on `http://localhost:3000/`, a `parcel` app on `http://localhost:1234/` and an `lumilock` API on `http://localhost:8000/`.  
  
On the two front-end app we install the `react-lumilock-sso` package.
```shell
npm install react-lumilock-sso
```
### Parcel app
First we add environnement variable in `.env`

#### `file : .env` 
```.env
REACT_APP_AUTH_API_URL = 'http://localhost:8000/api/auth/'
```
Then we configure the  `redux` store

#### `file : ./store/index.js` 
```jsx
...
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
Now we can add the protected route to our app, for this exemple we made all the route inside the root of the project.  
#### `file : ./index.js`
```jsx
...
import { LumilockProvider, ProtectedRoutes } from "react-lumilock-sso";
...
function App() {
  ...
  return (
    <Provider store={store}>
      <LumilockProvider>
        <Router>
         ...
          <Switch>
            ...
            <ProtectedRoutes path="/dashboard" external="http://localhost:3000/login" exact component={Dashboard} />
            <ProtectedRoutes path="/profile" external="http://localhost:3000/login" exact component={Profile} />
            ...
          </Switch>
        </Router>
      </LumilockProvider>
    </Provider>
  );
}
```
### Create-react-app
First we add environnement variable in `.env`

#### `file : .env` 
```.env
REACT_APP_AUTH_API_URL = 'http://localhost:8000/api/auth/'
```
Then we configure the  `redux` store

#### `file : ./src/store/index.js` 
```jsx
...
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
Now we can add the protected route to our app, for this exemple we made all the route inside the root of the project.  
#### `file : ./src/App.js`
```jsx
...
import { LumilockProvider, ProtectedRoutes, GuestRoutes } from "react-lumilock-sso";
...
function App() {
  ...
  return (
    <Provider store={store}>
      <LumilockProvider>
        <Router>
         ...
          <Switch>
            ...
            <GuestRoutes path="/login" exact component={Login} />
            <ProtectedRoutes path="/dashboard" redirect="/login" exact component={Dashboard} />
            <ProtectedRoutes path="/profile" redirect="/login" exact component={Profile} />
            ...
          </Switch>
        </Router>
      </LumilockProvider>
    </Provider>
  );
}
```
The last thing to do is create a login page.
#### `file : ./src/pages/Login.jsx`
```jsx
...
import { LoginForm } from 'react-lumilock-sso'
...
const Login = () => {
  return <div>
      <h1>Login</h1>
      <LoginForm
          renderForm={
          (message, identity, password, loading) => (
            <>
              <Message error={message ?? ''} /> {/* Message is your component to visualize messages */}
              <Identity error={identity?.length > 0 ? identity[0] : ''} /> {/* Identity is your input field with id and name `identity` */}
              <Password error={password?.length > 0 ? password[0] : ''} /> {/* Password is your input field with id and name `password` */}
              <Submit disabled={!!loading} /> {/* Submit is your submit field */}
            </>
          )
        }
        />
    </div>
}
export default Login
```

### Conclusion
We saw how to set up an sso system between two React projects, putting the login page on only one of the two projects. Obviously it is possible to put connection pages on each of your projects, in order to avoid reloading your applications during redirects

## 📅 soon
- [ ] add permissions

## 📰 Change log

Please see the [changelog](changelog.md) for more information on what has changed recently.


## 👨‍👩‍👧‍👦 Credits

- [lumilock (Thibaud PERRIN)][link-author]


## 📝 License

license. Please see the [license file](license.md) for more information.

[link-author]: https://github.com/lumilock
[link-contributors]: ../../contributors]