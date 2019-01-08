import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Landing from '../layout/Landing'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import Authentication from '../authentication/Authentication'
import PrivateRoute from '../common/PrivateRoute'
import PrivatePage from '../authentication/PrivatePage'
import VerifyRegistration from '../authentication/VerifyRegistration'
import VerifyPassword from '../authentication/VerifyPassword'
import ResetPassword from '../authentication/ResetPassword'
import PageNotFound from '../layout/PageNotFound'

const AppRouter = () => {
  return (
    <Router>
      <div className='main'>
        <Navbar/>
        <Switch>
          <Route exact path='/' component={Landing}/>
          <Route exact path='/authentication' component={Authentication}/>
          <Route exact path='/verifyRegistration' component={VerifyRegistration}/>

          <Route exact path='/forgotPassword' component={VerifyPassword}/>
          <Route exact path='/verifyPassword' component={VerifyPassword}/>
          <PrivateRoute exact path='/:username' component={PrivatePage}/>
          <Route exact path='/resetPassword/:username' component={ResetPassword}/>
          <Route component={PageNotFound}/>
        </Switch>
        <Footer/>
      </div>
    </Router>
  )
}

export default AppRouter
