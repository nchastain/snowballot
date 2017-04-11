import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import * as actions from '../actions'
import SbDetail from './SbDetail'
import SbList from './SbList'

const Dashboard = () => (
  <Switch>
    <Route exact path='/dashboard/snowballots' component={SbList} />
    <Route path='/dashboard/snowballots/:id' component={SbDetail} />
  </Switch>
)

export default Dashboard
