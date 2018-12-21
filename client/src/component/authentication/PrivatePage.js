import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from '../common/Spinner'

class PrivatePage extends Component {
  render () {

    const {authenticate} = this.props
    let content

    if (authenticate.name === undefined || authenticate.avatar === undefined) {
      content = <Spinner/>
    } else {
      if (authenticate.isAuthenticate === true) {
        content = (
          <div className='private'>
            <h1>This is private page</h1>
            <div className='private__img'>
              <img src={authenticate.avatar} alt={authenticate.username}/>
            </div>
            <div className='private__creds'>
              <p>Name: {authenticate.name}</p>
              <p>Email: {authenticate.email}</p>
              <p>Username: {authenticate.username}</p>
            </div>
          </div>
        )
      }
    }


    return (
      <div className='private__content'>
        {content}
      </div>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    authenticate:state.authenticate
  }
}
export default connect(mapStateToProps)(PrivatePage)
