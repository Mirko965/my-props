import React, { Component } from 'react'
import { connect} from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { resPassword } from '../actions/authenticationAction'
import TextFieldGroup from '../common/TextFieldGroup'

class ResetPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newPassword:'',
      newPassword2:''
    }
  }

  componentDidMount = () => {
    this.props.authenticate.isAuthenticate = false
  }
  onChange = (event) => {
    event.persist()
    this.setState(() => ({
      [event.target.name]:event.target.value
    }))
  }
  passwordOnSubmit = (event) => {
    event.preventDefault()
    const newPassword = this.state.newPassword
    const newPassword2 = this.state.newPassword2

    this.props.resPassword(newPassword,newPassword2,this.props.history)
    this.setState(() => ({
      newPassword:'',
      newPassword2:''
    }))
  }

  render () {
    const token = this.props.match.params.username
    const decodeUsername = jwt.decode(token)
    const username = decodeUsername.username
    const {errors} = this.props

    let content

    if (username){
      content = (
        <div className='form'>
          <h1>Hello {username}</h1>
          <h1>Reset Password</h1>
          {errors.password ? <p className='errorText'>{errors.password}</p> : <p>Sign in to your account</p>}

          <form className='form__input' onSubmit={this.passwordOnSubmit}>

            <TextFieldGroup
              placeholder="Password"
              name="newPassword"
              type="password"
              value={this.state.newPassword}
              onChange={this.onChange}
              error={errors.newPassword}
            />

            <TextFieldGroup
              placeholder="Confirm Password"
              name="newPassword2"
              type="password"
              value={this.state.newPassword2}
              onChange={this.onChange}
              error={errors.newPassword2}
            />

            <button className='form__input--button'>Submit</button>
          </form>

        </div>
      )
    } else {
      return <Redirect to='/'/>
    }

    return (
      <div>
        {content}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authenticate:state.authenticate,
    username:state.authenticate.username,
    errors:state.errors
  }
}
export default withRouter(connect(mapStateToProps, {resPassword})(ResetPassword))
