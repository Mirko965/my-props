import React, { Component } from 'react'
import connect from 'react-redux/es/connect/connect'
import { withRouter } from 'react-router-dom'
import { loginUser, registerUser } from '../actions/authenticationAction'
import RegisterModal from '../modal/RegisterModal'
import { clearErrors } from '../actions/errorsAction'
import {
  modalLoginClose,
  modalLoginOpen,
  modalRegisterClose,
  modalRegisterOpen, modalVerifyEmailClose,
  modalVerifyEmailOpen
} from '../actions/modalAction'
import AuthenticationText from './AuthenticationText'
import LoginModal from '../modal/LoginModal'
import VerifyEmail from '../modal/VerifyEmail'

class Authentication extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      username:'',
      password: '',
      password2: '',
      errors: {}
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.errors){
      this.setState(() => ({
        errors:nextProps.errors,
      }))
    }
  }
  registerModalOpen = () => {
    this.props.clearErrors()
    this.props.modalRegisterOpen()
  }
  registerModalClose = () => {
    this.props.modalRegisterClose()
  }
  loginModalOpen = () => {
    this.props.clearErrors()
    this.props.modalLoginOpen()
  }
  loginModalClose = () => {
    this.props.modalLoginClose()
  }
  onChange = (event) => {
    event.persist()
    this.setState(() => ({
      [event.target.name]: event.target.value
    }))
  }

  onSubmit = (event) => {
    event.preventDefault()
    const user = {
      name: this.state.name,
      email: this.state.email,
      username:this.state.username,
      password: this.state.password,
      password2: this.state.password2,
    }
    this.props.registerUser(user)
    this.setState(() => ({
      name: '',
      email: '',
      username:'',
      password: '',
      password2: ''
    }))
  }
  loginOnSubmit = (event) => {
    event.preventDefault()
    const user = {
      email:this.state.email,
      password: this.state.password
    }
    this.props.loginUser(user,this.props.history)
    this.setState(() => ({
      email: '',
      password: ''
    }))
  }

  render () {

    const {errors} = this.state

    return (

      <div className='authentication'>
        <h1>Authentication</h1>
        <div className='authentication__button'>
          <button onClick={this.loginModalOpen}>Login</button>
          <button onClick={this.registerModalOpen}>Sign Up</button>
        </div>
        <AuthenticationText/>
        <RegisterModal
          isOpen={this.props.modal.modalRegisterIsOpen}
          onChange={this.onChange}
          onRequestClose={this.registerModalClose}
          onSubmit={this.onSubmit}
          nameValue={this.state.name}
          nameError={errors.name}
          emailValue={this.state.email}
          emailError={errors.email}
          usernameValue={this.state.username}
          usernameError={errors.username}
          passValue={this.state.password}
          passError={errors.password}
          pass2Value={this.state.password2}
          pass2Error={errors.password2}
        />
        <LoginModal
          isOpen={this.props.modal.modalLoginIsOpen}
          onRequestClose={this.loginModalClose}
          onSubmit={this.loginOnSubmit}
          onChange={this.onChange}
          password={this.state.password}
          email={this.state.email}
          errors={errors}
        />

        <VerifyEmail
          isOpen={this.props.modal.modalVerifyEmailOpen}
          onRequestClose={this.props.modal.modalVerifyEmailClose}
        />

      </div>
    )
  }
}


const mapStateToProps = (state) => {

  return {
    authentication:state.authentication,
    errors:state.errors,
    modal:state.modal
  }
}
export default withRouter(connect(mapStateToProps, {registerUser,loginUser, clearErrors, modalRegisterOpen, modalRegisterClose,modalLoginOpen,modalLoginClose, modalVerifyEmailOpen, modalVerifyEmailClose})(Authentication))
