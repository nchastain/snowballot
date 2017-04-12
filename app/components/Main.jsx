import React, { Component } from 'react'
import Dashboard from './Dashboard'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import SbDetail from './SbDetail'
import { firebaseAuth } from '../firebase/constants'
import { Switch, Route, Redirect } from 'react-router-dom'

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/dashboard/snowballots' />}
    />
  )
}

class Main extends Component {
  constructor (props) {
    super(props)
    this.state = {
      authed: false,
      loading: true
    }
  }

  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }

  componentWillUnmount () {
    this.removeListener()
  }

  render () {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Home} />
          <PublicRoute authed={this.state.authed} path='/login' component={Login} />
          <PublicRoute authed={this.state.authed} path='/register' component={Register} />
          <PrivateRoute exact authed={this.state.authed} path='/dashboard/snowballots' component={Dashboard} />
          <Route path='/dashboard/snowballots/:alias' component={SbDetail} />
          <Route render={() => <h3>No Match</h3>} />
        </Switch>
      </main>
    )
  }
}

export default Main
