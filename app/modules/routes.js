import React, { Component } from 'react'
import { Route, IndexRoute } from 'react-router'
import App from 'App'
import Login from 'Login'
import Register from 'Register'
import Home from 'Home'
import Dashboard from 'Dashboard'
import Navigation from 'Navigation'
import { firebaseAuth } from '../firebase/constants'

module.exports = (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='dashboard' component={Dashboard} />
    <Route path='register' component={Register} />
    <Route path='login' component={Login} />
  </Route>
)