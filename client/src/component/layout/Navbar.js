import React, { Component } from 'react'
import { NavLink,withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import { logoutUser } from '../actions/authenticationAction'


const active = {
  color: 'red'
}
class Navbar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      avatar:'',
      username:''
    }
  }
  logoutUser = () => {
    this.props.logoutUser()
  }
  render () {
    const {isAuthenticate} = this.props.authenticate
    const {username} = this.props
    const authLink = (
      <nav className='menu__authLink'>
        <NavLink
          to={`/${username}`}
          activeStyle={active}
          className='menu__username'
        >
          {username}
        </NavLink>
        <img
          className="menu__img"
          src={this.props.avatar}
          alt={this.props.username}
        />{' '}
        <button
          onClick={this.logoutUser}
          className='button__invisible--black'>
          Logout
        </button>
      </nav>
    )

    return (
      <div>
        <header className='header'>
          <nav className='menu'>

            <div className='menu__developers'>
              <NavLink exact to='/' activeStyle={active}>Home</NavLink>
              <NavLink exact to='/authentication' activeStyle={active}>Authentication</NavLink>
            </div>
            {isAuthenticate && authLink}
          </nav>
        </header>
      </div>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    authenticate:state.authenticate,
    avatar:state.authenticate.avatar,
    username:state.authenticate.username,
  }
}
export default withRouter(connect(mapStateToProps,{logoutUser}, null, {pure:false})(Navbar))
