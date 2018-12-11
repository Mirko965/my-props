import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


const PrivateRoute = ({ component: Component, authenticate, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticate.isAuthenticate === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);


const mapStateToProps = state => {
  return {
    authenticate:state.authenticate
  }
};

export default connect(mapStateToProps)(PrivateRoute);
