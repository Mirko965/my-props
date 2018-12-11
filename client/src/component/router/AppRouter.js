import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Landing from '../layout/Landing'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import Authentication from '../authentication/Authentication'
import PrivateRoute from '../common/PrivateRoute'
import PrivatePage from '../authentication/PrivatePage'

const AppRouter = () => {
  return (
    <Router>
      <div className='main'>
        <Navbar/>
        <Switch>
          <Route exact path='/' component={Landing}/>
          <Route exact path='/authentication' component={Authentication}/>
          <PrivateRoute exact path='/:username' component={PrivatePage}/>
        </Switch>
        <Footer/>
      </div>
    </Router>
  )
}

export default AppRouter
