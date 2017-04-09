import React, { Component } from 'react'
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom'
import Main from 'Main'
import Navigation from 'Navigation'
import { firebaseAuth } from '../firebase/constants'

const App = () => (
  <div>
    <Navigation />
    <Main />
  </div>
)

export default App



//   render () {
//     return this.state.loading === true ? <h1>Loading</h1> : (
//       <BrowserRouter>
//         <div>
//           <Navigation authed={this.state.authed} />
//           <div className='container'>
//             <div className='row'>
//               <Switch>
//                 <Route exact path='/' component={Home} />
//                 <PublicRoute authed={this.state.authed} path='/login' component={Login} />
//                 <PublicRoute authed={this.state.authed} path='/register' component={Register} />
//                 <PrivateRoute authed={this.state.authed} path='/dashboard' component={Dashboard} />
//                 <Route render={() => <h3>No Match</h3>} />
//               </Switch>
//             </div>
//           </div>
//         </div>
//       </BrowserRouter>
//     )
//   }
// }
